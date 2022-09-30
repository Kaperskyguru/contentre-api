import { useErrorParser } from '@/helpers'
import { logError, logQuery } from '@helpers/logger'
import { Social, QueryGetSocialByNameArgs } from '@modules-types'
import { Context } from '@types'
import { ApolloError } from 'apollo-server-errors'

export default async (
  _parent: unknown,
  { name }: QueryGetSocialByNameArgs,
  { user, sentryId, prisma }: Context & Required<Context>
): Promise<Social> => {
  logQuery('getSocialByName %o', user)
  try {
    // User must be logged in before performing the operation.
    if (!user) throw new ApolloError('You must be logged in.', '401')

    // Grab the desired row by its compound primary key.
    const social = await prisma.social.findFirst({
      where: { name, userId: user.id }
    })

    if (!social) throw new ApolloError('Social not found')
    return social
  } catch (e) {
    logError('getSocialByName %o', e)

    const message = useErrorParser(e)
    throw new ApolloError(message, e.code ?? '500', { sentryId })
  }
}
