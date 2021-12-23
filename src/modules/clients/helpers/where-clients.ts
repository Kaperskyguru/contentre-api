import { Prisma } from '.prisma/client'
import { Maybe, ClientFiltersInput, User } from '@modules-types'

export const whereClients = (
  user: User,
  filters?: Maybe<ClientFiltersInput>
): {
  AND: Prisma.ClientWhereInput[]
} => {
  return {
    AND: [
      filters?.terms
        ? {
            OR: [
              {
                name: {
                  contains: filters.terms,
                  mode: 'insensitive'
                }
              },
              {
                website: {
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
