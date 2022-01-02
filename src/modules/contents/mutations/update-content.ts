import { useErrorParser } from '@helpers'
import { logError, logMutation } from '@helpers/logger'
import { Content, MutationUpdateContentArgs } from '@modules-types'
import { Context } from '@types'
import { ApolloError } from 'apollo-server-errors'

interface UpdateData {
  title?: string
  clientId?: string
}

export default async (
  _parent: unknown,
  { id, input }: MutationUpdateContentArgs,
  { user, sentryId, prisma }: Context & Required<Context>
): Promise<Content> => {
  logMutation('updateContent %o', user)

  try {
    // User must be logged in before performing the operation.
    if (!user) throw new ApolloError('You must be logged in.', '401')

    // Extract fields from the mutation input.
    const { title, clientId } = input

    // Check for required arguments not provided.
    if (!id) {
      throw new ApolloError('Invalid input', '422')
    }

    const data: UpdateData = {}
    if (title) {
      data.title = title
    }

    if (clientId) {
      data.clientId = clientId
    }

    const content = await prisma.content.findUnique({
      where: { id }
    })

    if (!content) {
      throw new ApolloError('content not found', '404')
    }

    // Check if the transaction to delete is not from the current company.
    if (content.userId !== user.id) {
      throw new Error('unauthorized')
    }

    // Finally update the category.
    return await prisma.content.update({
      where: { id },
      data: data
    })
  } catch (e) {
    logError('updateContent %o', e)

    const message = useErrorParser(e)

    if (message === 'duplicated')
      throw new ApolloError(
        'A content with the same name already exists.',
        '409'
      )

    throw new ApolloError(message, e.code ?? '500', { sentryId })
  }
}
