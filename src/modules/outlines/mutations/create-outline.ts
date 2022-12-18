import { useErrorParser } from '@/helpers'
import { logError, logMutation } from '@/helpers/logger'
import { Context } from '@/types'
import { MutationCreateOutlineArgs, Outline } from '@/types/modules'
import { ApolloError } from 'apollo-server-core'
import sendToSegment from '@extensions/segment-service/segment'

export default async (
  _parent: unknown,
  { input }: MutationCreateOutlineArgs,
  context: Context & Required<Context>
): Promise<Outline> => {
  const { prisma, user, ipAddress, requestURL, sentryId } = context
  logMutation('createOutline %o', {
    input,
    user,
    ipAddress,
    requestURL
  })

  try {
    const { title, content } = input

    if (!user) throw new ApolloError('You must be logged in.', '401')

    // If success, create a new outline in our DB
    const [result, countOutlines] = await prisma.$transaction([
      prisma.content.create({
        data: {
          title,
          content,
          status: 'DRAFT',
          class: 'OUTLINE',
          excerpt: '',
          team: { connect: { id: user.activeTeamId! } },
          user: { connect: { id: user.id } }
        }
      }),

      prisma.content.count({
        where: {
          userId: user.id,
          teamId: user.activeTeamId!,
          status: 'DRAFT',
          class: 'OUTLINE'
        }
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
      eventName: 'create_new_outline',
      userId: user.id,
      data: {
        outlineTitle: input.title,
        outlineCount: countOutlines
      }
    })

    return result
  } catch (e) {
    logError('createOutline %o', {
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
