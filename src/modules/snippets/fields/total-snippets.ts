import { Maybe, User } from '@modules-types'
import { logResolver } from '@helpers/logger'
import { prisma } from '@/config'

export default async (parent: User): Promise<Maybe<number>> => {
  logResolver('Snippet.totalSnippet')

  const snippetCount = await prisma.content.count({
    where: { userId: parent.id, class: 'SNIPPET' }
  })

  return snippetCount
}
