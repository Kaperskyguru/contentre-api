import { useErrorParser } from '@/helpers'
import { logError, logMutation } from '@/helpers/logger'
import { Context } from '@/types'
import { Content, MutationUploadMultipleContentArgs } from '@/types/modules'
import { ApolloError } from 'apollo-server-core'
import ImportContent from '../helpers/import-content'
import sendToSegment from '@/extensions/segment-service/segment'
import { User as DBUser } from '@prisma/client'
import totalContents from '@/modules/users/fields/total-contents'

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

    const createdContents = importedContent
      .map((i) => i)
      .map(async (content) => {
        // Checking if client already exists
        let client
        try {
          client = await prisma.client.upsert({
            where: {
              name_userId_website_unique_constraint: {
                name: content.client.name,
                userId: user.id,
                website: content.client.website!
              }
            },
            update: {
              website: content.client.website
            },
            create: {
              name: content.client.name,
              website: content.client.website,

              icon: content.client.icon,
              user: { connect: { id: user.id } },
              team: { connect: { id: user.activeTeamId! } }
            }
          })
        } catch (e) {
          client = await prisma.client.findFirst({
            where: {
              name: content.client.name,
              userId: user.id,
              website: content.client.website!
            }
          })
        }

        const newContent = await prisma.content.create({
          data: {
            url: content.url,
            title: content.title,
            excerpt: content.excerpt,
            featuredImage: content.featuredImage,
            publishedDate: content.publishedDate,
            tags: content.tags!,
            isPremium: user.isPremium,
            user: { connect: { id: user.id } },
            client: { connect: { id: client?.id } },
            team: { connect: { id: user.activeTeamId! } }
          }
        })

        if (content.tags) {
          const data: any = []

          const promiseTags = content.tags.map(async (name) => {
            const tag = await prisma.tag.findFirst({
              where: { name, userId: user.id, teamId: user.activeTeamId }
            })

            if (!tag) {
              data.push({
                name,
                userId: user.id,
                teamId: user.activeTeamId!
              })
            }
            return data
          })

          await Promise.all(promiseTags)

          await prisma.tag.createMany({
            data,
            skipDuplicates: true
          })
        }

        contentData.push(newContent)
        multipleContent = { contents: contentData, tags: content?.tags! }

        return multipleContent
      })

    await Promise.all(createdContents)

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

    console.log(e)

    throw new ApolloError(message, e.code ?? '500', { sentryId })
  }
}
