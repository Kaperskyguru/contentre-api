import { useErrorParser } from '@/helpers'
import { logError, logMutation } from '@/helpers/logger'
import { Context } from '@/types'
import { Outline, MutationConvertNoteOutlineArgs } from '@/types/modules'
import { ApolloError } from 'apollo-server-core'
import sendToSegment from '@extensions/segment-service/segment'
import Plugins from '@/helpers/plugins'
import createBulkTopics from '@/modules/topics/helpers/create-bulk-topics'
import createBulkTags from '@/modules/tags/helpers/create-bulk-tags'
import totalOutlines from '../fields/total-outlines'
import outlineUpdateData from '../fields/outline-update-data'
import updateOutlineTopics from '../fields/update-outline-topics'
import updateOutlineTags from '../fields/update-outline-tags'

export default async (
  _parent: unknown,
  { id, input }: MutationConvertNoteOutlineArgs,
  context: Context & Required<Context>
): Promise<Outline> => {
  const { prisma, user, ipAddress, requestURL, sentryId } = context
  logMutation('convertNoteToOutline %o', {
    input,
    user,
    ipAddress,
    requestURL
  })
  try {
    if (!user) throw new ApolloError('You must be logged in.', '401')

    const totalOutline = await totalOutlines(user)
    if (!user.isPremium && (totalOutline ?? 0) >= 1)
      throw new ApolloError('You have exceeded your outline limit.', '401')

    const note = await prisma.content.findFirst({
      where: { id, class: 'NOTE' }
    })

    if (!note) {
      throw new ApolloError('Outline not found', '404')
    }

    // Share to App
    if (input.apps !== undefined) {
      // Check for Canonical LINK
      await Plugins(input, { user, prisma })
    }

    const data = await outlineUpdateData(input, user)

    // Finally update the category.
    let updatedOutline = await prisma.content.update({
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
      await updateOutlineTopics(updatedOutline, { id, input })
    }

    if (input.tags?.length) {
      // Create bulk tags
      await createBulkTags(input.tags, { user, prisma })
      await updateOutlineTags(updatedOutline, { id, input })
    }

    // Send data to segment
    await sendToSegment({
      operation: 'track',
      eventName: 'create_new_outline',
      userId: user.id,
      data: {
        userEmail: user.email,
        clientId: input.clientId,
        url: input.url,
        teamId: user.activeTeamId
      }
    })

    return updatedOutline
  } catch (e) {
    logError('convertNoteToOutline %o', {
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
