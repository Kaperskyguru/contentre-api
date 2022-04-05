import { useErrorParser } from '@helpers'
import { logError, logMutation } from '@helpers/logger'
import { MutationDeleteTagArgs } from '@modules-types'
import { Context } from '@types'
import { ApolloError } from 'apollo-server-errors'
import sendToSegment from '@extensions/segment-service/segment'

export default async (
  _parent: unknown,
  { id }: MutationDeleteTagArgs,
  { user, sentryId, prisma }: Context & Required<Context>
): Promise<boolean> => {
  logMutation('deleteTag %o', user)

  try {
    // User must be logged in before performing the operation.
    if (!user) throw new ApolloError('You must be logged in.', '401')

    // Check for required arguments not provided.
    if (!id) {
      throw new ApolloError('Invalid input', '422')
    }

    const tag = await prisma.tag.findUnique({
      where: { id }
    })

    if (!tag) {
      throw new ApolloError('tag not found', '404')
    }

    // Check if the user is authorized to delete the tag.
    if (tag.userId !== user.id) {
      throw new Error('unauthorized')
    }

    const [result, countTags] = await prisma.$transaction([
      prisma.tag.delete({
        where: { id }
      }),

      prisma.tag.count({
        where: { id: user.id }
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
      eventName: 'delete_tag',
      userId: user.id,
      data: {
        tagId: tag.id,
        tagName: tag?.name,
        tagCount: countTags
      }
    })

    return !!result
  } catch (e) {
    logError('deleteTag %o', e)

    const message = useErrorParser(e)
    throw new ApolloError(message, e.code ?? '500', { sentryId })
  }
}
