import { Maybe, Client } from '@modules-types'
import { logResolver } from '@helpers/logger'
import { prisma } from '@/config'

export default async (parent: Client): Promise<Maybe<string>> => {
  logResolver('Client.totalContent')

  const contentCount = await prisma.content.count({
    where: { clientId: parent.id, notebookId: null }
  })

  return contentCount + ''
}
