import { Apps, ConvertContentInput, Maybe, User } from '@/types/modules'
import Medium from '@extensions/medium'
import { PrismaClient } from '@prisma/client'

export const Plugins = async (
  input: ConvertContentInput,
  { user, prisma }: { user: User; prisma: PrismaClient }
): Promise<void> => {
  const { apps } = input

  if (apps?.medium) {
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
}

export default Plugins
