import { Prisma } from '.prisma/client'
import {
  Maybe,
  User,
  PortfolioFiltersInput,
  PortfolioContentFilters
} from '@modules-types'

export const wherePortfolios = (
  user: User,
  filters?: Maybe<PortfolioFiltersInput & PortfolioContentFilters>
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

export default wherePortfolios
