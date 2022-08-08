import { useErrorParser } from '@/helpers'
import { logError, logMutation } from '@helpers/logger'
import { MutationUpdateUserArgs, User } from '@modules-types'
import sendEmailCode from '@/modules/auth/mutations/send-email-code'
import { Context } from '@types'
import { ApolloError } from 'apollo-server-errors'
import sendToSegment from '@/extensions/segment-service/segment'
import { getUser } from '@/helpers/getUser'
import { url } from 'inspector'

export default async (
  _parent: unknown,
  { input }: MutationUpdateUserArgs,
  context: Context & Required<Context>
): Promise<User> => {
  const { user, prisma, requestURL, requestOrigin } = context
  logMutation('updateUser %o', user)
  try {
    // User must be logged in before performing the operation.
    if (!user) throw new ApolloError('You must be logged in.', '401')

    // Prepare data for the update, checking and filling each possible field.
    const data: Record<string, unknown> = {}
    let isProfileCompleted = 0
    if (input.avatarURL !== undefined) {
      await prisma.media.create({
        data: {
          team: { connect: { id: user.activeTeamId! } },
          url: input.avatarURL!
        }
      })
      data.avatarURL = input.avatarURL
    }
    if (input.name !== undefined) data.name = input.name
    if (input.jobTitle !== undefined) data.jobTitle = input.jobTitle
    if (input.homeAddress !== undefined) data.homeAddress = input.homeAddress
    if (input.bio !== undefined) data.bio = input.bio
    if (input.portfolio !== undefined) data.portfolio = input.portfolio

    if (input.email !== undefined) {
      data.email = input.email
      // If user changes email, set its verification to false.
      data.emailConfirmed = false
    }

    if (input.phoneNumber !== undefined) {
      data.phoneNumber = input.phoneNumber
      // If user changes phone number, set its verification to false.
      data.phoneConfirmed = false
    }

    // Delete avatar from Google Storage
    // if (data.avatarURL === null) {
    //   await deleteFile(`users/${user.id}`)
    // }

    // Finally update the user.
    let updatedUser = await prisma.user.update({
      where: { id: user.id },
      data,
      include: { activeSubscription: true }
    })

    // Send data to Segment
    const segmentData = data
    if (segmentData.phoneNumber) {
      segmentData.phoneNumber = data.phoneNumber
    }

    await sendToSegment({
      operation: 'identify',
      userId: user.id,
      data: {
        ...segmentData,
        name: updatedUser.name,
        email: user.email
      }
    })
    await sendToSegment({
      operation: 'track',
      eventName: 'user_updated',
      userId: user.id,
      data: {
        ...segmentData,
        name: updatedUser.name,
        email: user.email
      }
    })

    // Update hasCompletedOnboarding
    if (updatedUser.name) isProfileCompleted += 10
    if (updatedUser.bio) isProfileCompleted += 20
    if (updatedUser.avatarURL) isProfileCompleted += 20
    if (updatedUser.phoneNumber) isProfileCompleted += 5
    if (updatedUser.jobTitle) isProfileCompleted += 20
    if (updatedUser.homeAddress) isProfileCompleted += 5

    const contentCount = await prisma.content.count({
      where: { userId: updatedUser.id, notebookId: null }
    })

    if (contentCount > 0) if (updatedUser.homeAddress) isProfileCompleted += 20

    if (isProfileCompleted > 90) {
      updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: {
          hasFinishedOnboarding: true
        },
        include: { activeSubscription: true }
      })

      await sendToSegment({
        operation: 'track',
        eventName: 'has_completed_onboarding',
        userId: user.id,
        data: {
          ...segmentData,
          hasCompletedOnboarding: true,
          name: updatedUser.name,
          email: user.email
        }
      })
    }

    // If the user needs to confirm the email after a change.
    if (!updatedUser.emailConfirmed && updatedUser.email) {
      // Call the mutation to send the email verification code.
      sendEmailCode(
        _parent,
        {
          email: updatedUser.email,
          template: 'email-verification'
        },
        context
      )
    }

    return getUser(updatedUser)
  } catch (e) {
    logError('updateUser %o', e)

    const message = useErrorParser(e)

    throw new ApolloError(e?.code ?? 'generic', '500', {
      handled: !!e,
      originalMessage: e?.message ?? message
    })
  }
}
