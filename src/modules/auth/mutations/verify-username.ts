import { useErrorParser } from '@helpers'
import { logError, logMutation } from '@helpers/logger'
import { MutationVerifyUsernameArgs, User } from '@modules-types'
import { User as DBUser } from '@prisma/client'
import { Context } from '@types'
import { ApolloError } from 'apollo-server-errors'

export default async (
  _parent: unknown,
  { username }: MutationVerifyUsernameArgs,
  context: Context & Required<Context>
): Promise<boolean> => {
  const { sentryId, prisma, ipAddress, requestURL } = context
  logMutation('verifyUsername %o', { username, ipAddress, requestURL })

  // Will be filled by the user creation process below.
  let user: DBUser | null = null

  try {
    // Checking if user already exists, but did not verify email
    user = await prisma.user.findFirst({ where: { username } })

    if (user) throw new ApolloError('Username exist', '412')

    // If success, create a new user in our DB.
    return true
  } catch (e) {
    logError('verifyUsername %o', { username, ipAddress, requestURL, error: e })

    const message = useErrorParser(e)

    if (
      message.includes('Username exist') ||
      message === 'Request failed with status code 409'
    )
      throw new ApolloError(
        'That username address is already registered.',
        '400'
      )

    throw new ApolloError(message, e.code ?? '500', { sentryId })
  }
}
