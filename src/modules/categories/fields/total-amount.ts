import { Maybe, Category } from '@modules-types'
import { logResolver } from '@helpers/logger'
import { prisma } from '@/config'

export default async (parent: Category): Promise<Maybe<string>> => {
  logResolver('Category.totalContent')

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
            c."categoryId" = $1
          )
       
      `.clearIndentation(),
    parent.id
  )

  //   const contentCount = await prisma.content.({
  //     where: { categoryId: parent.id }
  //   })

  console.log(amount)

  return amount[0].amount + ''
}
