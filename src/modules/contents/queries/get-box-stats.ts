import whereClientRaw from '@/modules/clients/helpers/where-clients-raw'
import { useErrorParser } from '@helpers'
import { logError, logQuery } from '@helpers/logger'
import { BoxStats, QueryGetIndexMetadataArgs } from '@modules-types'
import { Context } from '@types'
import { ApolloError } from 'apollo-server-errors'
import whereContentRaw from '../helpers/where-contents-raw'
// import whereClientRaw from 'clients/helpers/where-clients-raw'

export default async (
  _parent: unknown,
  { filters }: QueryGetIndexMetadataArgs,
  { user, sentryId, prisma }: Context & Required<Context>
): Promise<BoxStats> => {
  logQuery('getBoxStats %o', user)
  try {
    if (!user) throw new ApolloError('You must be logged in.', '401')

    type GrowthValues = {
      currentAmount: number
      lastAmount: number
      totalContents: number
      lastContents: number

      totalClients: number
      lastClients: number
      currentInteractions: number
      lastInteractions: number
    }

    const { query, args } = whereContentRaw(user, filters)
    const contentCountsByJanuary: GrowthValues[] = await prisma.$queryRawUnsafe(
      `
            SELECT
            SUM(COALESCE(c."likes",0) + COALESCE(c."comments",0) + COALESCE(c."shares", 0)) FILTER(WHERE TO_CHAR("c"."createdAt", 'YYYY')::INT = TO_CHAR(NOW()::TIMESTAMP, 'YYYY')::INT) "currentInteractions",
  
            SUM(c."amount") FILTER(WHERE TO_CHAR("c"."createdAt", 'YYYY')::INT = TO_CHAR(NOW()::TIMESTAMP, 'YYYY')::INT) "currentAmount",
            COUNT(c."id") FILTER(WHERE TO_CHAR("c"."createdAt", 'YYYY')::INT = TO_CHAR(NOW()::TIMESTAMP, 'YYYY')::INT) "totalContents",
          
            SUM(COALESCE(c."likes",0) + COALESCE(c."comments",0) + COALESCE(c."shares", 0)) FILTER(WHERE TO_CHAR("c"."createdAt", 'YYYY')::INT = TO_CHAR(NOW()::TIMESTAMP - '1 year'::INTERVAL, 'YYYY')::INT) "lastInteractions",
            SUM(c."amount") FILTER(WHERE TO_CHAR("c"."createdAt", 'YYYY')::INT = TO_CHAR(NOW()::TIMESTAMP - '1 year'::INTERVAL, 'YYYY')::INT) "lastAmount",
            COUNT(c."id") FILTER(WHERE TO_CHAR("c"."createdAt", 'YYYY')::INT = TO_CHAR(NOW()::TIMESTAMP - '1 year'::INTERVAL, 'YYYY')::INT) "lastContents"
            FROM
              "Content" c LEFT JOIN
              "Category" cat ON c."categoryId" = cat."id" LEFT JOIN
             
              "Client" cl ON c."clientId" = cl."id"
            WHERE
                c."id" IS NOT NULL
                ${query}
           
          `.clearIndentation(),
      ...args
    )

    const { query: clientQuery, args: clientArgs } = whereClientRaw(
      user,
      filters
    )
    const clientCountsByJanuary: GrowthValues[] = await prisma.$queryRawUnsafe(
      `
            SELECT
              COUNT(cl."id") FILTER(WHERE TO_CHAR("cl"."createdAt", 'YYYY')::INT = TO_CHAR(NOW()::TIMESTAMP, 'YYYY')::INT) "totalClients",
              COUNT(cl."id") FILTER(WHERE TO_CHAR("cl"."createdAt", 'YYYY')::INT = TO_CHAR(NOW()::TIMESTAMP - '1 year'::INTERVAL, 'YYYY')::INT) "lastClients"
            FROM
              "Client" cl
            WHERE (
                  cl."id" IS NOT NULL
                  ${clientQuery}
                )
              
          `.clearIndentation(),
      ...clientArgs
    )

    const values = contentCountsByJanuary.map((val) => {
      const subInteractions =
        ((val.currentInteractions - val.lastInteractions) /
          val.lastInteractions) *
        100

      const subAmountStat =
        ((val.currentAmount - val.lastAmount) / val.lastAmount) * 100

      const subContents =
        ((val.totalContents - val.lastContents) / val.lastContents) * 100

      return {
        interactionPercent: !Number.isFinite(subInteractions)
          ? 100
          : subInteractions,
        currentInteractions: val.currentInteractions ?? 0,
        amountPercentStat: !Number.isFinite(subAmountStat)
          ? 100
          : subAmountStat,
        amount: val.currentAmount ?? 0,
        totalContents: val.totalContents ?? 0,
        contentPercent: !Number.isFinite(subContents) ? 100 : subContents
      }
    })

    const clientValues = clientCountsByJanuary.map((val) => {
      const subClients =
        ((val.totalClients - val.lastClients) / val.lastClients) * 100

      return {
        totalClients: val.totalClients,
        clientPercent: !Number.isFinite(subClients) ? 100 : subClients
      }
    })

    const box = {
      ...values[0],
      ...clientValues[0]
    }

    return box
  } catch (e) {
    logError('getBoxStats %o', e)

    const message = useErrorParser(e)

    throw new ApolloError(message, e.code ?? '500', { sentryId })
  }
}
