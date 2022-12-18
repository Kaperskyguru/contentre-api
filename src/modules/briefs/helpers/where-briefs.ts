import { Prisma } from '.prisma/client'
import { BriefFiltersInput, Maybe, User } from '@modules-types'
import { endOfMonth, parseISO, startOfMonth } from 'date-fns'

export const whereNotes = (
  user: User,
  filters?: Maybe<BriefFiltersInput>
): {
  AND: Prisma.ContentWhereInput[]
} => {
  return {
    AND: [
      {
        userId: user.id,
        teamId: user.activeTeamId,
        class: 'BRIEF'
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

export default whereNotes
