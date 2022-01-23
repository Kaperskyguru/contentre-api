import { hashPassword } from '@/helpers/passwords'
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
  const { setCookies, sentryId, prisma, ipAddress, requestURL, requestOrigin } =
    context
  logMutation('createUser %o', { input, ipAddress, requestURL, requestOrigin })

  // Will be filled by the user creation process below.
  let user: DBUser | null = null

  try {
    // Checking if user already exists, but did not verify email
    user = await prisma.user.findUnique({ where: { email: input.email } })

    if (user && !user.emailConfirmed) {
      setJWT(user, setCookies)
      throw new ApolloError('verify email')
    }
    user = null

    // If success, create a new user in our DB.
    user = await prisma.user.create({
      data: {
        email: input.email,
        username: input.username,
        name: input.name,
        portfolio: `${requestOrigin}/${input.username}`,
        password: await hashPassword(input.password)
      }
    })

    setJWT(user, setCookies)

    return getUser(user)
  } catch (e) {
    logError('createUser %o', {
      input,
      ipAddress,
      requestURL,
      requestOrigin,
      error: e
    })

    const message = useErrorParser(e)

    if (
      message.includes('Unique constraint failed') ||
      message === 'Request failed with status code 409'
    )
      throw new ApolloError('That email address is already registered.', '400')

    if (message.includes('verify email'))
      throw new ApolloError(
        'Please check your inbox to verify your email',
        '400'
      )

    throw new ApolloError(message, e.code ?? '500', { sentryId })
  }
}
