import { useErrorParser } from '@helpers'
import { logError, logMutation } from '@helpers/logger'
import { Client, MutationUpdateClientArgs } from '@modules-types'
import { Context } from '@types'
import { ApolloError } from 'apollo-server-errors'

export default async (
  _parent: unknown,
  { id, input }: MutationUpdateClientArgs,
  { user, sentryId, prisma }: Context & Required<Context>
): Promise<Client> => {
  logMutation('updateClient %o', user)

  try {
    // User must be logged in before performing the operation.
    if (!user) throw new ApolloError('You must be logged in.', '401')

    // Extract fields from the mutation input.
    const { name, website } = input

    // Check for required arguments not provided.
    if (!id || !name) {
      throw new ApolloError('Invalid input', '422')
    }

    // Finally update the category.
    return await prisma.client.update({
      where: { id },
      data: {
        name,
        website
      }
    })
  } catch (e) {
    logError('updateClient %o', e)

    const message = useErrorParser(e)

    if (message === 'duplicated')
      throw new ApolloError(
        'A client with the same name already exists.',
        '409'
      )

    throw new ApolloError(message, e.code ?? '500', { sentryId })
  }
}
