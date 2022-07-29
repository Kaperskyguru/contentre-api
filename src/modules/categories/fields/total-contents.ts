import { Maybe, Category } from '@modules-types'
import { logResolver } from '@helpers/logger'
import { prisma } from '@/config'

export default async (parent: Category): Promise<Maybe<string>> => {
  logResolver('Category.totalContent')

  const contentCount = await prisma.content.count({
    where: { categoryId: parent.id, userId: parent.userId!, notebookId: null }
  })

  return contentCount + ''
}
