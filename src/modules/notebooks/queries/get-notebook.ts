import { useErrorParser } from '@/helpers'
import { logError, logQuery } from '@helpers/logger'
import { QueryGetNotebookArgs, Notebook } from '@modules-types'
import { Context } from '@types'
import { ApolloError } from 'apollo-server-errors'

export default async (
  _parent: unknown,
  { id }: QueryGetNotebookArgs,
  { user, sentryId, prisma }: Context & Required<Context>
): Promise<Notebook> => {
  logQuery('getNotebook %o', user)
  try {
    // User must be logged in before performing the operation.
    if (!user) throw new ApolloError('You must be logged in.', '401')

    // Grab the desired row by its compound primary key.
    const notebook = await prisma.notebook.findUnique({
      where: { id: id }
    })

    if (!notebook) throw new ApolloError('notebook not found')
    return notebook
  } catch (e) {
    logError('getNotebook %o', e)

    const message = useErrorParser(e)
    throw new ApolloError(message, e.code ?? '500', { sentryId })
  }
}
