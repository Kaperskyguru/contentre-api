import { useErrorParser } from '@/helpers'
import { logError, logMutation } from '@/helpers/logger'
import { Context } from '@/types'
import { MutationCreateSnippetArgs, Snippet } from '@/types/modules'
import { ApolloError } from 'apollo-server-core'
import sendToSegment from '@extensions/segment-service/segment'

export default async (
  _parent: unknown,
  { input }: MutationCreateSnippetArgs,
  context: Context & Required<Context>
): Promise<Snippet> => {
  const { prisma, user, ipAddress, requestURL, sentryId } = context
  logMutation('createSnippet %o', {
    input,
    user,
    ipAddress,
    requestURL
  })

  try {
    const { title, content } = input

    if (!user) throw new ApolloError('You must be logged in.', '401')

    // If success, create a new snippet in our DB
    const [result, countSnippets] = await prisma.$transaction([
      prisma.content.create({
        data: {
          title,
          content,
          status: 'DRAFT',
          class: 'SNIPPET',
          excerpt: '',
          team: { connect: { id: user.activeTeamId! } },
          user: { connect: { id: user.id } }
        }
      }),

      prisma.content.count({
        where: {
          userId: user.id,
          teamId: user.activeTeamId!,
          status: 'DRAFT',
          class: 'SNIPPET'
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

    await sendToSegment({
      operation: 'track',
      eventName: 'create_new_snippet',
      userId: user.id,
      data: {
        snippetTitle: input.title,
        snippetCount: countSnippets
      }
    })

    return result
  } catch (e) {
    logError('createSnippet %o', {
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
