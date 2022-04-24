import { useErrorParser } from '@helpers'
import { logError, logQuery } from '@helpers/logger'
import { QueryGetSocialsArgs, SocialResponse } from '@modules-types'
import { Context } from '@types'
import { ApolloError } from 'apollo-server-errors'

export default async (
  _parent: unknown,
  { size, skip }: QueryGetSocialsArgs,
  { user, sentryId, prisma }: Context & Required<Context>
): Promise<SocialResponse> => {
  logQuery('getSocials %o', user)

  // User must be logged in before performing the operation.
  if (!user) throw new ApolloError('You must be logged in.', '401')

  try {
    const socialWithTotal = await prisma.social.count({
      where: { userId: user.id },
      select: { id: true }
    })

    return {
      socials: await prisma.social.findMany({
        where: { userId: user.id },
        take: size ?? 30,
        skip: skip ?? 0
      }),

      meta: {
        total: socialWithTotal.id ?? 0
      }
    }
  } catch (e) {
    logError('getSocials %o', e)

    const message = useErrorParser(e)
    throw new ApolloError(message, e.code ?? '500', { sentryId })
  }
}
