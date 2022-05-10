import { useErrorParser } from '@/helpers'
import { logError, logMutation } from '@/helpers/logger'
import { Context } from '@/types'
import { Content, MutationCreateContentArgs, Tag } from '@/types/modules'
import { ApolloError } from 'apollo-server-core'
import getOrCreateCategoryId from '../helpers/getOrCreateCategory'
import sendToSegment from '@extensions/segment-service/segment'

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

    const {
      url,
      clientId,
      visibility,
      content,
      excerpt,
      title,
      tags,
      category,
      status
    } = input

    const categoryId =
      (await getOrCreateCategoryId(category, { user, prisma })) ?? undefined

    const data: Record<string, unknown> = {}
    if (clientId !== undefined) {
      data.client = { connect: { id: clientId } }
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
        visibility: visibility ?? 'PRIVATE',
        status: status ?? 'PUBLISHED',
        category: { connect: { id: categoryId } },
        tags: tags?.length ? tags : undefined,
        user: { connect: { id: user.id } },
        team: { connect: { id: user.activeTeamId! } },
        ...data
      }
    })

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

    // Send data to segment
    await sendToSegment({
      operation: 'track',
      eventName: 'create_new_content',
      userId: user.id,
      data: {
        userEmail: user.email,
        clientId: clientId,
        url
        // companyId: user.activeCompanyId,
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
