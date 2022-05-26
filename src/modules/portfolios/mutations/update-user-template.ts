import add from '@extensions/github/add'
import { useErrorParser } from '@helpers'
import { logError, logMutation } from '@helpers/logger'
import { MutationUpdateUserTemplateArgs, UserTemplate } from '@modules-types'
import { Context } from '@types'
import { ApolloError } from 'apollo-server-errors'

export default async (
  _parent: unknown,
  { id, input }: MutationUpdateUserTemplateArgs,
  { user, sentryId, prisma, ipAddress, requestURL }: Context & Required<Context>
): Promise<UserTemplate> => {
  logMutation('updatePortfolio %o', {
    input,
    user,
    ipAddress,
    requestURL
  })

  try {
    // User must be logged in before performing the operation.
    if (!user) throw new ApolloError('You must be logged in.', '401')

    // Extract fields from the mutation input.
    const { content, css } = input

    // Check for required arguments not provided.
    if (!id) {
      throw new ApolloError('Invalid input', '422')
    }

    const data: Record<string, unknown> = {}
    if (content !== undefined) data.content = content
    if (css !== undefined) data.css = css

    const t = await prisma.userTemplate.update({
      where: { id },
      data
    })

    return t
  } catch (e) {
    logError('updatePortfolio %o', {
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
