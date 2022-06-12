import { Context } from '@/types'
import { Content, Metadata } from '@/types/modules'
import { ApolloError } from 'apollo-server-errors'
import importSingleContent from '@/extensions/content-import/single'

interface URLContent {
  url: string
}
export const ImportContent = async (
  { url }: URLContent,
  context: Context & Required<Context>
): Promise<Metadata> => {
  const { prisma, user } = context

  if (!user) throw new ApolloError('You must be logged in.', '401')

  let trimmedURL = url.trim().replace(/\/+$/g, '')

  // Checking if content already exists
  const content = await prisma.content.findFirst({
    where: { url: trimmedURL, userId: user.id }
  })

  if (content) throw new ApolloError('duplicate content', '401')

  // If success, create a new content in our DB.
  return await importSingleContent(trimmedURL)
}

export default ImportContent
