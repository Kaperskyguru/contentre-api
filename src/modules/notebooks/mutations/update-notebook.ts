import { environment } from '@/helpers/environment'
import { useErrorParser } from '@helpers'
import { logError, logMutation } from '@helpers/logger'
import { Notebook, MutationUpdateNotebookArgs } from '@modules-types'
import { Context } from '@types'
import { ApolloError } from 'apollo-server-errors'

export default async (
  _parent: unknown,
  { id, input }: MutationUpdateNotebookArgs,
  { user, sentryId, prisma, ipAddress, requestURL }: Context & Required<Context>
): Promise<Notebook> => {
  logMutation('updateNotebook %o', {
    input,
    user,
    ipAddress,
    requestURL
  })

  try {
    // User must be logged in before performing the operation.
    if (!user) throw new ApolloError('You must be logged in.', '401')

    // Extract fields from the mutation input.
    const { name, shareable } = input

    // Check for required arguments not provided.
    if (!id) {
      throw new ApolloError('Invalid input', '422')
    }

    // Do not create duplicated categories.
    const foundNotebook = await prisma.notebook.findFirst({
      where: {
        id: id
      }
    })

    if (!foundNotebook) throw new ApolloError('No Notebook found')

    const data: Record<string, unknown> = {}
    if (name !== undefined) data.name = name

    if (shareable !== undefined) {
      data.shareable = shareable
      if (!foundNotebook.link) {
        // Generate link
        const link = `${environment.domain}/views/${String(
          Math.floor(100000 + Math.random() * 900000)
        )}`
        data.link = link
      }
    }

    // Finally update the Notebook.
    return await prisma.notebook.update({
      where: { id },
      data,
      select: {
        name: true,
        link: true,
        createdAt: true,
        updatedAt: true,
        id: true
      }
    })
  } catch (e) {
    logError('updateNotebook %o', {
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
