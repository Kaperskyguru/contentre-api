import { useErrorParser } from '@/helpers'
import { logError, logMutation } from '@/helpers/logger'
import { Context } from '@/types'
import { MutationDeleteBulkOutlineArgs } from '@/types/modules'
import { ApolloError } from 'apollo-server-core'
import sendToSegment from '@/extensions/segment-service/segment'

export default async (
  _parent: unknown,
  { input }: MutationDeleteBulkOutlineArgs,
  context: Context & Required<Context>
): Promise<boolean> => {
  const { prisma, user } = context
  logMutation('deleteBulkOutline %o', { user, ids: input.ids })
  try {
    // User must be logged in before performing the operation.
    if (!user) throw new ApolloError('You must be logged in.', '401')

    // Check for required arguments not provided.
    if (!input.ids) {
      throw new ApolloError('Invalid input', '422')
    }

    const [deletedOutline] = await prisma.$transaction([
      // // Delete the outlines.
      prisma.content.deleteMany({
        where: {
          class: 'OUTLINE',
          id: {
            in: input.ids
          }
        }
      })
    ])

    await sendToSegment({
      operation: 'identify',
      userId: user.id,
      data: {
        email: user.email
      }
    })

    // Send data to segment
    await sendToSegment({
      operation: 'track',
      eventName: 'bulk_outline_deleted',
      userId: user.id,
      data: {
        ids: input.ids
      }
    })
    return deletedOutline ? true : false
  } catch (e) {
    logError('createOutline %o', user)

    const message = useErrorParser(e)

    throw new ApolloError(message, e.code ?? '500', {})
  }
}
