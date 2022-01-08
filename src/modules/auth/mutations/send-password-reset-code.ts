import { useErrorParser } from '@/helpers'
import { environment } from '@/helpers/environment'
import { logError, logMutation } from '@/helpers/logger'
import { Context } from '@/types'
import { MutationSendPasswordResetCodeArgs } from '@/types/modules'
import sendEmail from '@extensions/mail-service/send-email'
import { ApolloError } from 'apollo-server-core'

export default async (
  _parent: unknown,
  input: MutationSendPasswordResetCodeArgs,
  { sentryId, prisma, ipAddress, requestURL, requestOrigin }: Context
): Promise<boolean> => {
  const { email } = input
  logMutation('sendPasswordResetCode %o', {
    input,
    ipAddress,
    requestURL,
    requestOrigin
  })

  try {
    if (!ipAddress?.address) throw new ApolloError('Forbidden.', '403')

    // Try to find the user based on the received email.
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) throw new Error('user not found')

    // Check if no Mailgun configuration in develop context.
    const isDevelop =
      !environment.mail && ['LOCAL', 'DEVELOP'].includes(environment.context)

    // Try to find phone verification intents of the current user.
    const intentsCount = await prisma.$queryRaw`
    SELECT COUNT("id") "count"
    FROM "VerificationIntent"
    WHERE "type" = 'EMAIL'
      AND "createdAt" >= (NOW() AT TIME ZONE 'UTC' - INTERVAL '1' HOUR)
      AND "expiresAt" > (NOW() AT TIME ZONE 'UTC')
      AND ("userId" = ${user.id})
  `.then((data: any) => data[0].count as number)

    // If at least 3 intents was already created and still not expired.
    if (intentsCount >= 3) {
      throw new ApolloError('3 intents limit', '403')
    }

    // Generate a 6 digit code.
    const refreshCode = isDevelop
      ? '123456'
      : String(Math.floor(100000 + Math.random() * 900000))

    // Create a new email intent before sending the code.
    // NOTE: A trigger in the `VerificationIntent` table will guarantee
    // that old expired intents are also deleted along with this insert.
    const intent = await prisma.verificationIntent.create({
      data: {
        userId: user.id,
        type: 'EMAIL',
        refreshCode
        // ipAddress: ipAddress.address
      }
    })

    // If not in development mode, send the real email.
    if (!isDevelop) {
      await sendEmail({
        to: email,
        subject: 'Password reset request',
        template: 'forgot-password',
        variables: {
          code: refreshCode,
          email: user.email,
          to_name: user.name,
          BASE_URL: requestOrigin
        }
      })
    }

    return !!intent
  } catch (e) {
    logError('sendPasswordResetCode %o', {
      input,
      ipAddress,
      requestURL,
      error: e
    })

    const message = useErrorParser(e)

    if (message === '3 intents limit')
      throw new ApolloError(
        'Maximum number of verification codes per hour reached.',
        '403',
        { handled: true }
      )

    if (message === 'invalid email address')
      throw new ApolloError(
        'Please check the provided email address and try again.',
        '400',
        { handled: true }
      )

    if (message === 'try email again later')
      throw new ApolloError(
        'Impossible to deliver the message for the provided email address, please provide a different email or try again later.',
        '400',
        { handled: true }
      )

    if (message.includes('user not found'))
      throw new ApolloError('User not found', '404', { handled: true })

    throw new ApolloError(message, e.code ?? '500', { sentryId })
  }
}
