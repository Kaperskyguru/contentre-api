import { useErrorParser } from '@helpers'
import { logError, logMutation } from '@helpers/logger'
import { Topic, MutationUpdateTopicArgs } from '@modules-types'
import { Context } from '@types'
import { ApolloError } from 'apollo-server-errors'

export default async (
  _parent: unknown,
  { id, input }: MutationUpdateTopicArgs,
  { user, sentryId, prisma, ipAddress, requestURL }: Context & Required<Context>
): Promise<Topic> => {
  logMutation('updateTopic %o', {
    input,
    user,
    ipAddress,
    requestURL
  })

  try {
    // User must be logged in before performing the operation.
    if (!user) throw new ApolloError('You must be logged in.', '401')

    // User must be with an active company set.
    if (!user.activeTeamId) {
      throw new ApolloError('Unauthorized.', '401')
    }

    // Extract fields from the mutation input.
    const { name } = input

    // Check for required arguments not provided.
    if (!id || !name) {
      throw new ApolloError('Invalid input', '422')
    }

    // Do not create duplicated categories.
    const foundTopic = !!(await prisma.topic.findFirst({
      where: {
        teamId: user.activeTeamId,
        name: {
          equals: name,
          mode: 'insensitive'
        },
        id: {
          not: {
            equals: id
          }
        }
      }
    }))

    if (foundTopic) throw new ApolloError('Duplicate Topic')

    // Finally update the topic.
    return await prisma.topic.update({
      where: { id },
      data: {
        name
      }
    })
  } catch (e) {
    logError('updateTopic %o', {
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
