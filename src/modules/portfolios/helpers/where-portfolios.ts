import { Prisma } from '.prisma/client'
import { Maybe, User, PortfolioFiltersInput } from '@modules-types'

export const whereClients = (
  user: User,
  filters?: Maybe<PortfolioFiltersInput>
): {
  AND: Prisma.PortfolioWhereInput[]
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
                description: {
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

export default whereClients
