import { useErrorParser } from '@helpers'
import { logError, logQuery } from '@helpers/logger'
import { MediaResponse, QueryGetMediasArgs } from '@modules-types'
import { Context } from '@types'
import { ApolloError } from 'apollo-server-errors'

export default async (
  _parent: unknown,
  { size, skip }: QueryGetMediasArgs,
  { user, sentryId, prisma }: Context & Required<Context>
): Promise<MediaResponse> => {
  logQuery('getMedias %o', user)

  // User must be logged in before performing the operation.
  if (!user) throw new ApolloError('You must be logged in.', '401')

  try {
    const mediaWithTotal = await prisma.media.count({
      where: { teamId: user.activeTeamId! },
      select: { id: true }
    })

    return {
      media: await prisma.media.findMany({
        where: { teamId: user.activeTeamId! },
        take: size ?? 30,
        skip: skip ?? 0
      }),

      meta: {
        total: mediaWithTotal.id ?? 0
      }
    }
  } catch (e) {
    logError('getMedias %o', e)

    const message = useErrorParser(e)
    throw new ApolloError(message, e.code ?? '500', { sentryId })
  }
}
