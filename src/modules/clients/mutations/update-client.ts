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
    const { name, website, profileId } = input

    // Check for required arguments not provided.
    if (!id || !name) {
      throw new ApolloError('Invalid input', '422')
    }

    const client = await prisma.client.findUnique({
      where: { id }
    })

    if (!client) throw new ApolloError('client not found', '404')

    // Check if the transaction to delete is not from the current company.
    if (client.userId !== user.id) {
      throw new Error('unauthorized')
    }

    const data: Record<string, unknown> = {}
    if (name !== undefined) data.name = name
    if (website !== undefined) data.website = website
    if (profileId !== undefined) data.profileId = profileId

    // Finally update the category.
    return await prisma.client.update({
      where: { id },
      data
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
