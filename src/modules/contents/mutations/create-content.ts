import { useErrorParser } from '@/helpers'
import { logError, logMutation } from '@/helpers/logger'
import { Context } from '@/types'
import { Content, MutationCreateContentArgs, Tag } from '@/types/modules'
import { ApolloError } from 'apollo-server-core'
import getOrCreateCategoryId from '../helpers/getOrCreateCategory'

export default async (
  _parent: unknown,
  { input }: MutationCreateContentArgs,
  context: Context & Required<Context>
): Promise<Content | null> => {
  const { prisma, user, ipAddress, requestURL, sentryId } = context
  logMutation('createContent %o', {
    input,
    user,
    ipAddress,
    requestURL
  })
  try {
    if (!user) throw new ApolloError('You must be logged in.', '401')

    const { url, clientId, content, excerpt, title, tags, category } = input

    const categoryId =
      (await getOrCreateCategoryId(category, { user, prisma })) ?? undefined

    const newContent = await prisma.content.create({
      data: {
        url,
        title,
        excerpt,
        content,
        category: { connect: { id: categoryId } },
        // tags: { ...Object.values(tags) },
        user: { connect: { id: user.id } },
        client: { connect: { id: clientId } }
      }
    })

    if (tags) {
      const tagNames = Object.values(tags).map((name: any) => ({
        name
      }))

      await prisma.tag.createMany({
        data: tagNames,
        skipDuplicates: true
      })
    }

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
