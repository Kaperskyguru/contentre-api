import { getOrCreateCategoryId } from '@/modules/categories/helpers'
import { useErrorParser } from '@helpers'
import { logError, logMutation } from '@helpers/logger'
import { Content, MutationUpdateContentArgs } from '@modules-types'
import { Context } from '@types'
import { ApolloError } from 'apollo-server-errors'
import sendToSegment from '@extensions/segment-service/segment'
import Plugins from '@/helpers/plugins'

interface UpdateData {
  title?: string
  clientId?: string
}

export default async (
  _parent: unknown,
  { id, input }: MutationUpdateContentArgs,
  { user, sentryId, prisma }: Context & Required<Context>
): Promise<Content> => {
  logMutation('updateContent %o', user)

  try {
    // User must be logged in before performing the operation.
    if (!user) throw new ApolloError('You must be logged in.', '401')

    // Check for required arguments not provided.
    if (!id) {
      throw new ApolloError('Invalid input', '422')
    }

    const data: Record<string, unknown> = {}

    if (input.comments !== undefined) data.comments = input.comments
    if (input.title !== undefined) data.title = input.title
    if (input.visibility !== undefined) data.visibility = input.visibility
    if (input.likes !== undefined) data.likes = input.likes
    if (input.featuredImage !== undefined) {
      await prisma.media.create({
        data: {
          team: { connect: { id: user.activeTeamId! } },
          url: input.featuredImage!
        }
      })
      data.featuredImage = input.featuredImage
    }
    if (input.tags !== undefined) data.tags = input.tags
    if (input.url !== undefined) data.url = input.url
    if (input.excerpt !== undefined) data.excerpt = input.excerpt
    if (input.content !== undefined) data.content = input.content
    if (input.shares !== undefined) data.shares = input.shares
    if (input.paymentType !== undefined) data.paymentType = input.paymentType
    if (input.category !== undefined)
      data.categoryId = await getOrCreateCategoryId(input.category, {
        user,
        prisma
      })
    if (input.clientId !== undefined)
      data.client = { connect: { id: input.clientId } }

    if (input.visibility !== undefined) data.visibility = input.visibility
    if (input.status !== undefined) data.status = input.status
    if (input.amount !== undefined) data.amount = input.amount

    const content = await prisma.content.findUnique({
      where: { id }
    })

    if (!content) {
      throw new ApolloError('content not found', '404')
    }

    // Check if the transaction to delete is not from the current company.
    if (content.userId !== user.id) {
      throw new Error('unauthorized')
    }

    // Finally update the category.
    const updatedContent = await prisma.content.update({
      where: { id },
      data,
      include: { category: true, client: true }
    })

    if (input.tags?.length) {
      const tagNames = Object.values(input.tags).map((name: any) => ({
        name,
        userId: user.id,
        // teamId: user.activeTeamId! ?? undefined,
        team: { connect: { id: user.activeTeamId! } }
      }))

      await prisma.tag.createMany({
        data: tagNames
      })

      await sendToSegment({
        operation: 'track',
        eventName: 'bulk_create_new_tag',
        userId: user.id,
        data: {
          userEmail: user.email,
          tags: input.tags
        }
      })
    }

    // Share to App
    if (input.apps !== undefined) {
      if (input.apps?.medium) {
        input.apps.medium.title = updatedContent.title
        input.apps.medium.content =
          updatedContent?.content ?? updatedContent.excerpt
        input.apps.medium.tags = input.tags
      }

      await Plugins(input.apps, { user, prisma })
    }

    return updatedContent
  } catch (e) {
    logError('updateContent %o', e)

    const message = useErrorParser(e)

    if (message === 'duplicated')
      throw new ApolloError(
        'A content with the same name already exists.',
        '409'
      )

    throw new ApolloError(message, e.code ?? '500', { sentryId })
  }
}
