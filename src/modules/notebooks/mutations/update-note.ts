import { useErrorParser } from '@helpers'
import { logError, logMutation } from '@helpers/logger'
import { Note, MutationUpdateNoteArgs } from '@modules-types'
import { Context } from '@types'
import { ApolloError } from 'apollo-server-errors'

export default async (
  _parent: unknown,
  { id, input }: MutationUpdateNoteArgs,
  { user, sentryId, prisma, ipAddress, requestURL }: Context & Required<Context>
): Promise<Note> => {
  logMutation('updateNote %o', {
    input,
    user,
    ipAddress,
    requestURL
  })

  try {
    // User must be logged in before performing the operation.
    if (!user) throw new ApolloError('You must be logged in.', '401')

    // Extract fields from the mutation input.
    const { title, content, shareable, notebookId } = input

    // Check for required arguments not provided.
    if (!id) {
      throw new ApolloError('Invalid input', '422')
    }

    // Prepare data for the update, checking and filling each possible field.
    const data: Record<string, unknown> = {}

    if (title !== undefined) data.title = title
    if (shareable !== undefined) data.shareable = shareable
    if (content !== undefined) data.content = content
    if (notebookId !== undefined) data.notebookId = notebookId

    // Finally update the Note.
    return await prisma.content.update({
      where: { id },
      data: {
        ...data,
        status: 'DRAFT'
      }
    })
  } catch (e) {
    logError('updateNote %o', {
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
