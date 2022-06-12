import { Maybe, User } from '@modules-types'
import { logResolver } from '@helpers/logger'
import { prisma } from '@/config'

export default async (parent: User): Promise<Maybe<number>> => {
  logResolver('User.totalPortfolio')

  const portfolioCount = await prisma.portfolio.count({
    where: { userId: parent.id }
  })

  return portfolioCount
}
