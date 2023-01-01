import { Content, MutationConvertNoteOutlineArgs } from '@/types/modules'
import { logResolver } from '@helpers/logger'
import { prisma } from '@/config'
import { Prisma } from '@prisma/client'

export default async (
  updatedOutline: Content,
  { id, input }: MutationConvertNoteOutlineArgs
): Promise<void> => {
  logResolver('Outline.updateOutlineTags')

  let oldTags: any = []
  if (
    updatedOutline?.tags &&
    typeof updatedOutline?.tags === 'object' &&
    Array.isArray(updatedOutline?.tags)
  ) {
    const tagsObject = updatedOutline?.tags as Prisma.JsonArray
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
