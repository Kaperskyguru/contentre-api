import { Content, MutationConvertNoteOutlineArgs } from '@/types/modules'
import { logResolver } from '@helpers/logger'
import { prisma } from '@/config'
import { Prisma } from '@prisma/client'

export default async (
  updatedOutline: Content,
  { id, input }: MutationConvertNoteOutlineArgs
): Promise<void> => {
  logResolver('Outline.updateOutlineTopics')

  let oldTopics: any = []

  if (
    updatedOutline?.topics &&
    typeof updatedOutline?.topics === 'object' &&
    Array.isArray(updatedOutline?.topics)
  ) {
    const topicsObject = updatedOutline?.topics as Prisma.JsonArray
    oldTopics = Array.from(topicsObject)
  }
  const newTopics = Object.values(input?.topics!)

  const topics = [...new Set([...oldTopics, ...newTopics])]

  await prisma.content.update({
    where: { id },
    data: {
      topics
    }
  })
}
