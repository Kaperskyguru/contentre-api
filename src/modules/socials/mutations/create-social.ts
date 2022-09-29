import { useErrorParser } from '@/helpers'
import { logError, logMutation } from '@/helpers/logger'
import { Context } from '@/types'
import { MutationCreateSocialArgs, Social } from '@/types/modules'
import { ApolloError } from 'apollo-server-core'

export default async (
  _parent: unknown,
  { input }: MutationCreateSocialArgs,
  context: Context & Required<Context>
): Promise<Social> => {
  const { prisma, user, ipAddress, requestURL, sentryId } = context
  logMutation('createSocial %o', {
    input,
    user,
    ipAddress,
    requestURL
  })

  try {
    const { name, link, icon } = input

    if (!user) throw new ApolloError('You must be logged in.', '401')

    if (!name && !link) throw new ApolloError('invalid input', '422')

    // Checking if social already exists
    const social = await prisma.social.findFirst({
      where: { name, userId: user.id }
    })

    if (social) throw new ApolloError('Social already created')

    // If success, create a new social in our DB.

    return prisma.social.create({
      data: {
        name,
        link,
        icon,
        user: { connect: { id: user.id } },
        team: { connect: { id: user.activeTeamId! } }
      }
    })
  } catch (e) {
    logError('createSocial %o', {
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
