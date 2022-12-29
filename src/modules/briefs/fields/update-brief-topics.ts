import { Content, MutationConvertNoteBriefArgs } from '@/types/modules'
import { logResolver } from '@helpers/logger'
import { prisma } from '@/config'
import { Prisma } from '@prisma/client'

export default async (
  updateBrief: Content,
  { id, input }: MutationConvertNoteBriefArgs
): Promise<void> => {
  logResolver('Outline.updateOutlineTopics')

  let oldTopics: any = []

  if (
    updateBrief?.topics &&
    typeof updateBrief?.topics === 'object' &&
    Array.isArray(updateBrief?.topics)
  ) {
    const topicsObject = updateBrief?.topics as Prisma.JsonArray
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
