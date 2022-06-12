import { Apps, Maybe, User } from '@/types/modules'
import Medium from '@extensions/medium'
import { PrismaClient } from '@prisma/client'

export const Plugins = async (
  apps: Maybe<Apps>,
  { user, prisma }: { user: User; prisma: PrismaClient }
): Promise<void> => {
  if (apps?.medium) {
    const medium = await prisma.connectedApp.findFirst({
      where: { teamId: user.activeTeamId!, name: 'Medium', slug: 'medium' }
    })

    const mediumData = apps.medium

    let formatContent = `
    <h1> ${mediumData?.title!} </h1>
    ${mediumData?.content!}
    `

    if (mediumData.contentFormat === 'markdown')
      formatContent = `
    ${mediumData?.title!}

    ${mediumData?.content!}
    `

    const Post = {
      title: mediumData?.title!,
      content: formatContent,
      contentFormat: mediumData.contentFormat ?? 'html',
      canonicalUrl: mediumData.canonicalUrl ?? undefined,
      notifyFollowers: mediumData.notifyFollowers ?? false,
      tags: mediumData.tags!,
      publishStatus: mediumData.publishedStatus ?? 'public'
    }

    await new Medium(medium!).create(Post)
  }
}

export default Plugins
