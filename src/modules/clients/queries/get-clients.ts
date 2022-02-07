import { useErrorParser } from '@helpers'
import { logError, logQuery } from '@helpers/logger'
import { Client, QueryGetClientsArgs } from '@modules-types'
import { Context } from '@types'
import { ApolloError } from 'apollo-server-errors'
import whereClients from '../helpers/where-clients'

export default async (
  _parent: unknown,
  { size, skip, filters }: QueryGetClientsArgs,
  { user, sentryId, prisma }: Context & Required<Context>
): Promise<Client[]> => {
  logQuery('getClients %o', { size, skip, filters })
  try {
    if (!user) throw new Error(Errors.MUST_LOGIN)

    const where = whereClients(user, filters)

    const clients = await prisma.client.findMany({
      orderBy: [{ name: 'desc' }],
      where,
      include: {
        user: true
      },
      take: size ?? undefined,
      skip: skip ?? 0
    })

    return clients
  } catch (e) {
    logError('getClients %o', e)

    const message = useErrorParser(e)
    throw new ApolloError(message, e.code ?? '500', { sentryId })
  }
}
