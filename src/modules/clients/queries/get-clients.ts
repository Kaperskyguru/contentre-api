import { useErrorParser } from '@helpers'
import { logError, logQuery } from '@helpers/logger'
import { QueryGetClientsArgs, ClientResponse } from '@modules-types'
import { Context } from '@types'
import { ApolloError } from 'apollo-server-errors'
import whereClients from '../helpers/where-clients'

export default async (
  _parent: unknown,
  { size, skip, filters }: QueryGetClientsArgs,
  { user, sentryId, prisma }: Context & Required<Context>
): Promise<ClientResponse> => {
  logQuery('getClients %o', { size, skip, filters })
  try {
    if (!user) throw new ApolloError('You must be logged in.', '401')

    const where = whereClients(user, filters)

    const clients = await prisma.client.findMany({
      orderBy: [
        filters?.sortBy
          ? filters.sortBy === 'name'
            ? { name: 'desc' }
            : filters.sortBy === 'createdAt'
            ? { createdAt: 'desc' }
            : filters.sortBy === 'payment'
            ? { paymentType: 'desc' }
            : filters.sortBy === 'amount'
            ? { amount: 'desc' }
            : filters.sortBy === 'status'
            ? { status: 'desc' }
            : { name: 'desc' }
          : { name: 'desc' }
      ],
      where,
      include: {
        user: true
      },
      take: size ?? undefined,
      skip: skip ?? 0
    })

    const clientWithTotal = await prisma.client.count({
      where,
      select: { id: true }
    })

    return {
      meta: {
        total: clientWithTotal.id ?? 0
      },
      clients
    }
  } catch (e) {
    logError('getClients %o', e)

    const message = useErrorParser(e)
    throw new ApolloError(message, e.code ?? '500', { sentryId })
  }
}
