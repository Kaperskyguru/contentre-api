import { hashPassword } from '@/helpers/passwords'
import { useErrorParser } from '@helpers'
import { getUser } from '@helpers/getUser'
import { logError, logMutation } from '@helpers/logger'
import { setJWT } from '@helpers/setJWT'
import { MutationCreateUserArgs, User } from '@modules-types'
import { User as DBUser } from '@prisma/client'
import { Context } from '@types'
import { ApolloError } from 'apollo-server-errors'
import sendToSegment from '@/extensions/segment-service/segment'
import { environment } from '@/helpers/environment'

export default async (
  _parent: unknown,
  { input }: MutationCreateUserArgs,
  context: Context & Required<Context>
): Promise<User> => {
  const { setCookies, sentryId, prisma, ipAddress, requestURL, requestOrigin } =
    context
  logMutation('createUser %o', { input, ipAddress, requestURL, requestOrigin })

  // Will be filled by the user creation process below.
  let user: DBUser | null = null

  try {
    // Checking if user already exists, but did not verify email
    user = await prisma.user.findFirst({
      where: { email: { equals: input.email, mode: 'insensitive' } },
      include: { activeSubscription: true }
    })

    if (user && !user.emailConfirmed) {
      setJWT(user, setCookies)
      throw new ApolloError('verify email')
    }

    if (user) {
      throw new ApolloError('Unique constraint failed')
    }
    user = null
    const data: Record<string, unknown> = {}

    if (input.referrer) {
      const referredUser = await prisma.user.findFirst({
        where: { username: { equals: input.referrer, mode: 'insensitive' } }
      })
      if (referredUser) data.referrerId = referredUser.id
    }

    // Create billing User
    //Find sub where it's free
    const plan = await prisma.plan.findFirst({ where: { name: 'Basic' } })

    const lowerCasedUsername = input.username.toLocaleLowerCase()

    // If success, create a new user in our DB.
    user = await prisma.user.create({
      data: {
        email: input.email,
        username: lowerCasedUsername,
        billingId: 'BillingId',
        name: input.name,
        signedUpThrough: input.signedUpThrough!,
        password: await hashPassword(input.password),
        ...data
      },
      include: { activeSubscription: true }
    })

    const sub = await prisma.subscription.create({
      data: {
        name: plan?.name!,
        userId: user?.id!,
        teamId: user.activeTeamId,
        planId: plan?.id!
      }
    })

    const updateUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        subscription: { connect: { id: sub.id } },
        activeSubscription: { connect: { id: sub.id } },
        activeTeam: {
          create: {
            role: 'ADMIN',
            user: {
              connect: { id: user?.id }
            },
            team: {
              create: {
                name: 'Personal',
                activeSubscription: { connect: { id: sub.id } }
              }
            }
          }
        }
      }
    })

    if (!updateUser) throw new ApolloError('User could not be created', '401')

    // Send data to Segment.
    const segmentData: Record<string, string | boolean | Date | null> = {
      createdAt: updateUser.createdAt,
      email: updateUser.email,
      name: updateUser.name,
      hasFinishedOnboarding: updateUser.hasFinishedOnboarding,
      lastActivityAt: updateUser.lastActivityAt
    }

    if (input.language) {
      segmentData.language = input.language
    }

    if (input.analyticsSource) {
      segmentData.hs_analytics_source = input.analyticsSource
    }

    if (input.analyticsSourceData) {
      segmentData.source = input.analyticsSourceData
    }

    if (input.source) {
      segmentData.customTrafficSource = input.source
    }

    await sendToSegment({
      operation: 'identify',
      userId: user.id,
      data: {
        ...segmentData,
        lifecyclestage: '8413994'
      }
    })

    await sendToSegment({
      operation: 'track',
      eventName: 'user_created',
      userId: updateUser.id,
      data: {
        ...segmentData,
        signedUpThrough: input.signedUpThrough,
        username: updateUser.username,
        portfolio: updateUser.portfolioURL
      }
    })

    setJWT(updateUser, setCookies)

    return getUser(updateUser)
  } catch (e) {
    logError('createUser %o', {
      input,
      ipAddress,
      requestURL,
      requestOrigin,
      error: e
    })

    const message = useErrorParser(e)

    if (
      message.includes('Unique constraint failed') ||
      message === 'Request failed with status code 409'
    )
      throw new ApolloError('That email address is already registered.', '400')

    if (message.includes('verify email'))
      throw new ApolloError(
        'Please check your inbox to verify your email',
        '400'
      )

    throw new ApolloError(message, e.code ?? '500', { sentryId })
  }
}
