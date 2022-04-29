import { useErrorParser } from '@/helpers'
import { logError, logMutation } from '@/helpers/logger'
import { Context } from '@/types'
import { Client, MutationCreateClientArgs } from '@/types/modules'
import { ApolloError } from 'apollo-server-core'
import sendToSegment from '@extensions/segment-service/segment'

export default async (
  _parent: unknown,
  { input }: MutationCreateClientArgs,
  context: Context & Required<Context>
): Promise<Client> => {
  const { prisma, user, ipAddress, requestURL, sentryId } = context
  logMutation('createClient %o', {
    input,
    user,
    ipAddress,
    requestURL
  })

  try {
    const { name, website, profile, paymentType, amount } = input

    if (!user) throw new ApolloError('You must be logged in.', '401')

    if (!name) throw new ApolloError('invalid input', '422')

    // Checking if client already exists
    const client = await prisma.client.findFirst({
      where: { name, userId: user.id }
    })

    if (client) throw new Error('duplicated')

    // If success, create a new client in our DB.
    const [result, countClients] = await prisma.$transaction([
      prisma.client.create({
        data: {
          team: { connect: { id: user.activeTeamId! } },
          name,
          website,
          amount: amount ?? 0.0,
          paymentType: paymentType ?? 'ARTICLE',
          profile,
          user: { connect: { id: user.id } }
        }
      }),
      prisma.client.count({
        where: { userId: user.id }
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
      eventName: 'create_new_client',
      userId: user.id,
      data: {
        through: 'created',
        clientId: result.id,
        clientName: name,
        clientWebsite: website,
        clientPaymentType: paymentType ?? 'ARTICLE',
        clientCount: countClients
      }
    })

    return result
  } catch (e) {
    logError('createClient %o', {
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
