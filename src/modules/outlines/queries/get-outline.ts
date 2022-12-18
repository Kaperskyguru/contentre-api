import { useErrorParser } from '@/helpers'
import { logError, logQuery } from '@helpers/logger'
import { QueryGetOutlineArgs, Outline } from '@modules-types'
import { Context } from '@types'
import { ApolloError } from 'apollo-server-errors'

export default async (
  _parent: unknown,
  { id }: QueryGetOutlineArgs,
  { user, sentryId, prisma }: Context & Required<Context>
): Promise<Outline> => {
  logQuery('getOutline %o', user)
  try {
    // User must be logged in before performing the operation.
    if (!user) throw new ApolloError('You must be logged in.', '401')

    // Grab the desired row by its compound primary key.
    const outline = await prisma.content.findUnique({
      where: { id: id }
    })

    if (!outline) throw new ApolloError('outline not found')
    return outline
  } catch (e) {
    logError('getOutline %o', e)

    const message = useErrorParser(e)
    throw new ApolloError(message, e.code ?? '500', { sentryId })
  }
}
