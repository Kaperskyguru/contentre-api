import { hashPassword } from '@/helpers/passwords'
import sendEmailCode from '@/modules/auth/mutations/send-email.code'
import { useErrorParser } from '@helpers'
import { getUser, getUserByToken } from '@helpers/getUser'
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
    // Checking if user already exists, but did not verify email
    user = await prisma.user.findUnique({ where: { email: input.email } })
    let token: string

    if (user && !user.emailConfirmed) {
      token = setJWT(user, setCookies)
      context.user = token ? await getUserByToken(token) : null
      sendEmailCode(_parent, { email: input.email }, context)
      throw new ApolloError('verify email')
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

    token = setJWT(user, setCookies)
    context.user = token ? await getUserByToken(token) : null
    sendEmailCode(_parent, { email: input.email }, context)

    return getUser(user)
  } catch (e) {
    logError('createUser %o', { input, ipAddress, requestURL, error: e })

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
