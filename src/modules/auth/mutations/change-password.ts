import { useErrorParser } from '@/helpers'
import { getUser } from '@/helpers/getUser'
import { logError, logMutation } from '@/helpers/logger'
import { comparePassword, hashPassword } from '@/helpers/passwords'
import { Context } from '@/types'
import { MutationChangePasswordArgs, User } from '@/types/modules'
import sendEmail from '@extensions/mail-service/send-email'
import { ApolloError } from 'apollo-server-errors'

export default async (
  _parent: unknown,
  { oldPassword, newPassword }: MutationChangePasswordArgs,
  context: Context & Required<Context>
): Promise<User> => {
  const { user, sentryId, prisma } = context
  logMutation('changePassword %o', user)

  try {
    // User must be logged in before performing the operation.
    if (!user) throw new ApolloError('You must be logged in.', '401')

    if (!user.password)
      throw new ApolloError('You have no old password set.', '400')

    const passwordCheck = await comparePassword({
      password: oldPassword,
      hashed: user.password
    })

    if (!passwordCheck) throw new Error('no match')

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        password: await hashPassword(newPassword)
      }
    })
    await sendEmail({
      to: user.email,
      subject: 'Password changed',
      template: 'password_changed',
      variables: {
        to_name: user.name
      }
    })

    return getUser(updatedUser)
  } catch (e) {
    logError('changePassword %o', e)

    const message = useErrorParser(e)

    if (message === 'no match')
      throw new ApolloError(
        'Incorrect password confirmation. Please try again, or reset your password before signing in.',
        '409'
      )

    throw new ApolloError(message, e.code ?? '500', { sentryId })
  }
}
