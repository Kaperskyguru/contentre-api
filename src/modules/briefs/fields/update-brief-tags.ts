import { Content, MutationConvertNoteBriefArgs } from '@/types/modules'
import { logResolver } from '@helpers/logger'
import { prisma } from '@/config'
import { Prisma } from '@prisma/client'

export default async (
  updatedBrief: Content,
  { id, input }: MutationConvertNoteBriefArgs
): Promise<void> => {
  logResolver('Brief.updateBriefTags')

  let oldTags: any = []
  if (
    updatedBrief?.tags &&
    typeof updatedBrief?.tags === 'object' &&
    Array.isArray(updatedBrief?.tags)
  ) {
    const tagsObject = updatedBrief?.tags as Prisma.JsonArray
    oldTags = Array.from(tagsObject)
  }
  const newTags = Object.values(input?.tags ?? [])

  const tags = [...new Set([...oldTags, ...newTags])]

  await prisma.content.update({
    where: { id },
    data: {
      tags
    }
  })
}
