import { useErrorParser } from '@/helpers'
import { environment } from '@/helpers/environment'
import { getUser } from '@/helpers/getUser'
import { logError, logMutation } from '@/helpers/logger'
import { comparePassword } from '@/helpers/passwords'
import { MutationLoginUserArgs, User } from '@/types/modules'
import { Context } from '@types'
import { ApolloError } from 'apollo-server-errors'
import jwt from 'jsonwebtoken'
import sendEmailCode from './send-email-code'
import sendPhoneCode from './send-phone-code'

export default async (
  _parent: unknown,
  { data }: MutationLoginUserArgs,
  context: Context & Required<Context>
): Promise<User> => {
  const { setCookies, sentryId, prisma, ipAddress, requestURL } = context
  const { email, password, remember } = data

  logMutation('loginUser %o', { input: data, ipAddress, requestURL })

  try {
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) throw new Error('authentication failed')

    if (password) {
      const passwordMatch = await comparePassword({
        password,
        hashed: user.password!
      })

      if (!passwordMatch) throw new Error('authentication failed')
    }

    const token = jwt.sign(
      { userEmail: user.email, userId: user.id },
      environment.auth.tokenSecret,
      { expiresIn: '30 days' }
    )

    console.log(token)

    const thirtyDays = 30 * 24 * 60 * 60 * 1000
    setCookies.push({
      name: 'token',
      value: token,
      options: {
        // domain: 'contentre.io',
        expires: remember ? new Date(Date.now() + thirtyDays) : undefined,
        httpOnly: true,
        sameSite: ['LOCAL', 'DEVELOP'].includes(environment.context)
          ? 'None'
          : true,
        secure: true
      }
    })

    await prisma.$executeRaw`UPDATE "User" SET "lastActivityAt" = CURRENT_TIMESTAMP WHERE "email" = ${email}`

    const updatedUser = await prisma.user.findUnique({
      where: { email }
    })
    if (!updatedUser) throw new Error('authentication failed')

    // If the user still needs to confirm the phone after authentication.
    if (
      updatedUser.twofactor === 'SMS' &&
      updatedUser.phoneCode &&
      updatedUser.phoneNumber
    ) {
      // Call the mutation to send the phone verification code.
      sendPhoneCode(
        _parent,
        {
          phoneCode: updatedUser.phoneCode,
          phoneNumber: updatedUser.phoneNumber
        },
        { ...context, user: updatedUser }
      )

      await prisma.user.update({
        where: { id: updatedUser.id },
        data: { phoneConfirmed: false }
      })
    }

    if (updatedUser.twofactor === 'EMAIL' && updatedUser.email) {
      // Call the mutation to send the email verification code.
      sendEmailCode(
        _parent,
        {
          email: updatedUser.email
        },
        { ...context, user: updatedUser }
      )
      await prisma.user.update({
        where: { id: updatedUser.id },
        data: { emailConfirmed: false }
      })
    }

    //   await clearLoginAttempts(email, context)

    return getUser(updatedUser)
  } catch (error) {
    logError('loginUser %o', { input: data, ipAddress, requestURL, error })

    const message = useErrorParser(error)

    if (message === 'user already registered with Google account')
      throw new ApolloError(
        'Already registered with Google account. Please try again by clicking in the "Sign in with Google" button',
        '400'
      )

    if (message === 'authentication failed')
      throw new ApolloError(
        'Incorrect email address or password. Please try again, or reset your password.',
        '400'
      )

    if (message === 'login attempt exceeded') {
      throw new ApolloError(
        `Authentication failed. Please try again in some minutes`,
        '400'
      )
    }
    throw new ApolloError(error.message, error.code ?? '500', { sentryId })
  }
}
