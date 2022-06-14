import { Feature, Subscription, User, SubUser } from '@/types/modules'
import jwt from 'jsonwebtoken'
import { environment } from './environment'
import { prisma } from '@/config'
import { TeamAndRole } from '@/types'

export const getUser = async (user: User): Promise<User> => {
  //   Get team here
  const teams: TeamAndRole[] = await prisma.$queryRaw`
  SELECT
    "m"."role" "role",
    "team"."id" = ${user.activeTeamId ?? ''} "activeTeam",
    "team"."id" "id",
    "team"."name" "name",
    "team"."avatarURL" "avatarURL",
    "team"."createdAt" "createdAt",
    "team"."updatedAt" "updatedAt"
  FROM
    "Member" AS "m"
    JOIN "Team" AS "team" ON "team"."id" = "m"."teamId"
  WHERE
    "m"."userId" = ${user.id}
  ORDER BY
    "team"."createdAt" DESC
`

  const activeSubscription: Subscription[] = await prisma.$queryRawUnsafe(
    `
      SELECT 
        s.* 
      FROM 
        "Subscription" AS "s"
      WHERE 
        "s"."id" = $1 
        LIMIT 1
      `,
    user.activeSubscriptionId // Change to activeSubscriptionId
  )

  const features: Feature[] = await prisma.$queryRawUnsafe(
    `
      SELECT 
        f.*
      FROM 
        "Feature" AS "f"
      WHERE 
        "f"."planId" = $1 
      `,
    activeSubscription[0].planId
  )

  const activeTeam = teams.find((team) => team.activeTeam)
  const { ...authUser } = user
  // const userData = await prisma.user.findFirst({ where: { id: authUser.id } })

  return {
    ...authUser,
    activeTeam: activeTeam
      ? {
          createdAt: activeTeam.createdAt,
          id: activeTeam.id,
          name: activeTeam.name,
          updatedAt: activeTeam.updatedAt,
          avatarURL: activeTeam.avatarURL
        }
      : null,
    activeRole: activeTeam?.role ?? null,
    activeSubscription: {
      ...activeSubscription[0],
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
    return await getUser(user)
  } catch (e) {
    return null
  }
}

export default { getUser, getUserByToken }
