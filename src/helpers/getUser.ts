import { User } from '@/types/modules'
import jwt from 'jsonwebtoken'
import { environment } from './environment'
import { prisma } from '@/config'

export const getUser = async (user: User): Promise<User> => {
  //   Get team here
  //   const users = await prisma.$queryRaw(
  //     'SELECT * FROM User WHERE id = $1 ORDER BY createdAt DESC',
  //     user.id
  //   )
  const { ...authUser } = user
  return {
    ...authUser
  }
}

interface IToken {
  userEmail: string
  userId: string
}

export const getUserByToken = async (token: string): Promise<User | null> => {
  try {
    await jwt.verify(token, environment.auth.tokenSecret, (err, user) => {
      if (err) return null
      return user
    })

    const decodedToken = jwt.decode(token)
    if (!decodedToken) return null

    const user = await prisma.user.findUnique({
      where: { id: (decodedToken as IToken).userId }
    })

    if (!user) return null
    return getUser(user)
  } catch (e) {
    return null
  }
}

export default { getUser, getUserByToken }
