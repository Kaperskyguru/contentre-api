import { useErrorParser } from '@/helpers'
import { logError, logMutation } from '@/helpers/logger'
import { Context } from '@/types'
import { Content, MutationUploadContentArgs } from '@/types/modules'
import { ApolloError } from 'apollo-server-core'
import ImportContent from '../helpers/import-content'

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

    const { url } = input

    const importedContent = await ImportContent({ url }, context)

    // Checking if content already exists
    let client = await prisma.client.findFirst({
      where: { website: importedContent.client.website, userId: user.id }
    })

    if (!client)
      client = await prisma.client.create({
        data: {
          name: importedContent.client.name,
          website: importedContent.client.website,
          icon: importedContent.client.icon,
          user: { connect: { id: user.id } }
        }
      })

    const newContent = await prisma.content.create({
      data: {
        url,
        title: importedContent.title,
        excerpt: importedContent.excerpt,
        featuredImage: importedContent.image,
        tags: importedContent.tags,
        user: { connect: { id: user.id } },
        client: { connect: { id: client.id } }
      }
    })

    if (importedContent.tags) {
      const tags = importedContent.tags.map((name) => ({ name }))
      await prisma.tag.createMany({
        data: tags,
        skipDuplicates: true
      })
    }

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
