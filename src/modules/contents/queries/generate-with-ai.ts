import { useErrorParser } from '@/helpers'
import { logError, logMutation } from '@/helpers/logger'
import { Context } from '@/types'
import { AiResponse, MutationCreateOutlineArgs } from '@/types/modules'
import { ApolloError } from 'apollo-server-core'
import sendToSegment from '@extensions/segment-service/segment'
import openAi from '@extensions/openai'
// import totalOutlines from '../fields/total-outlines'

export default async (
  _parent: unknown,
  { input }: MutationCreateOutlineArgs,
  context: Context & Required<Context>
): Promise<AiResponse> => {
  const { prisma, user, ipAddress, requestURL, sentryId } = context
  logMutation('GenerateWithAI %o', {
    input,
    user,
    ipAddress,
    requestURL
  })

  try {
    const { title } = input

    if (!user) throw new ApolloError('You must be logged in.', '401')

    if (!user.isPremium && title)
      throw new ApolloError('Generate idea is a premium', '401')

    // Use AI
    const res = await openAi.create({
      title
    })

    const { choices }: any = res
    const content = choices && choices[0]?.text
    if (!content) throw new ApolloError('Generate with AI not created', '500')

    const formattedContent = content

    await sendToSegment({
      operation: 'identify',
      userId: user.id,
      data: {
        email: user.email
      }
    })

    await sendToSegment({
      operation: 'track',
      eventName: 'generate_with_AI',
      userId: user.id,
      data: {
        title: input.title,
        content: formattedContent
      }
    })

    return {
      title,
      content
    }
  } catch (e) {
    logError('GenerateWithAI %o', {
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

function generateOutline(content: string) {
  return `
        <h2 class="outline-header">Outline</h2>
        <ul id="outline">${content
          .replaceAll('\n\n', '<li>')
          .replaceAll('\n', '<p>')
          .replaceAll('\n<p>[a-zA-Z].', '<ul><li>')}</ul>`
}
