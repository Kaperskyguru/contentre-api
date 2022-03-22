import { useErrorParser } from '@helpers'
import { logError, logMutation } from '@helpers/logger'
import { Category, MutationUpdateCategoryArgs } from '@modules-types'
import { Context } from '@types'
import { ApolloError } from 'apollo-server-errors'

export default async (
  _parent: unknown,
  { id, input }: MutationUpdateCategoryArgs,
  { user, sentryId, prisma, ipAddress, requestURL }: Context & Required<Context>
): Promise<Category> => {
  logMutation('updateCategory %o', {
    input,
    user,
    ipAddress,
    requestURL
  })

  try {
    // User must be logged in before performing the operation.
    if (!user) throw new ApolloError('You must be logged in.', '401')

    // User must be with an active company set.
    // if (!user.activeCompanyId) {
    //   throw new AuthorizationError(Errors.ACTIVE_COMPANY)
    // }

    // Extract fields from the mutation input.
    const { name, color } = input

    // Check for required arguments not provided.
    if (!id || !name) {
      throw new ApolloError('Invalid input', '422')
    }

    // Do not create duplicated categories.
    const foundCategory = !!(await prisma.category.findFirst({
      where: {
        userId: user.id,
        name: {
          equals: name,
          mode: 'insensitive'
        },
        id: {
          not: {
            equals: id
          }
        }
      }
    }))

    if (foundCategory) throw new ApolloError('Duplicate Category')

    // Finally update the category.
    return await prisma.category.update({
      where: { id },
      data: {
        name,
        color
      }
    })
  } catch (e) {
    logError('updateCategory %o', {
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
