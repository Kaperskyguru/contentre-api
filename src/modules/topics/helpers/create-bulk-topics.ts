import { logError } from '@helpers/logger'
import { Maybe, Scalars, User } from '@modules-types'
import { PrismaClient } from '@prisma/client'
import sendToSegment from '@extensions/segment-service/segment'

export const createBulkTopics = async (
  topics: Maybe<string[]> | undefined,
  { user, prisma }: { user: User; prisma: PrismaClient }
) => {
  try {
    if (!topics?.length) return null

    // Get all existing topics
    const availableTopics = await prisma.topic.findMany({
      where: {
        name: {
          in: topics?.map((item) => item)
        },
        teamId: user.activeTeamId
      },
      select: { name: true }
    })
    const mappedTopics = availableTopics.map((item) => item.name)

    // Remove existing topics from new topic's array
    const newTopics = topics?.filter((item) => !mappedTopics.includes(item))

    // Create the remaining topics
    const topicNames = Object.values(newTopics).map((name: any) => ({
      name,
      teamId: user.activeTeamId! ?? undefined
      // team: { connect: { id: user.activeTeamId! } }
    }))

    await prisma.topic.createMany({
      data: topicNames
    })

    await sendToSegment({
      operation: 'track',
      eventName: 'bulk_create_new_topic',
      userId: user.id,
      data: {
        userEmail: user.email,
        topics: topics
      }
    })
  } catch (error) {
    logError('createBulkTopics', topics, error)
    return null
  }
}

export default createBulkTopics
