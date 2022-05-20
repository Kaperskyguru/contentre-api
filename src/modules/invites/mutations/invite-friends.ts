import { useErrorParser } from '@/helpers'
import { logError, logMutation } from '@/helpers/logger'
import { MutationInviteFriendsArgs, User } from '@/types/modules'
import { Context } from '@types'
import { ApolloError } from 'apollo-server-errors'
import sendToSegment from '@/extensions/segment-service/segment'
import sendEmail from '@extensions/mail-service/send-email'

export default async (
  _parent: unknown,
  { data }: MutationInviteFriendsArgs,
  context: Context & Required<Context>
): Promise<boolean> => {
  const { sentryId, ipAddress, requestURL, user } = context
  const { emails } = data

  logMutation('inviteFriends %o', { input: data, ipAddress, requestURL })

  try {
    if (!user) throw new ApolloError('You must be logged in.', '401')

    // Send mail

    const sendMails = emails.map(async (email) => {
      await sendEmail({
        to: email,
        template: 'invite-friends',
        variables: {
          email: email,
          to_name: user.name,
          username: user.username
        }
      })
    })

    await Promise.all(sendMails)
    // Send data to Segment
    await sendToSegment({
      operation: 'identify',
      userId: user.id,
      data: {
        email: user.email,
        lastActivityAt: user.lastActivityAt
      }
    })
    await sendToSegment({
      operation: 'track',
      eventName: 'inviteFriends',
      userId: user.id,
      data: {
        teamId: user.activeTeamId,
        emails: emails
      }
    })
    return true
  } catch (error) {
    logError('inviteFriends %o', { input: data, ipAddress, requestURL, error })

    const message = useErrorParser(error)

    throw new ApolloError(error.message, error.code ?? '500', { sentryId })
  }
}
