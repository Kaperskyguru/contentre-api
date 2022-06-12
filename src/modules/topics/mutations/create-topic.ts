import { useErrorParser } from '@/helpers'
import { logError, logMutation } from '@/helpers/logger'
import { Context } from '@/types'
import { Topic, MutationCreateTopicArgs } from '@/types/modules'
import { ApolloError } from 'apollo-server-core'
import sendToSegment from '@extensions/segment-service/segment'

export default async (
  _parent: unknown,
  { input }: MutationCreateTopicArgs,
  context: Context & Required<Context>
): Promise<Topic> => {
  const { prisma, user, ipAddress, requestURL, sentryId } = context
  logMutation('createTopic %o', {
    input,
    user,
    ipAddress,
    requestURL
  })

  try {
    const { name } = input

    if (!user) throw new ApolloError('You must be logged in.', '401')

    if (!name) throw new ApolloError('invalid input', '422')

    // Checking if client already exists
    const topic = await prisma.topic.findFirst({
      where: { name, teamId: user.activeTeamId! }
    })

    if (topic) throw new ApolloError('Topic already created')

    // If success, create a new client in our DB.
    const [result, countTopics] = await prisma.$transaction([
      prisma.topic.create({
        data: {
          team: { connect: { id: user.activeTeamId! } },
          name
        }
      }),

      prisma.topic.count({
        where: { teamId: user.activeTeamId! }
      })
    ])

    await sendToSegment({
      operation: 'identify',
      userId: user.id,
      data: {
        email: user.email
      }
    })

    await sendToSegment({
      operation: 'track',
      eventName: 'create_new_topic',
      userId: user.id,
      data: {
        topicName: input.name,
        topicCount: countTopics
      }
    })

    return result
  } catch (e) {
    logError('createTopic %o', {
      input,
      user,
      ipAddress,
      requestURL,
      error: e
    })

    const message = useErrorParser(e)

    throw new ApolloError(message, e.code ?? '500', { sentryId })
  }
}
