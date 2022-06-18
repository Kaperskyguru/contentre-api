import { useErrorParser } from '@/helpers'
import { logError, logMutation } from '@/helpers/logger'
import { Context } from '@/types'
import { MutationCreateNoteArgs, Note } from '@/types/modules'
import { ApolloError } from 'apollo-server-core'
import sendToSegment from '@extensions/segment-service/segment'

export default async (
  _parent: unknown,
  { input }: MutationCreateNoteArgs,
  context: Context & Required<Context>
): Promise<Note> => {
  const { prisma, user, ipAddress, requestURL, sentryId } = context
  logMutation('createNote %o', {
    input,
    user,
    ipAddress,
    requestURL
  })

  try {
    const { title, content, notebookId } = input

    if (!user) throw new ApolloError('You must be logged in.', '401')

    // if (!name) throw new ApolloError('invalid input', '422')

    // Checking if client already exists
    const note = await prisma.note.findFirst({
      where: { title, content, userId: user.id, teamId: user.activeTeamId }
    })

    if (note) throw new ApolloError('Note already created')

    // If success, create a new note in our DB.
    const [result, countNotes] = await prisma.$transaction([
      prisma.note.create({
        data: {
          title,
          content,
          notebook: { connect: { id: notebookId! } },
          team: { connect: { id: user.activeTeamId! } },
          user: { connect: { id: user.id } }
        }
      }),

      prisma.note.count({
        where: { userId: user.id, teamId: user.activeTeamId! }
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
      eventName: 'create_new_note',
      userId: user.id,
      data: {
        noteTitle: input.title,
        noteCount: countNotes
      }
    })

    return result
  } catch (e) {
    logError('createNote %o', {
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
