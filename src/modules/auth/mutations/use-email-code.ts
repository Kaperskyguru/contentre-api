import { VerificationIntent } from '.prisma/client'
import { useErrorParser } from '@/helpers'
import { getUser } from '@/helpers/getUser'
import { logError, logMutation } from '@/helpers/logger'
import setJWT from '@/helpers/setJWT'
import { Context } from '@/types'
import { MutationUseEmailCodeArgs, User } from '@/types/modules'
import { ApolloError } from 'apollo-server-core'

export default async (
  _parent: unknown,
  input: MutationUseEmailCodeArgs,
  { setCookies, user, sentryId, prisma, ipAddress, requestURL }: Context
): Promise<User> => {
  const { code } = input
  logMutation('useEmailCode %o', {
    input,
    user,
    ipAddress,
    requestURL
  })

  try {
    // User must be logged or a refresh code should be present.
    if (!user && !code) throw new ApolloError('You must be logged in.', '401')
    if (!ipAddress?.address) throw new ApolloError('Forbidden.', '403')

    // Try to find valid email verification intents not expired with this code.
    const validIntents = await prisma.$queryRaw<VerificationIntent[]>`
  SELECT *
  FROM "VerificationIntent"
  WHERE "type" = 'EMAIL'
    AND "refreshCode" = ${code}
    AND "expiresAt" > (NOW() AT TIME ZONE 'UTC')
`

    if (!validIntents.length) throw new Error('invalid code')

    // Check if all intents are for the same user.
    const userIds = [...new Set(validIntents.map((intent) => intent.userId))]
    if (userIds.length > 1) throw new Error('invalid code')

    // Check if the code was not for the logged in user.
    const userId = userIds[0]
    if (user && user.id !== userId) {
      throw new Error('invalid code')
    }

    // Store the user update operation for running in a transaction.
    const updateUser = prisma.user.update({
      where: { id: userId },
      data: { emailConfirmed: true },
      include: { subscription: true }
    })

    // Store the intents delete operation for running in a transaction.
    const deleteIntents = prisma.verificationIntent.deleteMany({
      where: { userId, type: 'EMAIL' }
    })

    // Run a transaction to ensure operations succeeds together.
    const [updatedUser] = await prisma.$transaction([updateUser, deleteIntents])

    // Authenticate the user since the identity was already proven.
    setJWT(updatedUser, setCookies!)
    // Get the formatted updated user to return.
    return getUser(updatedUser)
  } catch (e) {
    logError('useEmailCode %o', {
      input,
      user,
      ipAddress,
      requestURL,
      error: e
    })

    const message = useErrorParser(e)

    if (message === 'invalid code')
      throw new ApolloError('Invalid confirmation code.', '404')

    throw new ApolloError(message, e.code ?? '500', { sentryId })
  }
}
