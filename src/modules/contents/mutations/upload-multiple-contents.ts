import { useErrorParser } from '@/helpers'
import { logError, logMutation } from '@/helpers/logger'
import { Context } from '@/types'
import { Content, MutationUploadMultipleContentArgs } from '@/types/modules'
import { ApolloError } from 'apollo-server-core'
import ImportContent from '../helpers/import-content'
import sendToSegment from '@/extensions/segment-service/segment'
import { User as DBUser } from '@prisma/client'
import totalContents from '@/modules/users/fields/total-contents'
import createMultipleContents from '../helpers/create-multiple-contents'

interface Multiple {
  contents: Array<Content>
  tags?: Array<string>
}
export default async (
  _parent: unknown,
  { input }: MutationUploadMultipleContentArgs,
  context: Context & Required<Context>
): Promise<Content[]> => {
  const { prisma, user, ipAddress, requestURL, sentryId } = context
  logMutation('UploadMultipleContentInput %o', {
    input,
    user,
    ipAddress,
    requestURL
  })
  try {
    if (!user) throw new ApolloError('You must be logged in.', '401')

    const totalContent = await totalContents(user)

    const { urls } = input

    // Check if content exceeded
    const lengthOfURLs = urls.length
    const total = (totalContent ?? 0) + lengthOfURLs

    if (!user.isPremium && total >= 12)
      throw new ApolloError('You have exceeded your content limit.', '401')

    const contentData: any = []
    let multipleContent: Multiple | any

    const multipleContents = urls.map(async (url) => {
      const importedContent = await ImportContent({ url }, context)

      return {
        client: {
          name: importedContent.client.name,
          website: importedContent.client.website,
          icon: importedContent.client.icon
        },
        title: importedContent.title,
        excerpt: importedContent.excerpt,
        featuredImage: importedContent.image,
        publishedDate: importedContent.publishedDate,
        tags: importedContent.tags!,
        url: importedContent.url
      }
    })
    const importedContent = await Promise.all(multipleContents)

    multipleContent = await createMultipleContents(importedContent, context)

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

    return multipleContent.contents
  } catch (e) {
    logError('UploadMultipleContentInput %o', {
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
