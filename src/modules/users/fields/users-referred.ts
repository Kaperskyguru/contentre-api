import { Maybe, User } from '@modules-types'
// import { readFileURL } from '@extensions/storage'
import { logResolver } from '@helpers/logger'
import { prisma } from '@/config'

export default async (parent: User): Promise<Maybe<string>> => {
  logResolver('User.avatarURL')

  const usersCount = await prisma.user.count({
    where: { referrerId: parent.id }
  })

  return usersCount + ''
}
