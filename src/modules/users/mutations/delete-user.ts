// import { deleteFile } from '@extensions/storage'
import { comparePassword } from '@/helpers/passwords'
import { MutationDeleteUserArgs } from '@/types/modules'
import { useErrorParser } from '@helpers'
import { environment } from '@helpers/environment'
import { logError, logMutation } from '@helpers/logger'
import { Context } from '@types'
import { ApolloError } from 'apollo-server-errors'

export default async (
  _parent: unknown,
  { oldPassword, feedback }: MutationDeleteUserArgs,
  context: Context
): Promise<boolean> => {
  // Extract params from context.
  const { user, setCookies, prisma } = context
  logMutation('deleteUser %o', user)

  try {
    // User must be logged in before performing the operation.
    if (!user) throw new ApolloError('You must be logged in.', '401')

    const passwordCheck = await comparePassword({
      password: oldPassword,
      hashed: user.password!
    })

    if (!passwordCheck) throw new Error('no match')

    // Run a transaction to ensure operations succeeds together.
    await prisma.$transaction([
      prisma.client.deleteMany({ where: { userId: user.id } }),
      prisma.verificationIntent.deleteMany({ where: { userId: user.id } }),
      prisma.user.delete({ where: { id: user.id } })
    ])

    // Delete avatar from Google Cloud Storage, if needed.
    if (user.avatarURL) {
      //   await deleteFile(user.avatarURL)
    }

    // Invalidate the token ensuring the cookie has expired.
    setCookies?.push({
      name: 'token',
      options: {
        // domain: 'contentre.io',
        expires: new Date(0),
        httpOnly: true,
        sameSite: ['LOCAL', 'DEVELOP'].includes(environment.context)
          ? 'None'
          : true,
        secure: true
      }
    })

    return true
  } catch (e) {
    logError('deleteUser %o', e)
    const message = useErrorParser(e)

    throw new ApolloError(e?.code ?? 'generic', '500', {
      handled: !!e,
      originalMessage: e?.message ?? message
    })
  }
}
