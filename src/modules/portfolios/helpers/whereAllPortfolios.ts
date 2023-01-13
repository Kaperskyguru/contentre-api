import { Prisma } from '.prisma/client'
import { Maybe, AllPortfolioFiltersInput } from '@modules-types'

export const whereAllPortfolios = (
  filters?: Maybe<AllPortfolioFiltersInput>
): {
  AND: Prisma.PortfolioWhereInput[]
} => {
  return {
    AND: [
      {
        showInDirectory: true
      },
      filters?.terms
        ? {
            OR: [
              {
                user: {
                  name: {
                    contains: filters.terms,
                    mode: 'insensitive'
                  },
                  bio: {
                    contains: filters.terms,
                    mode: 'insensitive'
                  }
                }
              }
            ]
          }
        : {},
      {
        user: filters?.skills?.length
          ? {
              OR: [
                {
                  jobTitle: {
                    contains: filters?.skills.join(' '),
                    mode: 'insensitive'
                  }
                },
                {
                  bio: {
                    contains: filters?.skills.join(' '),
                    mode: 'insensitive'
                  }
                }
              ]
            }
          : {}
      }

      // Add Topics to Users here for Specialism
    ]
  }
}

export default whereAllPortfolios
