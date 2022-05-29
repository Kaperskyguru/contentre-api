import { useErrorParser } from '@/helpers'
import { logError, logQuery } from '@helpers/logger'
import { Topic, QueryGetTopicArgs } from '@modules-types'
import { Context } from '@types'
import { ApolloError } from 'apollo-server-errors'

export default async (
  _parent: unknown,
  { id }: QueryGetTopicArgs,
  { user, sentryId, prisma }: Context & Required<Context>
): Promise<Topic> => {
  logQuery('getTopic %o', user)
  try {
    // User must be logged in before performing the operation.
    if (!user) throw new ApolloError('You must be logged in.', '401')

    // Grab the desired row by its compound primary key.
    const topic = await prisma.topic.findUnique({
      where: { id: id }
    })

    if (!topic) throw new ApolloError('topic not found')
    return topic
  } catch (e) {
    logError('getTopic %o', e)

    const message = useErrorParser(e)
    throw new ApolloError(message, e.code ?? '500', { sentryId })
  }
}
