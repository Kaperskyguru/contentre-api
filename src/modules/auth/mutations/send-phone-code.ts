import { useErrorParser } from '@/helpers'
import { environment } from '@/helpers/environment'
import { logError, logMutation } from '@/helpers/logger'
import { Context } from '@/types'
import { MutationSendPhoneCodeArgs } from '@/types/modules'
import sendSms from '@extensions/phone-service/send-sms'
import { ApolloError } from 'apollo-server-errors'

export default async (
  _parent: unknown,
  input: MutationSendPhoneCodeArgs,
  { user, sentryId, prisma, ipAddress, requestURL, locale }: Context
): Promise<boolean> => {
  const { phoneCode, phoneNumber } = input
  logMutation('sendPhoneCode %o', {
    input,
    user,
    ipAddress,
    requestURL
  })

  // User must be logged in before performing the operation.
  if (!user) throw new ApolloError('You must be logged in.', '401')
  if (!ipAddress?.address) throw new ApolloError('Forbidden.', '403')

  try {
    // Check if no Twilio configuration in develop context.
    const isDevelop =
      !environment.twilio && ['LOCAL', 'DEVELOP'].includes(environment.context)

    // Try to find phone verification intents of the current user.
    const intentsCount = await prisma.$queryRaw`
      SELECT COUNT("id") "count"
      FROM "VerificationIntent"
      WHERE "type" = 'PHONE'
        AND "createdAt" >= (NOW() AT TIME ZONE 'UTC' - INTERVAL '1' HOUR)
        AND "expiresAt" > (NOW() AT TIME ZONE 'UTC')
        AND ("userId" = ${user.id}
        OR "ipAddress" = ${ipAddress.address})
    `.then((data: any) => data[0].count as number)

    // If at least 3 intents was already created and still not expired.
    if (intentsCount >= 3) {
      throw new ApolloError('3 intents limit', '403')
    }

    // Generate a 6 digit code.
    const refreshCode = isDevelop
      ? '123456'
      : String(Math.floor(100000 + Math.random() * 900000))

    // Create a new phone intent before sending the SMS code.
    // NOTE: A trigger in the `VerificationIntent` table will guarantee
    // that old expired intents are also deleted along with this insert.
    const intent = await prisma.verificationIntent.create({
      data: {
        userId: user.id,
        type: 'PHONE',
        refreshCode
        // ipAddress: ipAddress.address
      }
    })

    // If not in development mode, send the real SMS.
    if (!isDevelop) {
      await sendSms({
        to: `+${phoneCode}${phoneNumber}`,
        // sms: getSmsLocale(locale!, refreshCode),
        code: phoneCode
      })
    }

    return !!intent
  } catch (e) {
    logError('sendPhoneCode %o', {
      input,
      user,
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

    if (message === 'invalid phone number')
      throw new ApolloError(
        'Please check the provided phone number and try again.',
        '400',
        { handled: true }
      )

    if (message === 'unreachable phone number')
      throw new ApolloError(
        'Impossible to deliver the message for the provided phone number, please provide a different phone number or try again later.',
        '400',
        { handled: true }
      )

    throw new ApolloError(message, e.code ?? '500', { sentryId })
  }

  return true
}
