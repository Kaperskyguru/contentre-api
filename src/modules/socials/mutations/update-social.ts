import { environment } from '@/helpers/environment'
import { useErrorParser } from '@helpers'
import { logError, logMutation } from '@helpers/logger'
import { Social, MutationUpdateSocialArgs } from '@modules-types'
import { Context } from '@types'
import { ApolloError } from 'apollo-server-errors'

export default async (
  _parent: unknown,
  { id, input }: MutationUpdateSocialArgs,
  { user, sentryId, prisma, ipAddress, requestURL }: Context & Required<Context>
): Promise<Social> => {
  logMutation('updateSocial %o', {
    input,
    user,
    ipAddress,
    requestURL
  })

  try {
    // User must be logged in before performing the operation.
    if (!user) throw new ApolloError('You must be logged in.', '401')

    // Extract fields from the mutation input.
    const { link } = input

    // Check for required arguments not provided.
    if (!id) {
      throw new ApolloError('Invalid input', '422')
    }

    const social = await prisma.social.findUnique({
      where: { id }
    })

    if (!social) {
      throw new ApolloError('Social not found', '404')
    }

    // Prepare data for the update, checking and filling each possible field.
    const data: Record<string, unknown> = {}

    if (link !== undefined) data.link = link

    // Finally update the Social.
    return await prisma.social.update({
      where: { id },
      data
    })
  } catch (e) {
    logError('updateSocial %o', {
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
