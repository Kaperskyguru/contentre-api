import { useErrorParser } from '@helpers'
import { logError, logQuery } from '@helpers/logger'
import { AppResponse, QueryGetAppsArgs } from '@modules-types'
import { Context } from '@types'
import { ApolloError } from 'apollo-server-errors'

export default async (
  _parent: unknown,
  { size, skip }: QueryGetAppsArgs,
  { user, sentryId, prisma }: Context & Required<Context>
): Promise<AppResponse> => {
  logQuery('getApps %o', user)

  // User must be logged in before performing the operation.
  if (!user) throw new ApolloError('You must be logged in.', '401')

  try {
    const appWithTotal = await prisma.social.count({
      where: { teamId: user.activeTeamId },
      select: { id: true }
    })

    return {
      apps: await prisma.connectedApp.findMany({
        where: { teamId: user.activeTeamId! },
        include: { app: true },
        take: size ?? 30,
        skip: skip ?? 0
      }),

      meta: {
        total: appWithTotal.id ?? 0
      }
    }
  } catch (e) {
    logError('getApps %o', e)

    const message = useErrorParser(e)
    throw new ApolloError(message, e.code ?? '500', { sentryId })
  }
}
