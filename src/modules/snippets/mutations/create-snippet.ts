import { useErrorParser } from '@/helpers'
import { logError, logMutation } from '@/helpers/logger'
import { Context } from '@/types'
import { MutationCreateSnippetArgs, Snippet } from '@/types/modules'
import { ApolloError } from 'apollo-server-core'
import openAi from '@extensions/openai'
import sendToSegment from '@extensions/segment-service/segment'
import totalSnippets from '../fields/total-snippets'

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

    const totalSnippet = await totalSnippets(user)

    if (!user.isPremium && (totalSnippet ?? 0) >= 1)
      throw new ApolloError('You have exceeded your snippet limit.', '401')

    // Check if Content
    let snippet
    if (!content) {
      // Use AI

      const res = await openAi.createCodeSnippet({
        title
      })

      const { choices }: any = res
      snippet = choices && choices[0]?.text
      if (!snippet) throw new ApolloError('Snippet not created', '500')
    }

    const formatted = generateSnippet(content ?? snippet)

    // If success, create a new snippet in our DB
    const [result, countSnippets] = await prisma.$transaction([
      prisma.content.create({
        data: {
          title,
          content: formatted,
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

function generateSnippet(content: string) {
  return `
        <pre>${content}</pre>`
}
