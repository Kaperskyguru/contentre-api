import { useErrorParser } from '@/helpers'
import { logError, logMutation } from '@/helpers/logger'
import { Context } from '@/types'
import { MutationDeleteTopicArgs } from '@/types/modules'
import { ApolloError } from 'apollo-server-core'
import sendToSegment from '@/extensions/segment-service/segment'

export default async (
  _parent: unknown,
  { id }: MutationDeleteTopicArgs,
  context: Context & Required<Context>
): Promise<boolean> => {
  const { prisma, user } = context
  logMutation('deleteTopic %o', user)
  try {
    // User must be logged in before performing the operation.
    if (!user) throw new ApolloError('You must be logged in.', '401')

    // Check for required arguments not provided.
    if (!id) {
      throw new ApolloError('Invalid input', '422')
    }

    const topic = await prisma.topic.findUnique({
      where: { id }
    })

    if (!topic) {
      throw new ApolloError('topic not found', '404')
    }

    // Check if the user is authorized to delete the topic.
    if (topic.teamId !== user.activeTeamId) {
      throw new Error('unauthorized')
    }

    const deleted = !!(await prisma.topic.delete({
      where: { id }
    }))

    // Send data to segment
    await sendToSegment({
      operation: 'track',
      eventName: 'topic_deleted',
      userId: user.id,
      data: {
        userEmail: user.email
      }
    })
    return deleted
  } catch (e) {
    logError('deleteTopic %o', user)

    const message = useErrorParser(e)

    throw new ApolloError(message, e.code ?? '500', {})
  }
}
