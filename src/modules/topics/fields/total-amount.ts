import { Maybe, Topic } from '@modules-types'
import { logResolver } from '@helpers/logger'
import { prisma } from '@/config'

export default async (parent: Topic): Promise<Maybe<number>> => {
  logResolver('Topic.totalAmount')

  const topics = await prisma.content.aggregate({
    where: {
      userId: parent?.userId! ?? undefined,
      topics: {
        path: [],
        array_contains: [parent.name]
      }
    },
    _sum: {
      amount: true
    }
  })
  return topics?._sum?.amount ?? 0
}
