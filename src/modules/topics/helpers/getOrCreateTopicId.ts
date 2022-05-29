import { logError } from '@helpers/logger'
import { Maybe, Scalars, User } from '@modules-types'
import { PrismaClient } from '@prisma/client'
import sendToSegment from '@extensions/segment-service/segment'

export const getOrCreateTopicId = async (
  name: Maybe<string> | undefined,
  { user, prisma }: { user: User; prisma: PrismaClient }
): Promise<Scalars['ID'] | null> => {
  try {
    if (!name) return null

    // Let's try to find an already existing.
    const foundTopic = await prisma.topic.findFirst({
      where: {
        teamId: user.activeTeamId,
        name: {
          equals: name,
          mode: 'insensitive'
        }
      }
    })

    // If found, just return the id.
    if (foundTopic) return foundTopic.id

    // Otherwise, we need to create the new topic.
    const [topic, countCategories] = await prisma.$transaction([
      prisma.topic.create({
        data: {
          teamId: user.activeTeamId,
          name
        }
      }),
      prisma.topic.count({
        where: { teamId: user.activeTeamId }
      })
    ])

    await sendToSegment({
      operation: 'track',
      eventName: 'create_new_topic',
      userId: user!.id,
      data: {
        teamId: user.activeTeamId,
        topicName: name,
        topicCount: countCategories
      }
    })

    // Then return the newly created id.
    return topic?.id ?? null
  } catch (error) {
    logError('getOrCreateTopicId', name, error)
    return null
  }
}

export default getOrCreateTopicId
