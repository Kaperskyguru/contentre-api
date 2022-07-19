import { Prisma } from '.prisma/client'
import { Maybe, User, NoteFiltersInput } from '@modules-types'
import { endOfMonth, parseISO, startOfMonth } from 'date-fns'

export const whereNotes = (
  user: User,
  filters?: Maybe<NoteFiltersInput>
): {
  AND: Prisma.NoteWhereInput[]
} => {
  return {
    AND: [
      {
        userId: user.id,
        teamId: user.activeTeamId
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
        notebook: filters?.notebookId
          ? {
              id: {
                equals: filters.notebookId
              }
            }
          : undefined
      },

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
