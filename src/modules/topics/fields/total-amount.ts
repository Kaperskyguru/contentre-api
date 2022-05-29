import { Maybe, Topic } from '@modules-types'
import { logResolver } from '@helpers/logger'
import { prisma } from '@/config'

export default async (parent: Topic): Promise<Maybe<number>> => {
  logResolver('Topic.totalContent')

  type Amount = {
    amount: number
  }

  // const amount: Amount[] = await prisma.$queryRawUnsafe(
  //   `
  //       SELECT
  //       SUM(c."amount") "amount"
  //       FROM
  //         "Content" c
  //       WHERE
  //         (
  //           c."topicId" = $1
  //         )

  //     `.clearIndentation(),
  //   parent.id
  // )

  return 0 //amount[0]?.amount ?? 0
}
