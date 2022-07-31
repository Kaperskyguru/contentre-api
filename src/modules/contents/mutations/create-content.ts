import { useErrorParser } from '@/helpers'
import { logError, logMutation } from '@/helpers/logger'
import { Context } from '@/types'
import { Content, MutationCreateContentArgs } from '@/types/modules'
import { ApolloError } from 'apollo-server-core'
import sendToSegment from '@extensions/segment-service/segment'
import Plugins from '@/helpers/plugins'
import { Topic } from '@prisma/client'
import { getOrCreateCategoryId } from '@/modules/categories/helpers'

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
        visibility: visibility ?? 'PRIVATE',
        status: status ?? 'PUBLISHED',
        tags: tags?.length ? tags : undefined,
        user: { connect: { id: user.id } },
        team: { connect: { id: user.activeTeamId! } },
        ...data
      }
    })

    if (topics?.length) {
      // Get all existing topics
      const availableTopics = await prisma.topic.findMany({
        where: {
          name: {
            in: topics?.map((item) => item)
          },
          teamId: user.activeTeamId
        },
        select: { name: true }
      })
      const mappedTopics = availableTopics.map((item) => item.name)

      // Remove existing topics from new topic's array
      const newTopics = topics?.filter((item) => !mappedTopics.includes(item))

      // Create the remaining topics
      const topicNames = Object.values(newTopics).map((name: any) => ({
        name,
        contentId: newContent.id,
        teamId: user.activeTeamId! ?? undefined
        // team: { connect: { id: user.activeTeamId! } }
      }))

      console.log(topicNames)

      await prisma.topic.createMany({
        data: topicNames
      })

      await sendToSegment({
        operation: 'track',
        eventName: 'bulk_create_new_topic',
        userId: user.id,
        data: {
          userEmail: user.email,
          topics: topics
        }
      })
    }

    if (tags?.length) {
      const tagNames = Object.values(tags).map((name: any) => ({
        name,
        userId: user.id,
        teamId: user.activeTeamId! ?? undefined,
        team: { connect: { id: user.activeTeamId! } }
      }))

      await prisma.tag.createMany({
        data: tagNames
      })

      await sendToSegment({
        operation: 'track',
        eventName: 'bulk_create_new_tag',
        userId: user.id,
        data: {
          userEmail: user.email,
          tags: tags
        }
      })
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
