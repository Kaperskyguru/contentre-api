import { hashPassword } from '@/helpers/passwords'
import sendEmailCode from '@/modules/auth/mutations/send-email.code'
import { useErrorParser } from '@helpers'
import { getUser } from '@helpers/getUser'
import { logError, logMutation } from '@helpers/logger'
import { setJWT } from '@helpers/setJWT'
import { MutationCreateUserArgs, User } from '@modules-types'
import { User as DBUser } from '@prisma/client'
import { Context } from '@types'
import { ApolloError } from 'apollo-server-errors'

export default async (
  _parent: unknown,
  { input }: MutationCreateUserArgs,
  context: Context & Required<Context>
): Promise<User> => {
  const { setCookies, sentryId, prisma, ipAddress, requestURL } = context
  logMutation('createUser %o', { input, ipAddress, requestURL })

  // Will be filled by the user creation process below.
  let user: DBUser | null = null

  try {
    // Checking if user already exists, but did not finish the onboarding process
    user = await prisma.user.findUnique({ where: { email: input.email } })
    if (user) {
      setJWT(user, setCookies)
      return user
    }
    user = null

    // If success, create a new user in our DB.
    user = await prisma.user.create({
      data: {
        email: input.email,
        username: input.username,
        name: input.name,
        password: await hashPassword(input.password)
      }
    })

    setJWT(user, setCookies)

    if (!user.emailConfirmed) {
      sendEmailCode(_parent, { email: input.email }, context)
    }

    return getUser(user)
  } catch (e) {
    logError('createUser %o', { input, ipAddress, requestURL, error: e })

    // If an error occurred and our DB user was already created, delete it.
    if (user) {
      await prisma.user.delete({
        where: { email: user.email }
      })
    }

    const message = useErrorParser(e)

    if (
      message.includes('Unique constraint failed') ||
      message === 'Request failed with status code 409'
    )
      throw new ApolloError('That email address is already registered.', '400')

    throw new ApolloError(message, e.code ?? '500', { sentryId })
  }
}