import { useErrorParser } from '@/helpers'
import { logError, logQuery } from '@helpers/logger'
import { QueryGetBriefArgs, Brief } from '@modules-types'
import { Context } from '@types'
import { ApolloError } from 'apollo-server-errors'

export default async (
  _parent: unknown,
  { id }: QueryGetBriefArgs,
  { user, sentryId, prisma }: Context & Required<Context>
): Promise<Brief> => {
  logQuery('getBrief %o', user)
  try {
    // User must be logged in before performing the operation.
    if (!user) throw new ApolloError('You must be logged in.', '401')

    // Grab the desired row by its compound primary key.
    const brief = await prisma.content.findUnique({
      where: { id: id }
    })

    if (!brief) throw new ApolloError('brief not found')
    return brief
  } catch (e) {
    logError('getBrief %o', e)

    const message = useErrorParser(e)
    throw new ApolloError(message, e.code ?? '500', { sentryId })
  }
}
