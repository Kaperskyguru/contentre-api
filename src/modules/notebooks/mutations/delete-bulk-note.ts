import { useErrorParser } from '@/helpers'
import { logError, logMutation } from '@/helpers/logger'
import { Context } from '@/types'
import { MutationDeleteBulkNoteArgs } from '@/types/modules'
import { ApolloError } from 'apollo-server-core'
import sendToSegment from '@/extensions/segment-service/segment'

export default async (
  _parent: unknown,
  { input }: MutationDeleteBulkNoteArgs,
  context: Context & Required<Context>
): Promise<boolean> => {
  const { prisma, user } = context
  logMutation('deleteBulkNote %o', { user, ids: input.ids })
  try {
    // User must be logged in before performing the operation.
    if (!user) throw new ApolloError('You must be logged in.', '401')

    // Check for required arguments not provided.
    if (!input.ids) {
      throw new ApolloError('Invalid input', '422')
    }

    const [deletedNote] = await prisma.$transaction([
      // // Delete the notes.
      prisma.content.deleteMany({
        where: {
          status: 'DRAFT',
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
      eventName: 'bulk_note_deleted',
      userId: user.id,
      data: {
        ids: input.ids
      }
    })
    return deletedNote ? true : false
  } catch (e) {
    logError('createNote %o', user)

    const message = useErrorParser(e)

    throw new ApolloError(message, e.code ?? '500', {})
  }
}
