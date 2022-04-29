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

    const { url, clientId, content, excerpt, title, tags, category, status } =
      input

    const categoryId =
      (await getOrCreateCategoryId(category, { user, prisma })) ?? undefined

    const newContent = await prisma.content.create({
      data: {
        url,
        title,
        excerpt,
        content,
        status: status ?? 'PUBLISHED',
        category: { connect: { id: categoryId } },
        tags: tags?.length || undefined,
        user: { connect: { id: user.id } },
        client: { connect: { id: clientId } },
        team: { connect: { id: user.activeTeamId! } }
      }
    })

    if (tags?.length) {
      const tagNames = Object.values(tags).map((name: any) => ({
        name,
        userId: user.id
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

    throw new ApolloError(message, e.code ?? '500', { sentryId })
  }
}
