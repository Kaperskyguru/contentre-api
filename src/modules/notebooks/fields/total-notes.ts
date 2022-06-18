import { Maybe, Notebook } from '@modules-types'
import { logResolver } from '@helpers/logger'
import { prisma } from '@/config'

export default async (parent: Notebook): Promise<Maybe<number>> => {
  logResolver('Notebook.totalNotes')

  const noteCount = await prisma.note.count({
    where: {
      userId: parent?.userId! ?? undefined,
      teamId: parent?.teamId! ?? undefined
    }
  })

  return noteCount ?? 0
}
