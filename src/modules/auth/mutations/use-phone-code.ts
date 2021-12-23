import { useErrorParser } from '@helpers'
import { getUser } from '@helpers/getUser'
import { logError, logMutation } from '@helpers/logger'
import { MutationUsePhoneCodeArgs, User } from '@modules-types'
import { Context } from '@types'
import { ApolloError } from 'apollo-server-errors'

export default async (
  _parent: unknown,
  input: MutationUsePhoneCodeArgs,
  { user, sentryId, prisma, ipAddress, requestURL }: Context
): Promise<User> => {
  const { code } = input
  logMutation('usePhoneCode %o', {
    input,
    user,
    ipAddress,
    requestURL
  })
  try {
    // User must be logged in before performing the operation.
    if (!user) throw new ApolloError('You must be logged in.', '401')
    if (!ipAddress?.address) throw new ApolloError('Forbidden.', '403')

    // Try to find valid phone verification intents not expired for this user.
    const validIntents = await prisma.$queryRaw`
      SELECT COUNT("id") "count"
      FROM "VerificationIntent"
      WHERE "type" = 'PHONE'
        AND "refreshCode" = ${code}
        AND "expiresAt" > (NOW() AT TIME ZONE 'UTC')
        AND "userId" = ${user.id}
    `.then((data: any) => data[0].count as number)

    if (!validIntents) throw new Error('invalid code')

    // Store the user update operation for running in a transaction.
    const updateUser = prisma.user.update({
      where: { id: user.id },
      data: { phoneConfirmed: true }
    })

    // Store the intents delete operation for running in a transaction.
    const deleteIntents = prisma.verificationIntent.deleteMany({
      where: { userId: user.id, type: 'PHONE' }
    })

    // Run a transaction to ensure operations succeeds together.
    const [updatedUser] = await prisma.$transaction([updateUser, deleteIntents])

    // Get the formatted updated user to return.
    return getUser(updatedUser)
  } catch (e) {
    logError('usePhoneCode %o', {
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
