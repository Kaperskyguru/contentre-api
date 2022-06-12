import { useErrorParser } from '@/helpers'
import { getUser } from '@/helpers/getUser'
import { logError, logMutation } from '@/helpers/logger'
import setJWT from '@/helpers/setJWT'
import { Context } from '@/types'
import { MutationUsePasswordResetCodeArgs } from '@/types/modules'
import { ApolloError } from 'apollo-server-core'

export default async (
  _parent: unknown,
  input: MutationUsePasswordResetCodeArgs,
  {
    setCookies,
    user,
    sentryId,
    prisma,
    ipAddress,
    requestURL
  }: Context & Required<Context>
) => {
  const { code, email } = input
  logMutation('usePasswordResetCode %o', {
    input,
    user,
    ipAddress,
    requestURL
  })

  try {
    // User must be logged or a refresh code should be present.
    if (!user && !code) throw new ApolloError('You must be logged in.', '401')
    if (!ipAddress?.address) throw new ApolloError('Forbidden.', '403')

    // Try to find the user based on the received email.
    const targetUser = await prisma.user.findUnique({ where: { email } })
    if (!targetUser) throw new Error('invalid code')

    // Check if the code was not for the logged in user.
    const userId = targetUser.id
    if (user && user.id !== userId) {
      throw new Error('invalid code')
    }

    // Try to find valid phone verification intents not expired for this user.
    const validIntents = await prisma.$queryRaw`
      SELECT COUNT("id") "count"
      FROM "VerificationIntent"
      WHERE "type" = 'EMAIL'
        AND "refreshCode" = ${code}
        AND "expiresAt" > (NOW() AT TIME ZONE 'UTC')
        AND "userId" = ${userId}
    `.then((data: any) => data[0].count as number)

    if (!validIntents) throw new Error('invalid code')

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
    logError('usePasswordResetCode %o', {
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
