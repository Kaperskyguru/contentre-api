import { Prisma } from '.prisma/client'
import { Maybe, OutlineFiltersInput, User } from '@modules-types'
import { endOfMonth, parseISO, startOfMonth } from 'date-fns'

export const whereOutlines = (
  user: User,
  filters?: Maybe<OutlineFiltersInput>
): {
  AND: Prisma.ContentWhereInput[]
} => {
  return {
    AND: [
      {
        userId: user.id,
        teamId: user.activeTeamId,
        class: 'OUTLINE'
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
                content: {
                  contains: filters.terms,
                  mode: 'insensitive'
                }
              }
            ]
          }
        : {},

      {
        createdAt:
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
      }
    ]
  }
}

export default whereOutlines
