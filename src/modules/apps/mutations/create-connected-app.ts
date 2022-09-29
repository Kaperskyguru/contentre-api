import { useErrorParser } from '@/helpers'
import { logError, logMutation } from '@/helpers/logger'
import { Context } from '@/types'
import { App, MutationCreateConnectedAppArgs } from '@/types/modules'
import { ApolloError } from 'apollo-server-core'

export default async (
  _parent: unknown,
  { input }: MutationCreateConnectedAppArgs,
  context: Context & Required<Context>
): Promise<App> => {
  const { prisma, user, ipAddress, requestURL, sentryId } = context
  logMutation('createApp %o', {
    input,
    user,
    ipAddress,
    requestURL
  })

  try {
    const { name, token, key } = input

    if (!user) throw new ApolloError('You must be logged in.', '401')

    // Checking if app already exists
    const social = await prisma.connectedApp.findFirst({
      where: { name: name!, teamId: user.activeTeamId! }
    })

    if (social) throw new ApolloError('App already created')

    // Create Slug
    const slug = name!
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')

    // If success, create a new app in our DB.

    const integration = await prisma.app.findUnique({
      where: { name: name! }
    })

    return await prisma.connectedApp.create({
      data: {
        name: name!,
        token,
        slug,
        app: { connect: { id: integration?.id! } },
        secret: key,
        isActivated: false,
        team: { connect: { id: user.activeTeamId! } }
      }
    })
  } catch (e) {
    logError('createApp %o', {
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
