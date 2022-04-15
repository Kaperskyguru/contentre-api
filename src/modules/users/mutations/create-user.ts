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
import { createPortfolio } from '@/modules/portfolios/helpers/create-portfolio'

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
    user = await prisma.user.findUnique({ where: { email: input.email } })

    if (user && !user.emailConfirmed) {
      setJWT(user, setCookies)
      throw new ApolloError('verify email')
    }
    user = null
    const data: Record<string, unknown> = {}

    if (input.referrer) {
      const referredUser = await prisma.user.findFirst({
        where: { username: input.referrer }
      })
      if (referredUser) data.referrerId = referredUser.id
    }

    // If success, create a new user in our DB.
    user = await prisma.user.create({
      data: {
        email: input.email,
        username: input.username,
        name: input.name,
        signedUpThrough: input.signedUpThrough!,
        portfolio: `${environment.domain}/${input.username}`,
        password: await hashPassword(input.password),
        ...data
      }
    })

    // Create billing User

    //Find sub where it's free
    const sub = await prisma.subscription.findFirst({ where: { name: 'free' } })

    //Update user
    await prisma.user.update({
      where: { id: user.id },
      data: {
        billingId: 'BillingId',
        subscriptionId: sub?.id
      }
    })

    // Send data to Segment.
    const segmentData: Record<string, string | boolean | Date | null> = {
      createdAt: user.createdAt,
      email: user.email,
      name: user.name,
      hasFinishedOnboarding: user.hasFinishedOnboarding,
      lastActivityAt: user.lastActivityAt
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
      userId: user.id,
      data: {
        ...segmentData,
        signedUpThrough: input.signedUpThrough
      }
    })

    setJWT(user, setCookies)

    // Create Default portfolio
    createPortfolio(
      {
        url: `${environment.domain}/${input.username}`,
        title: 'Default',
        description: 'This is your default portfolio'
      },
      context
    )

    return getUser(user)
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
