import { Feature, Subscription, User, SubUser } from '@/types/modules'
import jwt from 'jsonwebtoken'
import { environment } from './environment'
import { prisma } from '@/config'

export const getUser = async (user: SubUser | User): Promise<User> => {
  const user1 = await prisma.user.findUnique({
    where: { id: user.id }
  })

  //   Get team here
  const subscription: Subscription[] = await prisma.$queryRawUnsafe(
    `
      SELECT 
        s.* 
      FROM 
        "Subscription" AS "s"
      WHERE 
        "s"."id" = $1 
        LIMIT 1
      `,
    user.subscriptionId
  )

  const features: Feature[] = await prisma.$queryRawUnsafe(
    `
      SELECT 
        f.*
      FROM 
        "Feature" AS "f"
      WHERE 
        "f"."subscriptionId" = $1 
      `,
    user.subscriptionId
  )

  const { ...authUser } = user1
  return {
    ...authUser,
    subscription: {
      ...subscription[0],
      features: features.map((item) => ({
        feature: item.feature,
        value: item.value,
        id: item.id
      }))
    }
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
    return await getUser({ id: user.id, subscriptionId: user.subscriptionId })
  } catch (e) {
    return null
  }
}

export default { getUser, getUserByToken }
