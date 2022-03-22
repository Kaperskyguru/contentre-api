import { getUser } from '@helpers/getUser'
import { logError, logQuery } from '@helpers/logger'
import { User } from '@modules-types'
import { Context } from '@types'
import sendToSegment from '@extensions/segment-service/segment'

export default async (
  _parent: unknown,
  _args: unknown,
  { user, prisma }: Context & Required<Context>
): Promise<User | null> => {
  logQuery('getCurrentUser %o', user)

  if (user) {
    try {
      const now = new Date()
      await sendToSegment({
        operation: 'identify',
        userId: user.id,
        data: {
          lastActivityAt: now,
          email: user.email
        }
      })
      await sendToSegment({
        operation: 'track',
        eventName: 'last_activity_at',
        userId: user.id,
        data: {
          lastActivityAt: now,
          email: user.email
        }
      })
      return getUser(user)
    } catch (err) {
      const userData = await prisma.user.findFirst({ where: { id: user.id } })
      await sendToSegment({
        operation: 'track',
        eventName: 'user_error',
        userId: user.id,
        data: {
          email: userData?.email,
          name: userData?.name,
          // phoneCode: userData?.phoneCode,
          telephone: userData?.phoneNumber,
          errorCode: err.code,
          errorMessage: err.message
        }
      })
      logError('getCurrentUser %o', err)
    }
  }

  return user
}
