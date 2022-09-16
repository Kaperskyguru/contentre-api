import { useErrorParser } from '@/helpers'
import { logError, logMutation } from '@/helpers/logger'
import { Context } from '@/types'
import { Content, MutationPullMultipleContentArgs } from '@/types/modules'
import { ApolloError } from 'apollo-server-core'
import PullContent from '../helpers/pull-content'
import sendToSegment from '@/extensions/segment-service/segment'
import totalContents from '@/modules/users/fields/total-contents'
import createMultipleContents from '../helpers/create-multiple-contents'

interface Multiple {
  contents: Array<Content>
  tags?: Array<string>
}

export default async (
  _parent: unknown,
  { input }: MutationPullMultipleContentArgs,
  context: Context & Required<Context>
): Promise<Content[]> => {
  const { prisma, user, ipAddress, requestURL, sentryId } = context
  logMutation('pullContent %o', {
    input,
    user,
    ipAddress,
    requestURL
  })
  try {
    if (!user) throw new ApolloError('You must be logged in.', '401')

    // const { name, data } = input.input
    let multipleContent: Multiple | any
    const pulledContent = await PullContent(input, context)

    // Check if content exceeded
    const totalContent = await totalContents(user)
    const lengthOfURLs = pulledContent.length
    const total = (totalContent ?? 0) + lengthOfURLs

    if (!user.isPremium && total >= 12)
      throw new ApolloError('You have exceeded your content limit.', '401')

    multipleContent = await createMultipleContents(pulledContent, context)

    await sendToSegment({
      operation: 'track',
      eventName: 'bulk_create_new_tag',
      userId: user.id,
      data: {
        userEmail: user.email,
        tags: multipleContent?.tags
      }
    })

    // Send data to segment
    await sendToSegment({
      operation: 'track',
      eventName: 'upload_multiple_contents',
      userId: user.id,
      data: {
        userEmail: user.email,
        contents: multipleContent?.contents
      }
    })

    return multipleContent?.contents
    return []
  } catch (e) {
    logError('pullContent %o', {
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
