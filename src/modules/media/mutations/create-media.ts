import { useErrorParser } from '@/helpers'
import { logError, logMutation } from '@/helpers/logger'
import { Context } from '@/types'
import { Media, MutationCreateMediaArgs } from '@/types/modules'
import { ApolloError } from 'apollo-server-core'
import sendToSegment from '@extensions/segment-service/segment'

export default async (
  _parent: unknown,
  { input }: MutationCreateMediaArgs,
  context: Context & Required<Context>
): Promise<Media> => {
  const { prisma, user, ipAddress, requestURL, sentryId } = context
  logMutation('createMedia %o', {
    input,
    user,
    ipAddress,
    requestURL
  })

  try {
    const { title, url } = input

    if (!user) throw new ApolloError('You must be logged in.', '401')

    // If success, create a new media in our DB
    const [result, countMedia] = await prisma.$transaction([
      prisma.media.create({
        data: {
          title,
          url,
          team: { connect: { id: user.activeTeamId! } }
          //   user: { connect: { id: user.id } }
        }
      }),

      prisma.media.count({
        where: { teamId: user.activeTeamId! }
      })
    ])

    await sendToSegment({
      operation: 'identify',
      userId: user.id,
      data: {
        email: user.email
      }
    })

    await sendToSegment({
      operation: 'track',
      eventName: 'create_new_media',
      userId: user.id,
      data: {
        mediaURL: url,
        mediaCount: countMedia
      }
    })

    return result
  } catch (e) {
    logError('createMedia %o', {
      input,
      user,
      ipAddress,
      requestURL,
      error: e
    })
    const message = useErrorParser(e)

    throw new ApolloError(message, e.code ?? '500', { sentryId })
  }
}
