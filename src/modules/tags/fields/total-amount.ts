import { Maybe, Tag } from '@modules-types'
import { logResolver } from '@helpers/logger'
import { prisma } from '@/config'

export default async (parent: Tag): Promise<Maybe<number>> => {
  logResolver('Tag.totalContent')

  const tags = await prisma.content.aggregate({
    where: {
      tags: {
        path: [],
        array_contains: [parent.name]
      }
    },
    _sum: {
      amount: true
    }
  })

  return tags?._sum?.amount ?? 0
}
