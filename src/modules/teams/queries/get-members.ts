import { useErrorParser } from '@helpers'
import { logError, logQuery } from '@helpers/logger'
import { Member, QueryGetMembersArgs } from '@modules-types'
import { Context } from '@types'
import { ApolloError } from 'apollo-server-errors'

export default async (
  _parent: unknown,
  { contains }: QueryGetMembersArgs,
  { user, sentryId, prisma }: Context & Required<Context>
): Promise<Member[]> => {
  logQuery('getTags %o', user)

  // User must be logged in before performing the operation.
  if (!user) throw new ApolloError('You must be logged in.', '401')

  if (user.activeRole !== 'ADMIN')
    throw new ApolloError('You must be admin.', '401')

  let terms = contains
  let emailTerms: string | null = null

  if (
    contains?.toLocaleUpperCase() === 'MEMBER' ||
    contains?.toLocaleUpperCase() === 'ADMIN'
  ) {
    terms = ''
  }

  if (contains?.includes('@')) {
    emailTerms = contains
  }

  if (contains?.includes(' ')) {
    terms = null
  }

  try {
    const members = await prisma.member.findMany({
      where: {
        AND: [
          terms
            ? {
                teamId: user.activeTeamId!,
                OR: [
                  {
                    user: {
                      OR: [
                        emailTerms
                          ? {
                              email: {
                                contains: emailTerms,
                                mode: 'insensitive'
                              }
                            }
                          : {},
                        {
                          name: {
                            contains: terms,
                            mode: 'insensitive'
                          }
                        }
                      ]
                    }
                  }
                ]
              }
            : {
                teamId: user.activeTeamId!
              }
        ]
      },
      include: { user: true }
    })

    const mappedMembers: Member[] = members.map((member) => ({
      id: member.userId,
      email: member.user.email,
      name: member.user.name || '',
      username: member.user.username || '',
      phoneNumber: member.user.phoneNumber,
      createdAt: member.createdAt,
      updatedAt: member.updatedAt,
      lastActivityAt: member.user.lastActivityAt,
      role: member.role
    }))
    return mappedMembers
  } catch (e) {
    logError('getMembers %o', e)

    const message = useErrorParser(e)
    throw new ApolloError(message, e.code ?? '500', { sentryId })
  }
}
