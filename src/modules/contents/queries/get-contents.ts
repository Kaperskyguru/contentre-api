import { useErrorParser } from '@helpers'
import { logError, logQuery } from '@helpers/logger'
import { Content, QueryGetClientsArgs } from '@modules-types'
import { Context } from '@types'
import { ApolloError } from 'apollo-server-errors'
import whereClients from '../helpers/where-clients'

export default async (
  _parent: unknown,
  { size, skip, filters }: QueryGetClientsArgs,
  { user, sentryId, prisma }: Context & Required<Context>
): Promise<Content[]> => {
  logQuery('getContents %o', user)
  try {
    if (!user) throw new ApolloError('You must be logged in.', '401')

    const where = whereClients(user, filters)

    const contents = await prisma.content.findMany({
      orderBy: [{ title: 'desc' }],
      where,
      include: { user: true, client: true },
      take: size ?? undefined,
      skip: skip ?? 0
    })

    return contents
  } catch (e) {
    logError('getContents %o', e)

    const message = useErrorParser(e)
    throw new ApolloError(message, e.code ?? '500', { sentryId })
  }
}
