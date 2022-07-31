import { Maybe, Topic } from '@modules-types'
import { logResolver } from '@helpers/logger'
import { prisma } from '@/config'

export default async (parent: Topic): Promise<Maybe<number>> => {
  logResolver('Topic.totalContent')

  const contentCount = await prisma.content.count({
    // where: { topicId: parent.id, userId: parent.userId! }
  })

  return 0 //contentCount + ''
}
