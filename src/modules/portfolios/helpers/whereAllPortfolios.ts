import { Prisma } from '.prisma/client'
import { Maybe, PortfolioFiltersInput } from '@modules-types'

export const whereAllPortfolios = (
  filters?: Maybe<PortfolioFiltersInput>
): {
  AND: Prisma.PortfolioWhereInput[]
} => {
  return {
    AND: [
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

export default whereAllPortfolios
