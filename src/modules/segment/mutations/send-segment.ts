import sendToSegment from '@extensions/segment-service/segment'
import { useErrorParser } from '@helpers'
import { logError, logMutation } from '@helpers/logger'
import { MutationSendSegmentArgs } from '@modules-types'
import { Context } from '@types'
import { ApolloError } from 'apollo-server-errors'

export default async (
  _parent: unknown,
  { input }: MutationSendSegmentArgs,
  { user, sentryId, ipAddress, requestURL }: Context
): Promise<boolean> => {
  logMutation('sendSegment %o', {
    input,
    user,
    ipAddress,
    requestURL
  })
  try {
    if (!user || user.id !== input.userId) {
      throw new Error('')
    }

    return await sendToSegment({
      userId: input.userId,
      data: { ...input.data, ipAddress },
      eventName: input.eventName,
      groupId: input.groupId,
      operation: input.operation,
      pageName: input.pageName
    })
  } catch (e) {
    logError('sendSegment %o', e)

    const message = useErrorParser(e)
    throw new ApolloError(message, e.code ?? '500', { sentryId })
  }
}
