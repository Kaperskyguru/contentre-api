import { Content } from '@/types/modules'
import { Context } from '@/types'
import createBulkTags from '@/modules/tags/helpers/create-bulk-tags'
import { Prisma } from '@prisma/client'
import { ApolloError } from 'apollo-server-errors'
// import ImportContent from "./import-content"

interface Multiple {
  contents: Array<Content>
  tags?: Array<string>
}

export default async (
  contents: Array<any>,
  context: Context & Required<Context>
): Promise<any> => {
  const { prisma, user, ipAddress, requestURL, sentryId } = context

  if (!user) throw new ApolloError('You must be logged in.', '401')

  const contentData: any = []
  let multipleContent: Multiple | any

  const createdContents = contents
    .map((i) => i)
    .map(async (content) => {
      // Checking if client already exists
      let client
      try {
        client = await prisma.client.upsert({
          where: {
            name_userId_website_unique_constraint: {
              name: content.client.name,
              userId: user?.id!,
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
            user: { connect: { id: user?.id! } },
            team: { connect: { id: user?.activeTeamId! } }
          }
        })
      } catch (e) {
        client = await prisma.client.findFirst({
          where: {
            name: content.client.name,
            userId: user?.id,
            website: content.client.website!
          }
        })
      }

      let newContent = await prisma.content.create({
        data: {
          url: content.url,
          title: content.title,
          excerpt: content.excerpt,
          featuredImage: content.featuredImage,
          publishedDate: content.publishedDate,
          // tags: content.tags!,
          isPremium: user?.isPremium,
          user: { connect: { id: user?.id } },
          client: { connect: { id: client?.id } },
          team: { connect: { id: user?.activeTeamId! } }
        }
      })

      if (content.tags) {
        // const data: any = []

        // const promiseTags = content.tags.map(async (name: string) => {
        //   const tag = await prisma.tag.findFirst({
        //     where: { name, userId: user?.id, teamId: user?.activeTeamId }
        //   })

        //   if (!tag) {
        //     data.push({
        //       name,
        //       userId: user?.id,
        //       teamId: user?.activeTeamId!
        //     })
        //   }
        //   return data
        // })

        // await Promise.all(promiseTags)

        // await prisma.tag.createMany({
        //   data,
        //   skipDuplicates: true
        // })

        // Create bulk tags
        await createBulkTags(content.tags, { user, prisma })

        let oldTags: any = []
        if (
          newContent?.tags &&
          typeof newContent?.tags === 'object' &&
          Array.isArray(newContent?.tags)
        ) {
          const tagsObject = newContent?.tags as Prisma.JsonArray
          oldTags = Array.from(tagsObject)
        }
        const newTags = Object.values(content?.tags ?? [])

        const tags = [...new Set([...oldTags, ...newTags])]

        newContent = await prisma.content.update({
          where: { id: newContent.id },
          data: {
            tags
          }
        })
      }

      contentData.push(newContent)
      multipleContent = { contents: contentData }

      return multipleContent
    })

  await Promise.all(createdContents)

  return multipleContent
}
