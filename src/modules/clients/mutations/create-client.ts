import { useErrorParser } from '@/helpers'
import { logError, logMutation } from '@/helpers/logger'
import { Context } from '@/types'
import { Client, MutationCreateClientArgs } from '@/types/modules'
import { Profile } from '@prisma/client'
import { ApolloError } from 'apollo-server-core'

export default async (
  _parent: unknown,
  { input }: MutationCreateClientArgs,
  context: Context & Required<Context>
): Promise<Client> => {
  const { prisma, user, ipAddress, requestURL, sentryId } = context
  logMutation('createClient %o', {
    input,
    user,
    ipAddress,
    requestURL
  })

  try {
    const { name, website, profile } = input

    if (!user) throw new ApolloError('You must be logged in.', '401')

    if (!name) throw new ApolloError('invalid input', '422')

    // Checking if client already exists
    const client = await prisma.client.findFirst({
      where: { name, userId: user.id }
    })

    if (client) throw new Error('duplicated')

    // Create Profile link
    let newProfile: Profile | undefined

    if (profile?.profileLink !== undefined) {
      newProfile = await prisma.profile.create({
        data: {
          name,
          link: profile.profileLink,
          avatar: profile.profileAvatar ?? undefined
        }
      })
    }

    // If success, create a new client in our DB.
    return await prisma.client.create({
      data: {
        name,
        website,
        profile: { connect: { id: newProfile?.id } },
        user: { connect: { id: user.id } }
      }
    })
  } catch (e) {
    logError('createClient %o', {
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
