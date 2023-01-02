import { useErrorParser } from '@/helpers'
import { logError, logMutation } from '@/helpers/logger'
import { Context } from '@/types'
import { Content, MutationUploadContentArgs } from '@/types/modules'
import { ApolloError } from 'apollo-server-core'
import ImportContent from '../helpers/import-content'
import sendToSegment from '@/extensions/segment-service/segment'
import totalContents from '@/modules/users/fields/total-contents'
import createBulkTags from '@/modules/tags/helpers/create-bulk-tags'
import { Prisma } from '@prisma/client'

export default async (
  _parent: unknown,
  { input }: MutationUploadContentArgs,
  context: Context & Required<Context>
): Promise<Content> => {
  const { prisma, user, ipAddress, requestURL, sentryId } = context
  logMutation('uploadContent %o', {
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

    const { url } = input

    const importedContent = await ImportContent({ url }, context)

    // Checking if content already exists
    let client = await prisma.client.findFirst({
      where: { name: importedContent.client.name, userId: user.id }
    })

    if (!client) {
      client = await prisma.client.create({
        data: {
          name: importedContent.client.name,
          website: importedContent.client.website,
          icon: importedContent.client.icon,
          user: { connect: { id: user.id } },
          team: { connect: { id: user.activeTeamId! } }
        }
      })

      // Send data to segment
      await sendToSegment({
        operation: 'track',
        eventName: 'create_new_client',
        userId: user.id,
        data: {
          userEmail: user.email,
          clientId: client.id,
          through: 'article_upload',
          name: client.name
        }
      })
    }

    let newContent = await prisma.content.create({
      data: {
        url,
        title: importedContent.title,
        excerpt: importedContent.excerpt,
        featuredImage: importedContent.image,
        publishedDate: importedContent.publishedDate,
        isPremium: user.isPremium,
        // tags: importedContent.tags!,
        user: { connect: { id: user.id } },
        client: { connect: { id: client.id } },
        team: { connect: { id: user.activeTeamId! } }
      }
    })

    if (importedContent.tags) {
      // Create bulk tags
      await createBulkTags(importedContent.tags, { user, prisma })

      let oldTags: any = []
      if (
        newContent?.tags &&
        typeof newContent?.tags === 'object' &&
        Array.isArray(newContent?.tags)
      ) {
        const tagsObject = newContent?.tags as Prisma.JsonArray
        oldTags = Array.from(tagsObject)
      }
      const newTags = Object.values(importedContent?.tags ?? [])

      const tags = [...new Set([...oldTags, ...newTags])]

      newContent = await prisma.content.update({
        where: { id: newContent.id },
        data: {
          tags
        }
        // include: { category: true, client: true }
      })
    }

    // Send data to segment
    await sendToSegment({
      operation: 'track',
      eventName: 'upload_new_content',
      userId: user.id,
      data: {
        userEmail: user.email,
        clientId: client.id,
        url
      }
    })

    return newContent
  } catch (e) {
    logError('uploadContent %o', {
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
