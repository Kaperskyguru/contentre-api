import { useErrorParser } from '@helpers'
import { logError, logMutation } from '@helpers/logger'
import { App, MutationUpdateAppArgs } from '@modules-types'
import { Context } from '@types'
import { ApolloError } from 'apollo-server-errors'

export default async (
  _parent: unknown,
  { id, input }: MutationUpdateAppArgs,
  { user, sentryId, prisma, ipAddress, requestURL }: Context & Required<Context>
): Promise<App> => {
  logMutation('updateApp %o', {
    input,
    user,
    ipAddress,
    requestURL
  })

  try {
    // User must be logged in before performing the operation.
    if (!user) throw new ApolloError('You must be logged in.', '401')

    // User must be with an active company set.
    if (!user.activeTeamId) {
      throw new ApolloError('Team not found', '404')
    }

    // Extract fields from the mutation input.
    const { name, token, key, isActivated } = input

    // Check for required arguments not provided.
    if (!id) {
      throw new ApolloError('Invalid input', '422')
    }

    const data: Record<string, unknown> = {}
    if (name !== undefined) data.name = name
    if (token !== undefined) data.token = token
    if (key !== undefined) data.secret = key
    if (isActivated !== undefined) data.isActivated = isActivated

    // Finally update the category.
    return await prisma.category.update({
      where: { id },
      data
    })
  } catch (e) {
    logError('updateApp %o', {
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
