import { Maybe, Tag } from '@modules-types'
import { logResolver } from '@helpers/logger'
import { prisma } from '@/config'

export default async (parent: Tag): Promise<Maybe<number>> => {
  logResolver('Tag.totalContents')

  const contentCount = await prisma.content.count({
    where: {
      tags: {
        path: [],
        array_contains: [parent.name]
      }
    }
  })

  console.log(contentCount)

  return contentCount
}
