import { useErrorParser } from '@/helpers'
import { logError, logQuery } from '@helpers/logger'
import { App, QueryGetAppArgs } from '@modules-types'
import { Context } from '@types'
import { ApolloError } from 'apollo-server-errors'

export default async (
  _parent: unknown,
  { id }: QueryGetAppArgs,
  { user, sentryId, prisma }: Context & Required<Context>
): Promise<App> => {
  logQuery('getApp %o', user)
  try {
    // User must be logged in before performing the operation.
    if (!user) throw new ApolloError('You must be logged in.', '401')

    // Grab the desired row by its compound primary key.
    const app = await prisma.connectedApp.findUnique({
      where: { id: id },
      include: { app: true }
    })

    if (!app) throw new ApolloError('App not found')
    return app
  } catch (e) {
    logError('getApp %o', e)

    const message = useErrorParser(e)
    throw new ApolloError(message, e.code ?? '500', { sentryId })
  }
}
