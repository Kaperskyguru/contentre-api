import { getUser } from '@helpers/getUser'
import { logError, logQuery } from '@helpers/logger'
import { User } from '@modules-types'
import { Context } from '@types'

export default async (
  _parent: unknown,
  _args: unknown,
  { user, prisma }: Context & Required<Context>
): Promise<User | null> => {
  logQuery('getCurrentUser %o', user)

  if (user) {
    try {
      return getUser(user)
    } catch (err) {
      logError('getCurrentUser %o', err)
    }
  }

  return user
}
