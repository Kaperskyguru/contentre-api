import { useErrorParser } from '@/helpers'
import { environment } from '@/helpers/environment'
import { logError, logMutation } from '@/helpers/logger'
import { Context } from '@types'
import { ApolloError } from 'apollo-server-errors'

export default async (
  _parent: unknown,
  _args: unknown,
  { user, setCookies, sentryId, prisma }: Context & Required<Context>
): Promise<boolean> => {
  logMutation('logoutUser %o', user)

  // User already logged out, just finish the call.
  if (!user) return true

  try {
    // Invalidate the token ensuring the cookie has expired.
    setCookies.push({
      name: 'token',
      options: {
        // domain: 'contentre.io',
        expires: new Date(0),
        httpOnly: true,
        sameSite: ['LOCAL', 'DEVELOP'].includes(environment.context)
          ? 'None'
          : true,
        secure: true
      }
    })

    // Remove phone confirmed when user logs out to ensure 2FA on next login.
    await prisma.user.update({
      where: { id: user.id },
      data: { phoneConfirmed: false }
    })

    return true
  } catch (e) {
    logError('logoutUser %o', e)

    const message = useErrorParser(e)
    throw new ApolloError(message, e.code ?? '500', { sentryId })
  }
}
