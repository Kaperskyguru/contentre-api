import { Prisma } from '.prisma/client'
import { Maybe, User, ContentFiltersInput } from '@modules-types'

export const whereContents = (
  user: User,
  filters?: Maybe<ContentFiltersInput>
): {
  AND: Prisma.ContentWhereInput[]
} => {
  return {
    AND: [
      {
        userId: user.id
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
        : {}
    ]
  }
}

export default whereContents
