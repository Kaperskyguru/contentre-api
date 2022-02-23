import { useErrorParser } from '@/helpers'
import { logError, logMutation } from '@/helpers/logger'
import { Context } from '@/types'
import { Category, MutationCreateCategoryArgs } from '@/types/modules'
import { ApolloError } from 'apollo-server-core'

export default async (
  _parent: unknown,
  { input }: MutationCreateCategoryArgs,
  context: Context & Required<Context>
): Promise<Category> => {
  const { prisma, user, ipAddress, requestURL, sentryId } = context
  logMutation('createCategory %o', {
    input,
    user,
    ipAddress,
    requestURL
  })

  try {
    const { name, color } = input

    if (!user) throw new ApolloError('You must be logged in.', '401')

    if (!name) throw new ApolloError('invalid input', '422')

    // Checking if client already exists
    const category = await prisma.category.findFirst({
      where: { name, userId: user.id }
    })

    if (category) throw new ApolloError('Category already created')

    // If success, create a new client in our DB.
    return await prisma.category.create({
      data: {
        name,
        color,
        user: { connect: { id: user.id } }
      }
    })
  } catch (e) {
    logError('createCategory %o', {
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
