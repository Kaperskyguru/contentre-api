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
      currentComments: number
      currentShares: number
      lastShares: number
      lastComments: number
      lastLikes: number
      currentLikes: number
      comments: number
      shares: number
      likes: number
      currentAmount: number
      lastAmount: number
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
          SUM(c."amount") FILTER(WHERE TO_CHAR("c"."createdAt", 'YYYY')::INT = TO_CHAR(NOW()::TIMESTAMP, 'YYYY')::INT) "currentAmount",
          
          SUM(c."shares") FILTER(WHERE TO_CHAR("c"."createdAt", 'YYYY')::INT = TO_CHAR(NOW()::TIMESTAMP - '1 year'::INTERVAL, 'YYYY')::INT) "lastShares",
          SUM(c."comments") FILTER(WHERE TO_CHAR("c"."createdAt", 'YYYY')::INT = TO_CHAR(NOW()::TIMESTAMP - '1 year'::INTERVAL, 'YYYY')::INT) "lastComments",
          SUM(c."likes") FILTER(WHERE TO_CHAR("c"."createdAt", 'YYYY')::INT = TO_CHAR(NOW()::TIMESTAMP - '1 year'::INTERVAL, 'YYYY')::INT) "lastLikes",
          SUM(c."amount") FILTER(WHERE TO_CHAR("c"."createdAt", 'YYYY')::INT = TO_CHAR(NOW()::TIMESTAMP - '1 year'::INTERVAL, 'YYYY')::INT) "lastAmount"
          FROM
            "Content" c
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
        LEFT JOIN "Content" c ON TO_CHAR(c."createdAt" , 'YYYY-MM-DD') = TO_CHAR(d.day, 'YYYY-MM-DD')
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
      LEFT JOIN public."Content" c ON TO_CHAR(c."createdAt" , 'YYYY-MM-DD') = TO_CHAR(d.day, 'YYYY-MM-DD')
      where c."userId" = $1 or c."userId" is null
      GROUP BY 1;

          `.clearIndentation(),
      user.id
    )
    //   const testYear: AmountGroupQueryResult[] = await prisma.$queryRawUnsafe(
    //     `
    //   select

    //   TO_CHAR(date_trunc('month', c."createdAt"), 'mon')|| ',' || TO_CHAR(date_trunc('month', c."createdAt"), 'YYYY') as months,

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

    console.log(lastYear, currentYear)

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

    const values = contentCountsByJanuary.map((val) => {
      const subLikes =
        ((val.currentLikes - val.lastLikes) / val.lastLikes) * 100
      const subComments =
        ((val.currentComments - val.lastComments) / val.lastComments) * 100
      const subShares =
        ((val.currentShares - val.lastShares) / val.lastShares) * 100
      const subAmount =
        ((val.currentAmount - val.lastAmount) / val.lastAmount) * 100
      return {
        likePercent: !Number.isFinite(subLikes) ? 100 : subLikes,
        commentPercent: !Number.isFinite(subComments) ? 100 : subComments,
        sharePercent: !Number.isFinite(subShares) ? 100 : subShares,
        amountPercent: !Number.isFinite(subAmount) ? 100 : subAmount,
        likes: val.likes,
        comments: val.comments,
        shares: val.shares
      }
    })

    const result = {
      revenue: obj,
      box: values[0]
    }

    return result
  } catch (e) {
    logError('getIndexMetadata %o', e)

    const message = useErrorParser(e)

    throw new ApolloError(message, e.code ?? '500', { sentryId })
  }
}
