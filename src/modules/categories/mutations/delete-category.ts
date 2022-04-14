import { useErrorParser } from '@/helpers'
import { logError, logMutation } from '@/helpers/logger'
import { Context } from '@/types'
import { MutationDeleteCategoryArgs } from '@/types/modules'
import { ApolloError } from 'apollo-server-core'
import sendToSegment from '@/extensions/segment-service/segment'

export default async (
  _parent: unknown,
  { id }: MutationDeleteCategoryArgs,
  context: Context & Required<Context>
): Promise<boolean> => {
  const { prisma, user } = context
  logMutation('deleteCategory %o', user)
  try {
    // User must be logged in before performing the operation.
    if (!user) throw new ApolloError('You must be logged in.', '401')

    // Check for required arguments not provided.
    if (!id) {
      throw new ApolloError('Invalid input', '422')
    }

    const category = await prisma.category.findUnique({
      where: { id }
    })

    if (!category) {
      throw new ApolloError('category not found', '404')
    }

    // Check if the user is authorized to delete the category.
    if (category.userId !== user.id) {
      throw new Error('unauthorized')
    }

    const deleted = !!(await prisma.category.delete({
      where: { id }
    }))

    // Send data to segment
    await sendToSegment({
      operation: 'track',
      eventName: 'category_deleted',
      userId: user.id,
      data: {
        userEmail: user.email
      }
    })
    return deleted
  } catch (e) {
    logError('deleteCategory %o', user)

    const message = useErrorParser(e)

    throw new ApolloError(message, e.code ?? '500', {})
  }
}
