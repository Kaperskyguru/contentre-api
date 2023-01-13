import { VerificationIntent } from '.prisma/client'
import { useErrorParser } from '@/helpers'
import { environment } from '@/helpers/environment'
import { getUser } from '@/helpers/getUser'
import { logError, logMutation } from '@/helpers/logger'
import setJWT from '@/helpers/setJWT'
import { Context } from '@/types'
import { MutationUseEmailCodeArgs, User } from '@/types/modules'
import sendEmail from '@extensions/mail-service/send-email'
import mailchimp from '@extensions/mailchimp'
import { ApolloError } from 'apollo-server-core'
import sendToSegment from '@/extensions/segment-service/segment'
import { createPortfolio } from '@/modules/portfolios/helpers/create-portfolio'

export default async (
  _parent: unknown,
  input: MutationUseEmailCodeArgs,
  { setCookies, user, sentryId, prisma, ipAddress, requestURL }: Context
): Promise<User> => {
  const { code } = input
  logMutation('useEmailCode %o', {
    input,
    user,
    ipAddress,
    requestURL
  })

  try {
    // User must be logged or a refresh code should be present.
    if (!user) throw new ApolloError('You must be logged in.', '401')
    if (!code) throw new ApolloError('invalid code', '422')
    if (!ipAddress?.address) throw new ApolloError('Forbidden.', '403')

    // Try to find valid email verification intents not expired with this code.
    const validIntents = await prisma.$queryRaw<VerificationIntent[]>`
  SELECT *
  FROM "VerificationIntent"
  WHERE "type" = 'EMAIL'
    AND "refreshCode" = ${code}
    AND "expiresAt" > (NOW() AT TIME ZONE 'UTC')
`

    if (!validIntents.length) throw new Error('invalid code')

    // Check if all intents are for the same user.
    const userIds = [
      ...new Set(validIntents.map((intent: any) => intent.userId))
    ]
    if (userIds.length > 1) throw new Error('invalid code')

    // Check if the code was not for the logged in user.
    const userId = userIds[0]
    if (user && user.id !== userId) {
      throw new Error('invalid code')
    }

    const lowerCasedUsername = user?.username?.toLocaleLowerCase()
    const portfolioURL = `${environment.domain}/${lowerCasedUsername}`

    // Store the user update operation for running in a transaction.
    const updateUser = prisma.user.update({
      where: { id: userId },
      data: {
        emailConfirmed: true,
        portfolioURL
      },
      include: { activeSubscription: true }
    })

    // Store the intents delete operation for running in a transaction.
    const deleteIntents = prisma.verificationIntent.deleteMany({
      where: { userId, type: 'EMAIL' }
    })

    // Run a transaction to ensure operations succeeds together.
    const [updatedUser] = await prisma.$transaction([updateUser, deleteIntents])

    // Authenticate the user since the identity was already proven.
    setJWT(updatedUser, setCookies!)
    // Get the formatted updated user to return.

    // Create Default portfolio
    createPortfolio(
      {
        url: portfolioURL,
        title: 'Default',
        description: 'This is your default portfolio',
        shouldCustomize: false,
        showInDirectory: true
      },
      { user, prisma }
    )

    //Create Personal Notebook
    await prisma.notebook.create({
      data: {
        name: 'Personal Notebook',
        user: { connect: { id: updatedUser.id } },
        team: { connect: { id: updatedUser?.activeTeamId! } }
      }
    })

    // Check if no Mailgun configuration in develop context.
    const isDevelop =
      !environment.mail && ['LOCAL', 'DEVELOP'].includes(environment.context)

    // Send this to queue
    if (!isDevelop) {
      //Subscribe mailchimp
      try {
        await mailchimp({
          name: updatedUser.name,
          email: updatedUser.email,
          tags: ['contentre_welcome_signup']
        })
      } catch (error) {}

      await sendEmail({
        to: updatedUser.email,
        subject: 'Welcome to Contentre!',
        template: 'welcome',
        variables: {
          to_name: updatedUser.name as string,
          username: updatedUser.username as string
        }
      })
    }

    const segmentData = {
      email: updatedUser.email,
      emailConfirmed: true,
      username: updatedUser.username,
      portfolio: updatedUser.portfolioURL,
      ipAddress
    }

    await sendToSegment({
      operation: 'identify',
      userId: updatedUser.id,
      data: segmentData
    })

    await sendToSegment({
      operation: 'track',
      eventName: 'onboarding_email_confirmed',
      userId: updatedUser.id,
      data: segmentData
    })

    return getUser(updatedUser)
  } catch (e) {
    logError('useEmailCode %o', {
      input,
      user,
      ipAddress,
      requestURL,
      error: e
    })

    const message = useErrorParser(e)

    if (message === 'invalid code')
      throw new ApolloError('Invalid confirmation code.', '404')

    throw new ApolloError(message, e.code ?? '500', { sentryId })
  }
}
