import { Context } from '@/types'
import { Content } from '@/types/modules'
import { ApolloError } from 'apollo-server-errors'
import importSingleContent from '@/extensions/content-import/single'

interface URLContent {
  url: string
}
interface Metadata {
  title: string
  url: string
  excerpt: string
  tags?: string[]
  client: Client
}

interface Client {
  website: string
  name: string
  icon?: string
}
export const ImportContent = async (
  { url }: URLContent,
  context: Context & Required<Context>
): Promise<Metadata> => {
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
  return await importSingleContent(url)
}

export default ImportContent
