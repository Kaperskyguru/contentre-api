import { useErrorParser } from '@helpers'
import { getUser } from '@helpers/getUser'
import { logError, logMutation } from '@helpers/logger'
import { MutationUsePhoneCodeArgs, User } from '@modules-types'
import { Context } from '@types'
import sendToSegment from '@/extensions/segment-service/segment'
import { ApolloError } from 'apollo-server-errors'

export default async (
  _parent: unknown,
  input: MutationUsePhoneCodeArgs,
  { user, sentryId, prisma, ipAddress, requestURL }: Context
): Promise<User> => {
  const { code } = input
  logMutation('usePhoneCode %o', {
    input,
    user,
    ipAddress,
    requestURL
  })
  try {
    // User must be logged in before performing the operation.
    if (!user) throw new ApolloError('You must be logged in.', '401')
    if (!ipAddress?.address) throw new ApolloError('Forbidden.', '403')

    // Try to find valid phone verification intents not expired for this user.
    const validIntents = await prisma.$queryRaw`
      SELECT COUNT("id") "count"
      FROM "VerificationIntent"
      WHERE "type" = 'PHONE'
        AND "refreshCode" = ${code}
        AND "expiresAt" > (NOW() AT TIME ZONE 'UTC')
        AND "userId" = ${user.id}
    `.then((data: any) => data[0].count as number)

    if (!validIntents) throw new Error('invalid code')

    // Store the user update operation for running in a transaction.
    const updateUser = prisma.user.update({
      where: { id: user.id },
      data: { phoneConfirmed: true }
    })

    // Store the intents delete operation for running in a transaction.
    const deleteIntents = prisma.verificationIntent.deleteMany({
      where: { userId: user.id, type: 'PHONE' }
    })

    // Run a transaction to ensure operations succeeds together.
    const [updatedUser] = await prisma.$transaction([updateUser, deleteIntents])

    // Send data to Segment.
    const segmentData = {
      email: user.email,
      phone: user.phoneNumber,
      hasFinishedOnboarding: user.hasFinishedOnboarding,
      phoneConfirmed: true,
      ipAddress
    }

    await sendToSegment({
      operation: 'identify',
      userId: user.id,
      data: segmentData
    })

    if (requestURL?.includes('/auth/register/verify-phone')) {
      await sendToSegment({
        operation: 'identify',
        userId: user.id,
        data: {
          lifecyclestage: '8117148',
          email: user.email,
          hasFinishedOnboarding: updatedUser.hasFinishedOnboarding
        }
      })
      await sendToSegment({
        operation: 'track',
        eventName: 'onboarding_phone_confirmed',
        userId: user.id,
        data: segmentData
      })
      await sendToSegment({
        operation: 'track',
        eventName: 'signup_completed',
        userId: user.id,
        data: {
          ...user,
          name: user.name,
          hasFinishedOnboarding: updatedUser.hasFinishedOnboarding
        }
      })
      await sendToSegment({
        operation: 'pageview',
        userId: user.id,
        pageName: 'update_content',
        data: {
          email: user.email
        }
      })
    } else {
      await sendToSegment({
        operation: 'track',
        eventName: 'phone_confirmed',
        userId: user.id,
        data: segmentData
      })
    }

    await sendToSegment({
      operation: 'track',
      eventName: 'signup_completed',
      userId: user.id,
      data: {
        ...user,
        name: user.name,
        hasFinishedOnboarding: updatedUser.hasFinishedOnboarding
      }
    })

    // Get the formatted updated user to return.
    return getUser(updatedUser)
  } catch (e) {
    logError('usePhoneCode %o', {
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
