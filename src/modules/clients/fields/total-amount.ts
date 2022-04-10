import { Maybe, Client } from '@modules-types'
import { logResolver } from '@helpers/logger'
import { prisma } from '@/config'

export default async (parent: Client): Promise<Maybe<number>> => {
  logResolver('Client.totalContent')

  type Amount = {
    amount: number
  }

  const amount: Amount[] = await prisma.$queryRawUnsafe(
    `
        SELECT
        SUM(c."amount") "amount"
        FROM
          "Content" c
        WHERE
          (
            c."clientId" = $1
          )
       
      `.clearIndentation(),
    parent.id
  )

  return amount[0].amount
}
