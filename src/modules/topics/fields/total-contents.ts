import { Maybe, Topic } from '@modules-types'
import { logResolver } from '@helpers/logger'
import { prisma } from '@/config'

export default async (parent: Topic): Promise<Maybe<number>> => {
  logResolver('Tag.totalContents')

  const contentCount = await prisma.content.count({
    where: {
      userId: parent?.userId! ?? undefined,
      notebookId: null,
      topics: {
        path: [],
        array_contains: [parent.name]
      }
    }
  })

  return contentCount
}
