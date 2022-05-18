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
    const Post = {
      title: mediumData?.title!,
      content: mediumData?.content!,
      contentFormat: mediumData.contentFormat ?? 'HTML',
      canonicalUrl: mediumData.canonicalUrl ?? undefined,
      notifyFollowers: mediumData.notifyFollowers ?? false,
      tags: mediumData.tags!,
      publishStatus: mediumData.publishedStatus ?? 'PUBLIC'
    }

    await new Medium(medium!).create(Post)
  }
}

export default Plugins
