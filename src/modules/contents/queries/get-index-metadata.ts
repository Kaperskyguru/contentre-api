import { useErrorParser } from '@helpers'
import { logError, logQuery } from '@helpers/logger'
import {
  IndexMetadataResponse,
  QueryGetIndexMetadataArgs
} from '@modules-types'
import { Context } from '@types'
import { ApolloError } from 'apollo-server-errors'

export default async (
  _parent: unknown,
  { filters }: QueryGetIndexMetadataArgs,
  { user, sentryId, prisma }: Context & Required<Context>
): Promise<IndexMetadataResponse> => {
  logQuery('getIndexMetadata %o', user)
  try {
    if (!user) throw new ApolloError('You must be logged in.', '401')

    type GrowthValues = {
      currentComments: number
      currentShares: number
      lastShares: number
      lastComments: number
      lastLikes: number
      currentLikes: number
      comments: number
      shares: number
      likes: number
    }

    const contentCountsByJanuary: GrowthValues[] = await prisma.$queryRawUnsafe(
      `
          SELECT
          AVG("c"."likes") FILTER(WHERE TO_CHAR("c"."createdAt", 'YYYY')::INT = TO_CHAR(NOW()::TIMESTAMP, 'YYYY')::INT) "likes",
          AVG("c"."shares") FILTER(WHERE TO_CHAR("c"."createdAt", 'YYYY')::INT = TO_CHAR(NOW()::TIMESTAMP, 'YYYY')::INT) "shares",
          AVG("c"."comments") FILTER(WHERE TO_CHAR("c"."createdAt", 'YYYY')::INT = TO_CHAR(NOW()::TIMESTAMP, 'YYYY')::INT) "comments",
          SUM(c."likes") FILTER(WHERE TO_CHAR("c"."createdAt", 'YYYY')::INT = TO_CHAR(NOW()::TIMESTAMP, 'YYYY')::INT) "currentLikes",
          SUM(c."comments") FILTER(WHERE TO_CHAR("c"."createdAt", 'YYYY')::INT = TO_CHAR(NOW()::TIMESTAMP, 'YYYY')::INT) "currentComments",
          SUM(c."shares") FILTER(WHERE TO_CHAR("c"."createdAt", 'YYYY')::INT = TO_CHAR(NOW()::TIMESTAMP, 'YYYY')::INT) "currentShares",
          
          SUM(c."shares") FILTER(WHERE TO_CHAR("c"."createdAt", 'YYYY')::INT = TO_CHAR(NOW()::TIMESTAMP - '1 year'::INTERVAL, 'YYYY')::INT) "lastShares",
          SUM(c."comments") FILTER(WHERE TO_CHAR("c"."createdAt", 'YYYY')::INT = TO_CHAR(NOW()::TIMESTAMP - '1 year'::INTERVAL, 'YYYY')::INT) "lastComments",
          SUM(c."likes") FILTER(WHERE TO_CHAR("c"."createdAt", 'YYYY')::INT = TO_CHAR(NOW()::TIMESTAMP - '1 year'::INTERVAL, 'YYYY')::INT) "lastLikes"
          FROM
            "Content" c
          WHERE
            (
              c."userId" = $1
            )
         
        `.clearIndentation(),
      user.id
    )

    const values = contentCountsByJanuary.map((val) => {
      const subLikes =
        ((val.currentLikes - val.lastLikes) / val.lastLikes) * 100
      const subComments =
        ((val.currentComments - val.lastComments) / val.lastComments) * 100
      const subShares =
        ((val.currentShares - val.lastShares) / val.lastShares) * 100
      return {
        likePercent: !Number.isFinite(subLikes) ? 100 : subLikes,
        commentPercent: !Number.isFinite(subComments) ? 100 : subComments,
        sharePercent: !Number.isFinite(subShares) ? 100 : subShares,
        likes: val.likes,
        comments: val.comments,
        shares: val.shares
      }
    })

    return values[0]
  } catch (e) {
    logError('getIndexMetadata %o', e)

    const message = useErrorParser(e)

    throw new ApolloError(message, e.code ?? '500', { sentryId })
  }
}
