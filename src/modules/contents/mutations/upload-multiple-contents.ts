import { useErrorParser } from '@/helpers'
import { logError, logMutation } from '@/helpers/logger'
import { Context } from '@/types'
import { Content, MutationUploadMultipleContentArgs } from '@/types/modules'
import { ApolloError } from 'apollo-server-core'
import ImportContent from '../helpers/import-content'
import sendToSegment from '@/extensions/segment-service/segment'

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

    const { urls } = input
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
        url
      }
    })
    const importedContent = await Promise.all(multipleContents)

    const createdContents = importedContent
      .map((i) => i)
      .map(async (content) => {
        // Checking if client already exists
        let client = await prisma.client.findFirst({
          where: {
            name: content.client.name,
            userId: user.id,
            website: content.client.website
          }
        })

        if (!client) {
          client = await prisma.client.create({
            data: {
              name: content.client.name,
              website: content.client.website,
              icon: content.client.icon,
              user: { connect: { id: user.id } },
              team: { connect: { id: user.activeTeamId! } }
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
            user: { connect: { id: user.id } },
            client: { connect: { id: client.id } },
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

    // const importedContent = urls.map(async (url) => {
    //     const importedContent = await ImportContent({ url }, context)

    //   return {
    //     client: {
    //       name: importedContent.client.name,
    //       website: importedContent.client.website,
    //       icon: importedContent.client.icon
    //     },
    //     title: importedContent.title,
    //     excerpt: importedContent.excerpt,
    //     featuredImage: importedContent.image,
    //     publishedDate: importedContent.publishedDate,
    //     tags: importedContent.tags!,
    //     url
    //   }

    // Checking if content already exists
    // const mappedClients = contents.map((content) => ({
    //   name: content.client.name,
    //   website: content.client.website,
    //   url: content.url,
    //   icon: content.client.icon,
    //   userId: user.id,
    //   team: { connect: { id: user.activeTeamId! } }
    // }))

    // let existingClients = await prisma.client.findMany({
    //   where: {
    //     name: { in: mappedClients.map((c) => c.name) },
    //     userId: user.id
    //   }
    // })

    // // Remove not existing clients
    // const removeNotExistingClients = mappedClients.filter(
    //   (client) => !existingClients.map((c) => c.name).includes(client.name)
    // )

    // // Remove
    // const removeExistingClients = mappedClients.filter((client) =>
    //   existingClients.map((c) => c.name).includes(client.name)
    // )

    // if (removeNotExistingClients.length) {
    //   clients = await prisma.client.createMany({
    //     data: [...removeNotExistingClients]
    //   })

    //   // Send data to segment
    //   await sendToSegment({
    //     operation: 'track',
    //     eventName: 'create_bulk_clients',
    //     userId: user.id,
    //     data: {
    //       userEmail: user.email,
    //       through: 'multiple_article_upload',
    //       clients: clients
    //     }
    //   })
    // }

    // const mergedClients = [...clients, ...existingClients]

    // const newContent = await prisma.content.create({
    //   data: {
    //     url,
    //     title: importedContent.title,
    //     excerpt: importedContent.excerpt,
    //     featuredImage: importedContent.image,
    //     publishedDate: importedContent.publishedDate,
    //     tags: importedContent.tags!,
    //     user: { connect: { id: user.id } },
    //     client: { connect: { id: client.id } },
    //     team: { connect: { id: user.activeTeamId! } }
    //   }
    // })

    // if (importedContent.tags) {
    //   const data: any = []

    //   const promiseTags = importedContent.tags.map(async (name) => {
    //     const tag = await prisma.tag.findFirst({
    //       where: { name, userId: user.id, teamId: user.activeTeamId }
    //     })

    //     if (!tag) {
    //       data.push({
    //         name,
    //         userId: user.id,
    //         teamId: user.activeTeamId!
    //       })
    //     }
    //     return data
    //   })

    //   await Promise.all(promiseTags)

    //   await prisma.tag.createMany({
    //     data,
    //     skipDuplicates: true
    //   })

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
