import { Maybe, User } from '@modules-types'
import { logResolver } from '@helpers/logger'
import { prisma } from '@/config'

export default async (parent: User): Promise<Maybe<number>> => {
  logResolver('Brief.totalBrief')

  const outlineCount = await prisma.content.count({
    where: { userId: parent.id, class: 'BRIEF' }
  })

  return outlineCount
}
