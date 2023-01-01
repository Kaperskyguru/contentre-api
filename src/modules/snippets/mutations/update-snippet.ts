import { environment } from '@/helpers/environment'
import { useErrorParser } from '@helpers'
import { logError, logMutation } from '@helpers/logger'
import { Snippet, MutationUpdateSnippetArgs } from '@modules-types'
import { Context } from '@types'
import { ApolloError } from 'apollo-server-errors'

export default async (
  _parent: unknown,
  { id, input }: MutationUpdateSnippetArgs,
  { user, sentryId, prisma, ipAddress, requestURL }: Context & Required<Context>
): Promise<Snippet> => {
  logMutation('updateSnippet %o', {
    input,
    user,
    ipAddress,
    requestURL
  })

  try {
    // User must be logged in before performing the operation.
    if (!user) throw new ApolloError('You must be logged in.', '401')

    // Extract fields from the mutation input.
    const { title, content, shareable, status } = input

    // Check for required arguments not provided.
    if (!id) {
      throw new ApolloError('Invalid input', '422')
    }

    const snippet = await prisma.content.findUnique({
      where: { id }
    })

    if (!snippet) {
      throw new ApolloError('content not found', '404')
    }

    // Prepare data for the update, checking and filling each possible field.
    const data: Record<string, unknown> = {}

    if (title !== undefined) data.title = title
    if (content !== undefined) data.content = content
    if (status !== undefined) data.status = status
    if (shareable !== undefined) {
      data.shareable = input.shareable
      if (!snippet.shareLink) {
        // Generate link
        const link = `${environment.domain}/content/${String(
          Math.floor(100000 + Math.random() * 900000)
        )}`
        data.shareLink = link
      }
    }

    // Finally update the snippet.
    return await prisma.content.update({
      where: { id },
      data
    })
  } catch (e) {
    logError('updateSnippet %o', {
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
