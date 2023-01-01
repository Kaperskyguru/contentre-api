import { Maybe, User } from '@modules-types'
import { logResolver } from '@helpers/logger'
import { prisma } from '@/config'

export default async (parent: User): Promise<Maybe<number>> => {
  logResolver('Outline.totalOutline')

  const outlineCount = await prisma.content.count({
    where: { userId: parent.id, class: 'OUTLINE' }
  })

  return outlineCount
}
