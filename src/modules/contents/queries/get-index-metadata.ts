import { useErrorParser } from '@helpers'
import { logError, logQuery } from '@helpers/logger'
import {
  IndexMetadataResponse,
  QueryGetIndexMetadataArgs
} from '@modules-types'
import { Context } from '@types'
import { ApolloError } from 'apollo-server-errors'

const sortedMonths = (months: any) => {
  var shortMonths = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ]
  return months.sort(function (a: string, b: string) {
    return shortMonths.indexOf(a) - shortMonths.indexOf(b)
  })
}

export default async (
  _parent: unknown,
  { filters }: QueryGetIndexMetadataArgs,
  { user, sentryId, prisma }: Context & Required<Context>
): Promise<IndexMetadataResponse> => {
  logQuery('getIndexMetadata %o', user)
  try {
    if (!user) throw new ApolloError('You must be logged in.', '401')

    type GrowthValues = {
      // comments: number
      // shares: number
      // likes: number
      currentAmount: number
      lastAmount: number
      totalContents: number
      lastContents: number

      totalClients: number
      lastClients: number
      currentInteractions: number
      lastInteractions: number
    }

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
            "Content" c
          WHERE
            (
              c."userId" = $1
            )
         
        `.clearIndentation(),
      user.id
    )

    const clientCountsByJanuary: GrowthValues[] = await prisma.$queryRawUnsafe(
      `
          SELECT
          COUNT(c."id") FILTER(WHERE TO_CHAR("c"."createdAt", 'YYYY')::INT = TO_CHAR(NOW()::TIMESTAMP, 'YYYY')::INT) "totalClients",
          COUNT(c."id") FILTER(WHERE TO_CHAR("c"."createdAt", 'YYYY')::INT = TO_CHAR(NOW()::TIMESTAMP - '1 year'::INTERVAL, 'YYYY')::INT) "lastClients"
          FROM
            "Client" c
          WHERE
            (
              c."userId" = $1
            )
         
        `.clearIndentation(),
      user.id
    )

    // IMPROVE FROM HERE
    type AmountGroupQueryResult = { months: string; amount: number }

    const lastYear: AmountGroupQueryResult[] = await prisma.$queryRawUnsafe(
      `
        SELECT TO_CHAR(date_trunc('month', d.day), 'mon') || ',' || TO_CHAR(date_trunc('month', d.day), 'YYYY') AS months, 
        CASE when sum(c.amount) IS NULL THEN 0 ELSE sum(c.amount)::INT END amount
        FROM  (
           SELECT generate_series(NOW() - interval '2 year'
                                , NOW() - interval '1 year' - interval '1 month'
                                , interval  '1 day')
           ) d(day)
        LEFT JOIN "Content" c ON TO_CHAR(c."publishedDate" , 'YYYY-MM-DD') = TO_CHAR(d.day, 'YYYY-MM-DD')
        WHERE (
          c."userId" is null or c."userId" = $1
        )
        GROUP BY 
        months;

          `.clearIndentation(),
      user.id
    )

    const currentYear: AmountGroupQueryResult[] = await prisma.$queryRawUnsafe(
      `
      select TO_CHAR(date_trunc('month', d.day), 'mon') || ',' || TO_CHAR(date_trunc('month', d.day), 'YYYY') AS months,
      CASE when sum(c.amount) IS NULL THEN 0 ELSE sum(c.amount)::INT END amount
       
      FROM  (
         SELECT generate_series(NOW() - interval '1 year'
                              , date_trunc('month', NOW() )
                              , interval  '1 day')
         ) d(day)
      LEFT JOIN public."Content" c ON TO_CHAR(c."publishedDate" , 'YYYY-MM-DD') = TO_CHAR(d.day, 'YYYY-MM-DD')
      where c."userId" = $1 or c."userId" is null
      GROUP BY 1;

          `.clearIndentation(),
      user.id
    )
    //   const testYear: AmountGroupQueryResult[] = await prisma.$queryRawUnsafe(
    //     `
    //   select

    //   TO_CHAR(date_trunc('month', c."publishedDate"), 'mon')|| ',' || TO_CHAR(date_trunc('month', c."publishedDate"), 'YYYY') as months,

    //   CASE when sum(c.amount) IS NULL THEN 0 ELSE sum(c.amount)::INT END as current_sale,

    //   lag( CASE when sum(c.amount) IS NULL THEN 0 ELSE sum(c.amount)::INT END, 1) over w as previous_month_sale,

    //   (100 * (sum(c.amount) - lag(sum(c.amount), 1) over w) / lag(sum(c.amount), 1) over w) || '%' as growth

    //  From "Content" c

    //   where c."userId" = $1 or c."userId" is null

    //   group by 1

    //   WINDOW w as (ORDER BY 1)

    //   order by 1;
    //   `.clearIndentation(),
    //     user.id
    //   )

    // console.log(lastYear, currentYear, contentCountsByJanuary)

    const cYearAmounts = currentYear.map((item) => ({
      amount: item.amount,
      months:
        item.months.split(',')[0].charAt(0).toUpperCase() +
        item.months.split(',')[0].slice(1)
    }))

    const lYearAmounts = lastYear.map((item) => ({
      amount: item.amount,
      months:
        item.months.split(',')[0].charAt(0).toUpperCase() +
        item.months.split(',')[0].slice(1)
    }))

    const y2022 = []
    const y2021 = []
    const month = []
    for (let index = 0; index < cYearAmounts.length; index++) {
      const element = cYearAmounts[index]

      month.push(element.months)
      y2022.push({ [element.months]: element.amount })
      for (let index = 0; index < lYearAmounts.length; index++) {
        const year2 = lYearAmounts[index]
        if (element.months === year2.months) {
          y2021.push({ [element.months]: year2.amount })
        }
      }
    }

    const sortedMonth = sortedMonths(month)

    const sorted2022 = y2022
      .sort((a, b) => {
        const keyA = Object.keys(a)[0]
        const keyB = Object.keys(b)[0]
        return sortedMonth.indexOf(keyA) - sortedMonth.indexOf(keyB)
      })
      .reduce((pre: any, curr: any) => {
        return [...pre, ...Object.values(curr)]
      }, [])

    const sorted2021 = y2021
      .sort((a, b) => {
        const keyA = Object.keys(a)[0]
        const keyB = Object.keys(b)[0]
        return sortedMonth.indexOf(keyA) - sortedMonth.indexOf(keyB)
      })
      .reduce((pre: any, curr: any) => {
        return [...pre, ...Object.values(curr)]
      }, [])

    const obj = {
      months: sortedMonth,
      data: {
        current: Object.values(sorted2022),
        last: Object.values(sorted2021)
      }
    }

    // TO HERE

    const totalLastAmount = lastYear.reduce(
      (amount, item) => amount + item.amount,
      0
    )

    const totalCurrentAmount = currentYear.reduce(
      (amount, item) => amount + item.amount,
      0
    )

    const values = contentCountsByJanuary.map((val) => {
      const subInteractions =
        ((val.currentInteractions - val.lastInteractions) /
          val.lastInteractions) *
        100

      const subAmount =
        ((totalCurrentAmount - totalLastAmount) / totalLastAmount) * 100

      const subAmountStat =
        ((val.currentAmount - val.lastAmount) / val.lastAmount) * 100

      const subContents =
        ((val.totalContents - val.lastContents) / val.lastContents) * 100

      return {
        amountPercent: !Number.isFinite(subAmount) ? 100 : subAmount,
        // likes: val.likes,
        // comments: val.comments,
        // shares: val.shares,

        interactionPercent: !Number.isFinite(subInteractions)
          ? 100
          : subInteractions,
        currentInteractions: val.currentInteractions ?? 0,
        amountPercentStat: !Number.isFinite(subAmountStat)
          ? 100
          : subAmountStat,
        amount: val.currentAmount,
        totalContents: val.totalContents,
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

    const result = {
      revenue: obj,
      box
    }

    return result
  } catch (e) {
    logError('getIndexMetadata %o', e)

    const message = useErrorParser(e)

    throw new ApolloError(message, e.code ?? '500', { sentryId })
  }
}
