import { useErrorParser } from '@/helpers'
import { logError, logQuery } from '@helpers/logger'
import { Context } from '@types'
import { ApolloError } from 'apollo-server-errors'
import totalOutlines from '../fields/total-outlines'

export default async (
  _parent: unknown,
  _input: unknown,
  { user, sentryId, prisma }: Context & Required<Context>
): Promise<boolean> => {
  logQuery('getTotalOutline %o', user)
  try {
    // User must be logged in before performing the operation.
    if (!user) throw new ApolloError('You must be logged in.', '401')

    const totalOutline = await totalOutlines(user)

    if (!user.isPremium && (totalOutline ?? 0) >= 1) return false
    return true
  } catch (e) {
    logError('getTotalOutline %o', e)

    const message = useErrorParser(e)
    throw new ApolloError(message, e.code ?? '500', { sentryId })
  }
}
