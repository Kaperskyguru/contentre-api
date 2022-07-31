import { Maybe, Tag } from '@modules-types'
import { logResolver } from '@helpers/logger'
import { prisma } from '@/config'

export default async (parent: Tag): Promise<Maybe<number>> => {
  logResolver('Tag.totalContents')

  const contentCount = await prisma.content.count({
    where: {
      userId: parent?.userId! ?? undefined,
      notebookId: null,
      tags: {
        path: [],
        array_contains: [parent.name]
      }
    }
  })

  return contentCount
}
