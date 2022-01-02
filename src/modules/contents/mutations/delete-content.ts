import { useErrorParser } from '@/helpers'
import { logError, logMutation } from '@/helpers/logger'
import { Context } from '@/types'
import { Content, MutationDeleteContentArgs } from '@/types/modules'
import { ApolloError } from 'apollo-server-core'
import ImportContent from '../helpers/import-content'

export default async (
  _parent: unknown,
  { id }: MutationDeleteContentArgs,
  context: Context & Required<Context>
): Promise<boolean> => {
  const { prisma, user } = context
  logMutation('deleteContent %o', user)
  try {
    // User must be logged in before performing the operation.
    if (!user) throw new ApolloError('You must be logged in.', '401')

    // Check for required arguments not provided.
    if (!id) {
      throw new ApolloError('Invalid input', '422')
    }

    const content = await prisma.content.findUnique({
      where: { id }
    })

    if (!content) {
      throw new ApolloError('content not found', '404')
    }

    // Check if the user is authorized to delete the content.
    if (content.userId !== user.id) {
      throw new Error('unauthorized')
    }

    return !!(await prisma.content.delete({
      where: { id }
    }))
  } catch (e) {
    logError('createContent %o', user)

    const message = useErrorParser(e)

    throw new ApolloError(message, e.code ?? '500', {})
  }
}
