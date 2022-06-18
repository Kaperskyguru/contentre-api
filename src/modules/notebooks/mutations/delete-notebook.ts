import { useErrorParser } from '@helpers'
import { logError, logMutation } from '@helpers/logger'
import { MutationDeleteNotebookArgs } from '@modules-types'
import { Context } from '@types'
import { ApolloError } from 'apollo-server-errors'
import sendToSegment from '@extensions/segment-service/segment'

export default async (
  _parent: unknown,
  { id }: MutationDeleteNotebookArgs,
  { user, sentryId, prisma }: Context & Required<Context>
): Promise<boolean> => {
  logMutation('deleteNotebook %o', user)

  try {
    // User must be logged in before performing the operation.
    if (!user) throw new ApolloError('You must be logged in.', '401')

    // Check for required arguments not provided.
    if (!id) {
      throw new ApolloError('Invalid input', '422')
    }

    const notebook = await prisma.notebook.findUnique({
      where: { id }
    })

    if (!notebook) {
      throw new ApolloError('notebook not found', '404')
    }

    // Check if the user is authorized to delete the notebook.
    if (notebook.userId !== user.id) {
      throw new Error('unauthorized')
    }

    const [result, countNotebooks] = await prisma.$transaction([
      prisma.notebook.delete({
        where: { id }
      }),

      prisma.notebook.count({
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
      eventName: 'delete_notebook',
      userId: user.id,
      data: {
        notebookId: notebook.id,
        notebookName: notebook?.name,
        notebookCount: countNotebooks
      }
    })

    return !!result
  } catch (e) {
    logError('deleteNotebook %o', e)

    const message = useErrorParser(e)
    throw new ApolloError(message, e.code ?? '500', { sentryId })
  }
}
