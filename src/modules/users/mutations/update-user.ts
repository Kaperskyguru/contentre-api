import { useErrorParser } from '@/helpers'
import { logError, logMutation } from '@helpers/logger'
import { MutationUpdateUserArgs, User } from '@modules-types'
import sendEmailCode from '@/modules/auth/mutations/send-email-code'
import { Context } from '@types'
import { ApolloError } from 'apollo-server-errors'

export default async (
  _parent: unknown,
  { input }: MutationUpdateUserArgs,
  context: Context & Required<Context>
): Promise<User> => {
  const { user, prisma, requestURL, requestOrigin } = context
  logMutation('updateUser %o', user)
  try {
    // User must be logged in before performing the operation.
    if (!user) throw new ApolloError('You must be logged in.', '401')

    // Prepare data for the update, checking and filling each possible field.
    const data: Record<string, unknown> = {}
    if (input.avatarURL !== undefined) data.avatarURL = input.avatarURL
    if (input.name !== undefined) data.name = input.name
    if (input.firstname !== undefined) data.firstname = input.firstname
    if (input.lastname !== undefined) data.lastname = input.lastname
    if (input.jobTitle !== undefined) data.jobTitle = input.jobTitle
    if (input.homeAddress !== undefined) data.homeAddress = input.homeAddress
    if (input.bio !== undefined) data.bio = input.bio
    if (input.portfolio !== undefined) data.portfolio = input.portfolio

    if (input.email !== undefined) {
      data.email = input.email
      // If user changes email, set its verification to false.
      data.emailConfirmed = false
    }

    if (input.phoneNumber !== undefined) {
      data.phoneNumber = input.phoneNumber
      // If user changes phone number, set its verification to false.
      data.phoneConfirmed = false
    }

    // Delete avatar from Google Storage
    // if (data.avatarURL === null) {
    //   await deleteFile(`users/${user.id}`)
    // }

    // Finally update the user.
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data
    })

    // If the user needs to confirm the email after a change.
    if (!updatedUser.emailConfirmed && updatedUser.email) {
      // Call the mutation to send the email verification code.
      sendEmailCode(
        _parent,
        {
          email: updatedUser.email
        },
        context
      )
    }

    return updatedUser
  } catch (e) {
    logError('updateUser %o', e)

    const message = useErrorParser(e)

    throw new ApolloError(e?.code ?? 'generic', '500', {
      handled: !!e,
      originalMessage: e?.message ?? message
    })
  }
}
