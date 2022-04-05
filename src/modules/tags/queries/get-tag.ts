import { useErrorParser } from '@/helpers'
import { logError, logQuery } from '@helpers/logger'
import { QueryGetTagArgs, Tag } from '@modules-types'
import { Context } from '@types'
import { ApolloError } from 'apollo-server-errors'

export default async (
  _parent: unknown,
  { id }: QueryGetTagArgs,
  { user, sentryId, prisma }: Context & Required<Context>
): Promise<Tag> => {
  logQuery('getTag %o', user)
  try {
    // User must be logged in before performing the operation.
    if (!user) throw new ApolloError('You must be logged in.', '401')

    // Grab the desired row by its compound primary key.
    const tag = await prisma.tag.findUnique({
      where: { id: id }
    })

    if (!tag) throw new ApolloError('tag not found')
    return tag
  } catch (e) {
    logError('getTag %o', e)

    const message = useErrorParser(e)
    throw new ApolloError(message, e.code ?? '500', { sentryId })
  }
}
