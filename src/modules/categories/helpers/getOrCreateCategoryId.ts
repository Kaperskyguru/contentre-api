import { logError } from '@helpers/logger'
import { Maybe, Scalars, User } from '@modules-types'
import { PrismaClient } from '@prisma/client'
import sendToSegment from '@extensions/segment-service/segment'

export const getOrCreateCategoryId = async (
  name: Maybe<string> | undefined,
  { user, prisma }: { user: User; prisma: PrismaClient }
): Promise<Scalars['ID'] | null> => {
  try {
    if (!name) return null

    // Let's try to find an already existing.
    const foundCategory = await prisma.category.findFirst({
      where: {
        userId: user.id,
        name: {
          equals: name,
          mode: 'insensitive'
        }
      }
    })

    // If found, just return the id.
    if (foundCategory) return foundCategory.id

    // Otherwise, we need to create the new category.
    const [category, countCategories] = await prisma.$transaction([
      prisma.category.create({
        data: {
          userId: user.id,
          teamId: user.activeTeamId,
          name
        }
      }),
      prisma.category.count({
        where: { userId: user!.id! }
      })
    ])

    await sendToSegment({
      operation: 'track',
      eventName: 'create_new_category',
      userId: user!.id,
      data: {
        userId: user!.id!,
        categoryName: name,
        categoryCount: countCategories
      }
    })

    // Then return the newly created id.
    return category?.id ?? null
  } catch (error) {
    logError('getOrCreateCategoryId', name, error)
    return null
  }
}

export default getOrCreateCategoryId
