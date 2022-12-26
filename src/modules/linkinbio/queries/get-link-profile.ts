import { useErrorParser } from '@/helpers'
import { logError, logQuery } from '@helpers/logger'
import {
  Client,
  LinkProfile,
  Portfolio,
  QueryGetLinkProfileArgs,
  Social
} from '@modules-types'
import { Context } from '@types'
import { ApolloError } from 'apollo-server-errors'

export default async (
  _parent: unknown,
  { filters }: QueryGetLinkProfileArgs,
  { sentryId, prisma }: Context & Required<Context>
): Promise<LinkProfile> => {
  logQuery('getLinkInBio %o', filters)
  try {
    const user = await prisma.user.findFirst({
      where: { username: filters?.username },
      include: {
        socials: true,
        clients: {
          where: { NOT: { profile: null } }
        },
        portfolios: true
      }
    })

    if (!user) throw new ApolloError('User not found', '404')

    const link = {
      name: user.name,
      avatar: user.avatarURL,
      jobTitle: user.jobTitle,
      bio: user.bio,
      socials: user.socials.map((social: Social) => {
        return {
          name: social.name,
          link: social.link,
          icon: social.icon
        }
      }),
      clients: user.clients.map((client: Client) => {
        return {
          name: client.name,
          website: client.website,
          profile: client?.profile!,
          icon: client?.icon
        }
      }),
      portfolios: user.portfolios.map((portfolio: Portfolio) => {
        return {
          title:
            portfolio.title === 'Default' ? 'My Portfolio' : portfolio.title,
          url: portfolio.url
        }
      })
    }
    return link
  } catch (e) {
    logError('getLinkInBio %o', e)

    const message = useErrorParser(e)
    throw new ApolloError(message, e.code ?? '500', { sentryId })
  }
}
