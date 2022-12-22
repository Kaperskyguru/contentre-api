import { useErrorParser } from '@/helpers'
import { logError, logMutation } from '@/helpers/logger'
import { Context } from '@/types'
import { MutationCreateTagArgs, Tag } from '@/types/modules'
import { ApolloError } from 'apollo-server-core'
import sendToSegment from '@extensions/segment-service/segment'

export default async (
  _parent: unknown,
  { input }: MutationCreateTagArgs,
  context: Context & Required<Context>
): Promise<Tag> => {
  const { prisma, user, ipAddress, requestURL, sentryId } = context
  logMutation('createTag %o', {
    input,
    user,
    ipAddress,
    requestURL
  })

  try {
    const { name } = input

    if (!user) throw new ApolloError('You must be logged in.', '401')

    if (!name) throw new ApolloError('invalid input', '422')

    // Checking if client already exists
    const tag = await prisma.tag.findFirst({
      where: { name, userId: user.id }
    })

    if (tag) return tag

    // If success, create a new tag in our DB.
    const [result, countTags] = await prisma.$transaction([
      prisma.tag.create({
        data: {
          name,
          team: { connect: { id: user.activeTeamId! } },
          user: { connect: { id: user.id } }
        }
      }),

      prisma.tag.count({
        where: { userId: user.id }
      })
    ])

    await sendToSegment({
      operation: 'identify',
      userId: user.id,
      data: {
        email: user.email
      }
    })

    await sendToSegment({
      operation: 'track',
      eventName: 'create_new_tag',
      userId: user.id,
      data: {
        tagName: input.name,
        tagCount: countTags
      }
    })

    return result
  } catch (e) {
    logError('createTag %o', {
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
