import { useErrorParser } from '@helpers'
import { logError, logQuery } from '@helpers/logger'
import { QueryGetPortfoliosArgs, Template } from '@modules-types'
import { Context } from '@types'
import { ApolloError } from 'apollo-server-errors'

export default async (
  _parent: unknown,
  { size, skip, filters }: QueryGetPortfoliosArgs,
  { user, sentryId, prisma }: Context & Required<Context>
): Promise<Template[]> => {
  logQuery('getTemplates %o', user)
  try {
    if (!user) throw new ApolloError('You must be logged in.', '401')

    const templates = await prisma.template.findMany({
      where: { type: 'TEMPLATE' },
      take: size ?? undefined,
      skip: skip ?? 0
    })

    return templates
  } catch (e) {
    logError('getTemplates %o', e)

    const message = useErrorParser(e)
    throw new ApolloError(message, e.code ?? '500', { sentryId })
  }
}
