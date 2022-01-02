import { Context } from '@/types'
import { Content } from '@/types/modules'
import { ApolloError } from 'apollo-server-errors'
import importSingleContent from '@/extensions/content-import/single'

interface URLContent {
  url: string
  clientId: string
}
export const ImportContent = async (
  { url, clientId }: URLContent,
  context: Context & Required<Context>
): Promise<Content> => {
  const { prisma, user } = context

  if (!user) throw new ApolloError('You must be logged in.', '401')

  //preparing URL
  if (url.trim().charAt(url.length - 1) === '/') {
    url = url.trim().substring(0, url.length - 1)
  }

  // Checking if content already exists
  const content = await prisma.content.findFirst({
    where: { url, userId: user.id }
  })

  if (content) throw new ApolloError('duplicate content', '401')

  // If success, create a new content in our DB.
  const importedContent = await importSingleContent(url)

  const newContent = await prisma.content.create({
    data: {
      url,
      title: importedContent.title,
      excerpt: importedContent.excerpt,
      tags: importedContent.tags,
      user: { connect: { id: user.id } },
      client: { connect: { id: clientId } }
    }
  })

  if (importedContent.tags) {
    const tags = importedContent.tags.map((name) => ({ name }))
    await prisma.tag.createMany({
      data: tags,
      skipDuplicates: true
    })
  }

  return newContent
}

export default ImportContent
