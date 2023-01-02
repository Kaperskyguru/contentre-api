import { User } from '@/types/modules'
import Medium from '@extensions/medium'
import Hashnode from '@extensions/hashnode'
import { PrismaClient } from '@prisma/client'

export const Plugins = async (
  input: any,
  { user, prisma }: { user: User; prisma: PrismaClient }
): Promise<void> => {
  const { apps } = input

  if (apps?.medium && apps.medium.action === 'Publish') {
    const title = input.title
    const content = input.content ?? input.excerpt
    const tags = input.tags

    const medium = await prisma.connectedApp.findFirst({
      where: { teamId: user.activeTeamId!, name: 'Medium', slug: 'medium' }
    })

    const mediumData = apps.medium

    let formatContent = `
    <h1> ${title!} </h1>
    ${content!}
    `

    if (mediumData.contentFormat === 'markdown')
      formatContent = `
    ${title!}

    ${content!}
    `

    const Post = {
      title: title!,
      content: formatContent,
      contentFormat: mediumData.contentFormat ?? 'html',
      canonicalUrl: mediumData.canonicalUrl ?? undefined,
      notifyFollowers: mediumData.notifyFollowers ?? false,
      tags: tags!,
      publishStatus: mediumData.publishedStatus ?? 'public'
    }

    await new Medium(medium!).create(Post)
  }

  if (apps?.hashnode && apps.hashnode.action === 'Publish') {
    const title = input.title
    const content = input.content ?? input.excerpt
    const tags = input.tags

    const HashNode = await prisma.connectedApp.findFirst({
      where: { teamId: user.activeTeamId!, name: 'Hashnode', slug: 'hashnode' }
    })

    const hashNodeData = apps.hashnode

    let formatContent = `
    ${content!}
    `

    const Post = {
      title: title!,
      content: formatContent,
      canonicalUrl: hashNodeData.canonicalUrl ?? undefined,
      tags: tags!,
      hideFromHashnodeFeed: hashNodeData.hideFromHashnodeFeed
    }

    await new Hashnode(HashNode!).create(Post)
  }
}

export default Plugins
