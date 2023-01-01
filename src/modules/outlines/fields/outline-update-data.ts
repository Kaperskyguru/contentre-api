import { ConvertOutlineInput, Maybe, User } from '@modules-types'
import { logResolver } from '@helpers/logger'
import { prisma } from '@/config'
import { getOrCreateCategoryId } from '@/modules/categories/helpers'

export default async (
  input: ConvertOutlineInput,
  user: User
): Promise<Record<string, unknown>> => {
  logResolver('Outline.outlineUpdateData')

  const data: Record<string, unknown> = {}
  if (input.clientId !== undefined) {
    data.client = { connect: { id: input.clientId } }
  }

  if (input.category !== undefined) {
    const categoryId = await getOrCreateCategoryId(input.category, {
      user,
      prisma
    })

    if (categoryId !== undefined)
      data.category = { connect: { id: categoryId } }
  }

  if (input.featuredImage !== undefined) {
    await prisma.media.create({
      data: { teamId: user.activeTeamId!, url: input.featuredImage! }
    })
    data.featuredImage = input.featuredImage
  }

  if (input.excerpt === undefined) {
    data.excerpt = input.content?.substring(0, 140) ?? ''
  } else {
    data.excerpt = input.excerpt
  }

  if (input.clientId !== undefined)
    data.client = { connect: { id: input.clientId } }

  if (input.content !== undefined) data.content = input.content
  if (input.title !== undefined) data.title = input.title
  if (input.status !== undefined) data.status = input.status
  if (input.url !== undefined) data.url = input.url

  return data
}
