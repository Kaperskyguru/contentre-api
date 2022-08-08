import { logError } from '@helpers/logger'
import { Maybe, User } from '@modules-types'
import { PrismaClient } from '@prisma/client'
import sendToSegment from '@extensions/segment-service/segment'

export const createBulkTags = async (
  tags: Maybe<string[]> | undefined,
  { user, prisma }: { user: User; prisma: PrismaClient }
) => {
  try {
    if (!tags?.length) return null

    // Get all existing tags
    const availableTags = await prisma.tag.findMany({
      where: {
        name: {
          in: tags?.map((item) => item)
        },
        teamId: user.activeTeamId
      },
      select: { name: true }
    })
    const mappedTags = availableTags.map((item) => item.name)

    // Remove existing tags from new tag's array
    const newTopics = tags?.filter((item) => !mappedTags.includes(item))

    const tagNames = Object.values(newTopics).map((name: any) => ({
      name,
      userId: user.id,
      teamId: user.activeTeamId! ?? undefined
      // team: { connect: { id: user.activeTeamId! } }
    }))

    await prisma.tag.createMany({
      data: tagNames
    })

    await sendToSegment({
      operation: 'track',
      eventName: 'bulk_create_new_tag',
      userId: user.id,
      data: {
        userEmail: user.email,
        tags: tags
      }
    })
  } catch (error) {
    logError('createBulkTags', tags, error)
    return null
  }
}

export default createBulkTags
