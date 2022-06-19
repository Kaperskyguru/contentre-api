import { useErrorParser } from '@/helpers'
import { logError, logMutation } from '@/helpers/logger'
import { Context } from '@/types'
import { Content, MutationConvertNoteContentArgs } from '@/types/modules'
import { ApolloError } from 'apollo-server-core'
import getOrCreateCategoryId from '../helpers/getOrCreateCategory'
import sendToSegment from '@extensions/segment-service/segment'
import Plugins from '@/helpers/plugins'

export default async (
  _parent: unknown,
  { id, input }: MutationConvertNoteContentArgs,
  context: Context & Required<Context>
): Promise<Content> => {
  const { prisma, user, ipAddress, requestURL, sentryId } = context
  logMutation('covertNoteContent %o', {
    input,
    user,
    ipAddress,
    requestURL
  })
  try {
    if (!user) throw new ApolloError('You must be logged in.', '401')

    const { url, clientId, visibility, excerpt, tags, category, status, apps } =
      input

    //Generate category
    const categoryId =
      (await getOrCreateCategoryId(category, { user, prisma })) ?? undefined

    //Check if Note exist
    const note = await prisma.note.findFirst({
      where: { id: id, userId: user.id, teamId: user.activeTeamId }
    })
    if (!note) throw new ApolloError('Note not found', '404')

    // Check for clientID
    const data: Record<string, unknown> = {}
    if (clientId !== undefined) {
      data.client = { connect: { id: clientId } }
    }

    //Generate excerpt
    let defaultExcerpt: string | null = null
    if (excerpt === undefined) {
      defaultExcerpt = note.content?.substring(0, 140) ?? ''
    } else defaultExcerpt = excerpt

    //Create new Content
    const newContent = await prisma.content.create({
      data: {
        url,
        title: note?.title!,
        excerpt: defaultExcerpt!,
        content: note.content,
        visibility: visibility ?? 'PRIVATE',
        status: status ?? 'PUBLISHED',
        category: { connect: { id: categoryId } },
        tags: tags?.length ? tags : undefined,
        user: { connect: { id: user.id } },
        team: { connect: { id: user.activeTeamId! } },
        ...data
      }
    })

    // Delete Note
    await prisma.note.delete({
      where: { id }
    })

    // Create tags
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

    // Share to App
    if (apps !== undefined) {
      if (apps?.medium) {
        apps.medium.title = newContent.title
        apps.medium.content = newContent?.content ?? newContent.excerpt
        apps.medium.tags = input.tags
      }

      await Plugins(apps, { user, prisma })
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
    logError('covertNoteContent %o', {
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
