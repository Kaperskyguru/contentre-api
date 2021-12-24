import { useErrorParser } from '@helpers'
import { logError, logQuery } from '@helpers/logger'
import { Client, QueryGetClientArgs } from '@modules-types'
import { Context } from '@types'
import { ApolloError } from 'apollo-server-errors'

export default async (
  _parent: unknown,
  { id }: QueryGetClientArgs,
  { user, sentryId, prisma }: Context & Required<Context>
): Promise<Client> => {
  logQuery('getClient %o', user)
  try {
    if (!user) throw new ApolloError('You must be logged in.', '401')

    const client = await prisma.client.findUnique({
      where: { id }
    })

    if (!client) throw new Error('client not found')

    return client
  } catch (e) {
    logError('getClient %o', e)

    const message = useErrorParser(e)

    if (message === 'client not found')
      throw new ApolloError('Client not found.', '404')

    throw new ApolloError(message, e.code ?? '500', { sentryId })
  }
}
