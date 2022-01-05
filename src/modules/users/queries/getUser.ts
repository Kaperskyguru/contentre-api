import { ApolloError } from 'apollo-server-errors'
import { QueryGetUserArgs, User } from '@modules-types'
import { Context } from '@types'
import { useErrorParser } from '@helpers'
import { logError, logQuery } from '@helpers/logger'

export default async (
  _parent: unknown,
  { uuid }: QueryGetUserArgs,
  { user, prisma }: Context & Required<Context>
): Promise<User> => {
  logQuery('findUser %o', user)
  try {
    if (!user) throw new ApolloError('You must be logged in.', '401')

    // Check for required arguments not provided.
    if (!uuid) throw new ApolloError('Invalid input', '422')

    const userData = await prisma.user.findUnique({
      where: { id: uuid }
    })

    if (!userData) {
      throw new Error('user not found')
    }

    return userData
  } catch (e) {
    logError('findUser %o', e)

    const message = useErrorParser(e)

    throw new ApolloError(e?.code ?? 'generic', '500', {
      handled: !!e,
      originalMessage: e?.message ?? message
    })
  }
}
