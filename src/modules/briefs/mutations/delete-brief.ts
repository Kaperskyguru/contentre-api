import { useErrorParser } from '@helpers'
import { logError, logMutation } from '@helpers/logger'
import { MutationDeleteBriefArgs } from '@modules-types'
import { Context } from '@types'
import { ApolloError } from 'apollo-server-errors'
import sendToSegment from '@extensions/segment-service/segment'

export default async (
  _parent: unknown,
  { id }: MutationDeleteBriefArgs,
  { user, sentryId, prisma }: Context & Required<Context>
): Promise<boolean> => {
  logMutation('deleteBrief %o', user)

  try {
    // User must be logged in before performing the operation.
    if (!user) throw new ApolloError('You must be logged in.', '401')

    // Check for required arguments not provided.
    if (!id) {
      throw new ApolloError('Invalid input', '422')
    }

    const brief = await prisma.content.findUnique({
      where: { id }
    })

    if (!brief) {
      throw new ApolloError('Brief not found', '404')
    }

    // Check if the user is authorized to delete the brief.
    if (brief.userId !== user.id) {
      throw new Error('unauthorized')
    }

    const [result, countBriefs] = await prisma.$transaction([
      prisma.content.delete({
        where: { id }
      }),

      prisma.content.count({
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
      eventName: 'delete_brief',
      userId: user.id,
      data: {
        briefId: brief.id,
        briefTitle: brief?.title,
        briefCount: countBriefs
      }
    })

    return !!result
  } catch (e) {
    logError('deleteBrief %o', e)

    const message = useErrorParser(e)
    throw new ApolloError(message, e.code ?? '500', { sentryId })
  }
}
