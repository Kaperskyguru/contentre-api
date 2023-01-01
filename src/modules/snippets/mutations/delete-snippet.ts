import { useErrorParser } from '@helpers'
import { logError, logMutation } from '@helpers/logger'
import { MutationDeleteSnippetArgs } from '@modules-types'
import { Context } from '@types'
import { ApolloError } from 'apollo-server-errors'
import sendToSegment from '@extensions/segment-service/segment'

export default async (
  _parent: unknown,
  { id }: MutationDeleteSnippetArgs,
  { user, sentryId, prisma }: Context & Required<Context>
): Promise<boolean> => {
  logMutation('deleteSnippet %o', user)

  try {
    // User must be logged in before performing the operation.
    if (!user) throw new ApolloError('You must be logged in.', '401')

    // Check for required arguments not provided.
    if (!id) {
      throw new ApolloError('Invalid input', '422')
    }

    const snippet = await prisma.content.findUnique({
      where: { id }
    })

    if (!snippet) {
      throw new ApolloError('Snippet not found', '404')
    }

    // Check if the user is authorized to delete the snippet.
    if (snippet.userId !== user.id) {
      throw new Error('unauthorized')
    }

    const [result, countSnippets] = await prisma.$transaction([
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
      eventName: 'delete_snippet',
      userId: user.id,
      data: {
        snippetId: snippet.id,
        snippetTitle: snippet?.title,
        snippetCount: countSnippets
      }
    })

    return !!result
  } catch (e) {
    logError('deleteSnippet %o', e)

    const message = useErrorParser(e)
    throw new ApolloError(message, e.code ?? '500', { sentryId })
  }
}
