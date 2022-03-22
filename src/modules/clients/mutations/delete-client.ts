import { useErrorParser } from '@helpers'
import { logError, logMutation } from '@helpers/logger'
import { MutationDeleteClientArgs } from '@modules-types'
import { Context } from '@types'
import { ApolloError } from 'apollo-server-errors'
import sendToSegment from '@extensions/segment-service/segment'

export default async (
  _parent: unknown,
  { id }: MutationDeleteClientArgs,
  { user, sentryId, prisma }: Context & Required<Context>
): Promise<boolean> => {
  logMutation('deleteClient %o', user)

  try {
    // User must be logged in before performing the operation.
    if (!user) throw new ApolloError('You must be logged in.', '401')

    // Check for required arguments not provided.
    if (!id) {
      throw new ApolloError('Invalid input', '422')
    }

    const client = await prisma.client.findUnique({
      where: { id }
    })

    if (!client) {
      throw new ApolloError('client not found', '404')
    }

    // Check if the user is authorized to delete the client.
    if (client.userId !== user.id) {
      throw new Error('unauthorized')
    }

    const [result, countClients] = await prisma.$transaction([
      prisma.client.delete({
        where: { id }
      }),

      prisma.category.count({
        where: { id: user.id }
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
      eventName: 'delete_client',
      userId: user.id,
      data: {
        clientId: client.id,
        clientName: client?.name,
        clientWebsite: client?.website,
        clientPaymentType: client?.paymentType,
        clientCount: countClients
      }
    })

    return !!result
  } catch (e) {
    logError('deleteClient %o', e)

    const message = useErrorParser(e)
    throw new ApolloError(message, e.code ?? '500', { sentryId })
  }
}
