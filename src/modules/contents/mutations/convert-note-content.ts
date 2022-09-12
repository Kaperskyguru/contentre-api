import { useErrorParser } from '@/helpers'
import { logError, logMutation } from '@/helpers/logger'
import { Context } from '@/types'
import { Content, MutationConvertNoteContentArgs } from '@/types/modules'
import { ApolloError } from 'apollo-server-core'
import sendToSegment from '@extensions/segment-service/segment'
import Plugins from '@/helpers/plugins'
import { getOrCreateCategoryId } from '@/modules/categories/helpers'
import createBulkTopics from '@/modules/topics/helpers/create-bulk-topics'
import createBulkTags from '@/modules/tags/helpers/create-bulk-tags'
import { Prisma } from '@prisma/client'
import totalContents from '@/modules/users/fields/total-contents'

export default async (
  _parent: unknown,
  { id, input }: MutationConvertNoteContentArgs,
  context: Context & Required<Context>
): Promise<Content> => {
  const { prisma, user, ipAddress, requestURL, sentryId } = context
  logMutation('convertNoteToContent %o', {
    input,
    user,
    ipAddress,
    requestURL
  })
  try {
    if (!user) throw new ApolloError('You must be logged in.', '401')

    const totalContent = await totalContents(user)
    if (!user.isPremium && (totalContent ?? 0) >= 12)
      throw new ApolloError('You have exceeded your content limit.', '401')

    // Share to App
    if (input.apps !== undefined) {
      // Check for Canonical LINK
      await Plugins(input, { user, prisma })
    }

    const data: Record<string, unknown> = {}
    if (input.clientId !== undefined) {
      data.client = { connect: { id: input.clientId } }
    }

    if (input.category !== undefined) {
      const categoryId = await getOrCreateCategoryId(input.category, {
        user,
        prisma
      })

      if (categoryId !== undefined)
        data.category = { connect: { id: categoryId } }
    }

    if (input.featuredImage !== undefined) {
      await prisma.media.create({
        data: { teamId: user.activeTeamId!, url: input.featuredImage! }
      })
      data.featuredImage = input.featuredImage
    }

    if (input.excerpt === undefined) {
      data.excerpt = input.content?.substring(0, 140) ?? ''
    } else {
      data.excerpt = input.excerpt
    }

    if (input.clientId !== undefined)
      data.client = { connect: { id: input.clientId } }

    if (input.content !== undefined) data.content = input.content
    if (input.title !== undefined) data.title = input.title
    if (input.url !== undefined) data.url = input.url
    if (input.visibility !== undefined) data.visibility = input.visibility
    if (input.status !== undefined) data.status = input.status
    if (input.amount !== undefined) data.amount = input.amount

    const content = await prisma.content.findUnique({
      where: { id }
    })

    if (!content) {
      throw new ApolloError('content not found', '404')
    }

    // Finally update the category.
    let updatedContent = await prisma.content.update({
      where: { id },
      data: {
        notebook: {
          disconnect: true
        },
        ...data,
        isPremium: user.isPremium
      },
      include: { category: true, client: true }
    })

    if (input.topics?.length) {
      // Create bulk topics
      await createBulkTopics(input.topics, { user, prisma })

      if (
        updatedContent?.topics &&
        typeof updatedContent?.topics === 'object' &&
        Array.isArray(updatedContent?.topics)
      ) {
        const topicsObject = updatedContent?.topics as Prisma.JsonArray
        const newTopics = Object.values(input?.topics)

        const oldTopics = Array.from(topicsObject)
        const topics = [...oldTopics, ...newTopics]

        updatedContent = await prisma.content.update({
          where: { id },
          data: {
            topics
          },
          include: { category: true, client: true }
        })
      }
    }

    if (input.topics?.length) {
      // Create bulk tags
      await createBulkTags(input.tags, { user, prisma })

      if (
        updatedContent?.tags &&
        typeof updatedContent?.tags === 'object' &&
        Array.isArray(updatedContent?.tags)
      ) {
        const tagsObject = updatedContent?.tags as Prisma.JsonArray
        const newTags = Object.values(input?.tags ?? [])

        const oldTags = Array.from(tagsObject)
        const tags = [...oldTags, ...newTags]

        updatedContent = await prisma.content.update({
          where: { id },
          data: {
            tags
          },
          include: { category: true, client: true }
        })
      }
    }

    // Send data to segment
    await sendToSegment({
      operation: 'track',
      eventName: 'create_new_content',
      userId: user.id,
      data: {
        userEmail: user.email,
        clientId: input.clientId,
        url: input.url,
        teamId: user.activeTeamId
      }
    })

    return updatedContent
  } catch (e) {
    logError('convertNoteToContent %o', {
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
