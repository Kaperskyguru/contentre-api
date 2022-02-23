import { logError } from '@helpers/logger'
import { Maybe, Scalars, User } from '@modules-types'
import { PrismaClient } from '@prisma/client'

export const getOrCreateCategoryId = async (
  name: Maybe<string> | undefined,
  { user, prisma }: { user: User; prisma: PrismaClient }
): Promise<Scalars['ID'] | null> => {
  try {
    if (!name) return null

    // Let's try to find an already existing.
    const foundCategory = await prisma.category.findFirst({
      where: {
        name: {
          equals: name,
          mode: 'insensitive'
        }
      }
    })

    // If found, just return the id.
    if (foundCategory) return foundCategory.id

    // Otherwise, we need to create the new category.
    const category = await prisma.category.create({
      data: {
        name
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
