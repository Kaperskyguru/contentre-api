import { useErrorParser } from '@/helpers'
import { logError, logMutation } from '@/helpers/logger'
import { Context } from '@/types'
import { MutationDeleteBulkCategoryArgs } from '@/types/modules'
import { ApolloError } from 'apollo-server-core'
import sendToSegment from '@/extensions/segment-service/segment'

export default async (
  _parent: unknown,
  { input }: MutationDeleteBulkCategoryArgs,
  context: Context & Required<Context>
): Promise<boolean> => {
  const { prisma, user } = context
  logMutation('deleteBulkCategory %o', { user, ids: input.ids })
  try {
    // User must be logged in before performing the operation.
    if (!user) throw new ApolloError('You must be logged in.', '401')

    // Check for required arguments not provided.
    if (!input.ids) {
      throw new ApolloError('Invalid input', '422')
    }

    const [, deletedCategory] = await prisma.$transaction([
      prisma.content.updateMany({
        where: { categoryId: { in: input.ids } },
        data: {
          categoryId: null
        }
      }),

      // // Delete the transaction.
      prisma.category.deleteMany({
        where: {
          id: {
            in: input.ids
          }
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

    // Send data to segment
    await sendToSegment({
      operation: 'track',
      eventName: 'bulk_category_deleted',
      userId: user.id,
      data: {
        ids: input.ids
      }
    })
    return deletedCategory ? true : false
  } catch (e) {
    logError('createCategory %o', user)

    const message = useErrorParser(e)

    throw new ApolloError(message, e.code ?? '500', {})
  }
}
