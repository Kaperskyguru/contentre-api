import { Prisma } from '.prisma/client'
import { Maybe, User, ContentFiltersInput } from '@modules-types'
import { endOfMonth, parseISO, startOfMonth } from 'date-fns'

export const whereContents = (
  user: User,
  filters?: Maybe<ContentFiltersInput>
): {
  AND: Prisma.ContentWhereInput[]
} => {
  return {
    AND: [
      {
        userId: user.id,
        notebookId: null
      },

      filters?.terms
        ? {
            OR: [
              {
                title: {
                  contains: filters.terms,
                  mode: 'insensitive'
                }
              },
              {
                excerpt: {
                  contains: filters.terms,
                  mode: 'insensitive'
                }
              }
            ]
          }
        : {},

      {
        visibility: filters?.visibility ?? 'PUBLIC'
      },
      {
        category: filters?.categories?.length
          ? {
              name: {
                in: filters.categories
              }
            }
          : undefined
      },

      {
        publishedDate:
          filters?.fromDate || filters?.toDate
            ? {
                gte: filters?.fromDate
                  ? startOfMonth(parseISO(filters.fromDate))
                  : undefined,
                lt: filters?.toDate
                  ? endOfMonth(parseISO(filters.toDate))
                  : undefined
              }
            : undefined
      },

      {
        amount: filters?.fromAmount
          ? {
              gte: filters?.fromAmount ?? 0,
              lt: filters?.toAmount ?? undefined
            }
          : undefined
      },
      {
        tags: filters?.tags?.length
          ? {
              path: [],
              array_contains: filters.tags
            }
          : undefined
      },

      {
        topics: filters?.topics?.length
          ? {
              path: [],
              array_contains: filters.topics
            }
          : undefined
      },

      filters?.clients?.length && filters?.clients.includes('Personal')
        ? {
            clientId: null
          }
        : {
            client: filters?.clients?.length
              ? {
                  name: {
                    in: filters.clients
                  }
                }
              : undefined
          }
    ]
  }
}

export default whereContents
