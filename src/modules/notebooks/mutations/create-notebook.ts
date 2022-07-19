import { useErrorParser } from '@/helpers'
import { logError, logMutation } from '@/helpers/logger'
import { Context } from '@/types'
import { MutationCreateNotebookArgs, Notebook } from '@/types/modules'
import { ApolloError } from 'apollo-server-core'
import sendToSegment from '@extensions/segment-service/segment'

export default async (
  _parent: unknown,
  { input }: MutationCreateNotebookArgs,
  context: Context & Required<Context>
): Promise<Notebook> => {
  const { prisma, user, ipAddress, requestURL, sentryId } = context
  logMutation('createNotebook %o', {
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
    const notebook = await prisma.notebook.findFirst({
      where: { name, userId: user.id, teamId: user.activeTeamId }
    })

    if (notebook) throw new ApolloError('Notebook already created')

    // If success, create a new notebook in our DB.
    const [result, countNotebooks] = await prisma.$transaction([
      prisma.notebook.create({
        data: {
          name,
          team: { connect: { id: user.activeTeamId! } },
          user: { connect: { id: user.id } }
        }
      }),

      prisma.notebook.count({
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
      eventName: 'create_new_notebook',
      userId: user.id,
      data: {
        notebookName: input.name,
        notebookCount: countNotebooks
      }
    })

    return result
  } catch (e) {
    logError('createNotebook %o', {
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
