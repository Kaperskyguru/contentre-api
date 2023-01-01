import { useErrorParser } from '@/helpers'
import { logError, logMutation } from '@/helpers/logger'
import { Context } from '@/types'
import { Brief, MutationConvertNoteBriefArgs } from '@/types/modules'
import { ApolloError } from 'apollo-server-core'
import sendToSegment from '@extensions/segment-service/segment'
import Plugins from '@/helpers/plugins'
import createBulkTopics from '@/modules/topics/helpers/create-bulk-topics'
import createBulkTags from '@/modules/tags/helpers/create-bulk-tags'
import totalBriefs from '../fields/total-briefs'
import briefUpdateData from '../fields/brief-update-data'
import updateBriefTopics from '../fields/update-brief-topics'
import updateBriefTags from '../fields/update-brief-tags'

export default async (
  _parent: unknown,
  { id, input }: MutationConvertNoteBriefArgs,
  context: Context & Required<Context>
): Promise<Brief> => {
  const { prisma, user, ipAddress, requestURL, sentryId } = context
  logMutation('convertNoteToBrief %o', {
    input,
    user,
    ipAddress,
    requestURL
  })
  try {
    if (!user) throw new ApolloError('You must be logged in.', '401')

    const totalBrief = await totalBriefs(user)
    if (!user.isPremium && (totalBrief ?? 0) >= 1)
      throw new ApolloError('You have exceeded your brief limit.', '401')

    const note = await prisma.content.findFirst({
      where: { id, class: 'NOTE' }
    })

    if (!note) {
      throw new ApolloError('Brief not found', '404')
    }

    // Share to App
    if (input.apps !== undefined) {
      // Check for Canonical LINK
      await Plugins(input, { user, prisma })
    }

    const data = await briefUpdateData(input, user)

    // Finally update the category.
    let updatedBrief = await prisma.content.update({
      where: { id },
      data: {
        ...data,
        isPremium: user.isPremium
      },
      include: { category: true, client: true }
    })

    if (input.topics?.length) {
      // Create bulk topics
      await createBulkTopics(input.topics, { user, prisma })
      await updateBriefTopics(updatedBrief, { id, input })
    }

    if (input.tags?.length) {
      // Create bulk tags
      await createBulkTags(input.tags, { user, prisma })
      await updateBriefTags(updatedBrief, { id, input })
    }

    // Send data to segment
    await sendToSegment({
      operation: 'track',
      eventName: 'create_new_brief',
      userId: user.id,
      data: {
        userEmail: user.email,
        clientId: input.clientId,
        url: input.url,
        teamId: user.activeTeamId
      }
    })

    return updatedBrief
  } catch (e) {
    logError('convertNoteToBrief %o', {
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
