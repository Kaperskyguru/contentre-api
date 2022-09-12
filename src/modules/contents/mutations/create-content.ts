import { useErrorParser } from '@/helpers'
import { logError, logMutation } from '@/helpers/logger'
import { Context } from '@/types'
import { Content, MutationCreateContentArgs } from '@/types/modules'
import { ApolloError } from 'apollo-server-core'
import sendToSegment from '@extensions/segment-service/segment'
import Plugins from '@/helpers/plugins'
import { getOrCreateCategoryId } from '@/modules/categories/helpers'
import createBulkTopics from '@/modules/topics/helpers/create-bulk-topics'
import createBulkTags from '@/modules/tags/helpers/create-bulk-tags'
import totalContents from '@/modules/users/fields/total-contents'

export default async (
  _parent: unknown,
  { input }: MutationCreateContentArgs,
  context: Context & Required<Context>
): Promise<Content> => {
  const { prisma, user, ipAddress, requestURL, sentryId } = context
  logMutation('createContent %o', {
    input,
    user,
    ipAddress,
    requestURL
  })
  try {
    if (!user) throw new ApolloError('You must be logged in.', '401')

    // Check if content exceeded
    const totalContent = await totalContents(user)
    if (!user.isPremium && (totalContent ?? 0) >= 12)
      throw new ApolloError('You have exceeded your content limit.', '401')

    const {
      url,
      clientId,
      visibility,
      content,
      excerpt,
      title,
      tags,
      topics,
      noteId,
      category,
      featuredImage,
      status,
      apps
    } = input

    const categoryId =
      (await getOrCreateCategoryId(category, { user, prisma })) ?? undefined

    // const topicId =
    // (await getOrCreateTopicId(category, { user, prisma })) ?? undefined

    // Share to App
    if (apps !== undefined) {
      // Check for Canonical LINK

      await Plugins(input, { user, prisma })
    }

    const data: Record<string, unknown> = {}
    if (clientId !== undefined) {
      data.client = { connect: { id: clientId } }
    }
    if (categoryId !== undefined) {
      data.category = { connect: { id: categoryId } }
    }
    //Generate excerpt
    let defaultExcerpt: string | null = null
    if (excerpt === undefined) {
      defaultExcerpt = content?.substring(0, 140) ?? ''
    } else defaultExcerpt = excerpt

    const newContent = await prisma.content.create({
      data: {
        url,
        title,
        excerpt: defaultExcerpt!,
        content,
        featuredImage,
        isPremium: user.isPremium,
        visibility: visibility ?? 'PRIVATE',
        status: status ?? 'PUBLISHED',
        tags: tags?.length ? tags : undefined,
        topics: topics?.length ? topics : undefined,
        user: { connect: { id: user.id } },
        team: { connect: { id: user.activeTeamId! } },
        ...data
      }
    })

    if (input.topics?.length) {
      // Create bulk topics
      await createBulkTopics(input.topics, { user, prisma })
    }

    if (input.tags?.length) {
      // Create bulk tags
      await createBulkTags(input.tags, { user, prisma })
    }

    // Delete Note
    if (noteId) {
      await prisma.note.delete({
        where: { id: noteId }
      })
    }

    // Send data to segment
    await sendToSegment({
      operation: 'track',
      eventName: 'create_new_content',
      userId: user.id,
      data: {
        userEmail: user.email,
        clientId: clientId,
        url,
        teamId: user.activeTeamId
      }
    })

    return newContent
  } catch (e) {
    logError('createContent %o', {
      input,
      user,
      ipAddress,
      requestURL,
      error: e
    })

    const message = useErrorParser(e)

    console.log(e)

    throw new ApolloError(message, e.code ?? '500', { sentryId })
  }
}
