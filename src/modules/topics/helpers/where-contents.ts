import { Prisma } from '.prisma/client'
import { Maybe, User, TopicFiltersInput } from '@modules-types'
import { endOfMonth, parseISO, startOfMonth } from 'date-fns'

export const whereContents = (
  user: User,
  filters?: Maybe<TopicFiltersInput>
): {
  AND: Prisma.TopicWhereInput[]
} => {
  return {
    AND: [
      {
        teamId: user.activeTeamId
      },

      filters?.terms
        ? {
            OR: [
              {
                name: {
                  contains: filters.terms,
                  mode: 'insensitive'
                }
              }
            ]
          }
        : {}
      // {
      //   category: filters?.categories?.length
      //     ? {
      //         name: {
      //           in: filters.categories
      //         }
      //       }
      //     : undefined
      // },

      // {
      //   createdAt:
      //     filters?.fromDate || filters?.toDate
      //       ? {
      //           gte: filters?.fromDate
      //             ? startOfMonth(parseISO(filters.fromDate))
      //             : undefined,
      //           lt: filters?.toDate
      //             ? endOfMonth(parseISO(filters.toDate))
      //             : undefined
      //         }
      //       : undefined
      // }

      // {
      //   amount: filters?.fromAmount
      //     ? {
      //         gte: filters?.fromAmount ?? 0,
      //         lt: filters?.toAmount ?? undefined
      //       }
      //     : undefined
      // },
      // {
      //   tags: filters?.tags?.length
      //     ? {
      //         path: [],
      //         array_contains: filters.tags
      //       }
      //     : undefined
      // },

      // filters?.clients?.length && filters?.clients.includes('Personal')
      //   ? {
      //       clientId: null
      //     }
      //   : {
      //       client: filters?.clients?.length
      //         ? {
      //             name: {
      //               in: filters.clients
      //             }
      //           }
      //         : undefined
      //     }
    ]
  }
}

export default whereContents
