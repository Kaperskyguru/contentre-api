import { useErrorParser } from '@/helpers'
import { environment } from '@/helpers/environment'
import { getUser } from '@/helpers/getUser'
import { logError, logMutation } from '@/helpers/logger'
import { hashPassword } from '@/helpers/passwords'
import { Context } from '@/types'
import { MutationResetPasswordArgs } from '@/types/modules'
import { ApolloError } from 'apollo-server-core'
import sendPhoneCode from './send-phone-code'

export default async (
  _parent: unknown,
  input: MutationResetPasswordArgs,
  context: Context & Required<Context>
) => {
  const { newPassword } = input
  const { user, sentryId, prisma, ipAddress, requestURL } = context
  logMutation('resetPassword %o', { input, user, ipAddress, requestURL })

  try {
    // User must be logged in before performing the operation.
    if (!user) throw new ApolloError('You must be logged in.', '401')

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        password: await hashPassword(newPassword)
      }
    })

    // Check if no Mailgun configuration in develop context.
    const isDevelop =
      !environment.mailgun && ['LOCAL', 'DEVELOP'].includes(environment.context)

    if (!isDevelop) {
      //   await sendEmail({
      //     to: user.email,
      //     subject: 'Password changed',
      //     template: 'password_changed',
      //     variables: {
      //       FIRST_NAME: user.name as string
      //     }
      //   })
    }

    // If the user still needs to confirm the phone after authentication.
    if (
      !updatedUser.phoneConfirmed &&
      updatedUser.phoneCode &&
      updatedUser.phoneNumber
    ) {
      // Call the mutation to send the phone verification code.
      await sendPhoneCode(
        _parent,
        {
          phoneCode: updatedUser.phoneCode,
          phoneNumber: updatedUser.phoneNumber
        },
        context
      )
    }

    return getUser(updatedUser)
  } catch (e) {
    logError('resetPassword %o', {
      input,
      user,
      ipAddress,
      requestURL,
      error: e
    })

    const message = useErrorParser(e)
    throw new ApolloError(message, e.code ?? '500', { sentryId })
  }
}
