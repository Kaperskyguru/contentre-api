import { useErrorParser } from '@/helpers'
import { logError, logMutation } from '@/helpers/logger'
import { Context } from '@/types'
import { Content, MutationRemoveContentTagArgs } from '@/types/modules'
import { ApolloError } from 'apollo-server-core'
import { Prisma } from '@prisma/client'

export default async (
  _parent: unknown,
  { id, tags }: MutationRemoveContentTagArgs,
  context: Context & Required<Context>
): Promise<Content> => {
  const { prisma, user, ipAddress, requestURL, sentryId } = context
  logMutation('removeContentTags %o', {
    tags,
    user,
    ipAddress,
    requestURL
  })
  try {
    if (!user) throw new ApolloError('You must be logged in.', '401')

    const content = await prisma.content.findUnique({
      where: { id }
    })

    if (!content) {
      throw new ApolloError('content not found', '404')
    }

    const data: Record<string, unknown> = {}
    if (tags !== undefined && tags?.length) {
      const oldTags = Array.from(content.tags as Prisma.JsonArray)

      let newTags = tags

      if (oldTags.length) {
        newTags = oldTags
          ?.filter((item) => !tags.includes(item?.toString()!))
          .map((item) => item?.toString()!)
      }

      data.tags = newTags
    }

    // Finally update the category.
    return await prisma.content.update({
      where: { id },
      data
    })
  } catch (e) {
    logError('removeContentTags %o', {
      tags,
      user,
      ipAddress,
      requestURL,
      error: e
    })

    const message = useErrorParser(e)

    throw new ApolloError(message, e.code ?? '500', { sentryId })
  }
}
