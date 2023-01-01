import { useErrorParser } from '@/helpers'
import { logError, logQuery } from '@helpers/logger'
import { QueryGetSnippetArgs, Snippet } from '@modules-types'
import { Context } from '@types'
import { ApolloError } from 'apollo-server-errors'

export default async (
  _parent: unknown,
  { id }: QueryGetSnippetArgs,
  { user, sentryId, prisma }: Context & Required<Context>
): Promise<Snippet> => {
  logQuery('getSnippet %o', user)
  try {
    // User must be logged in before performing the operation.
    if (!user) throw new ApolloError('You must be logged in.', '401')

    // Grab the desired row by its compound primary key.
    const snippet = await prisma.content.findUnique({
      where: { id: id }
    })

    if (!snippet) throw new ApolloError('Snippet not found')
    return snippet
  } catch (e) {
    logError('getSnippet %o', e)

    const message = useErrorParser(e)
    throw new ApolloError(message, e.code ?? '500', { sentryId })
  }
}
