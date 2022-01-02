import { useErrorParser } from '@/helpers'
import { logError } from '@/helpers/logger'
import { ApolloError } from 'apollo-server-errors'
import urlMetadata from 'url-metadata'
interface Metadata {
  title: string
  url: string
  excerpt: string
  tags?: string[]
}

const generateTags = (metadata: urlMetadata.Result) => {
  const ogTags = metadata['og:article:tag']?.split(',').map((v) => v.trim())
  const tags = metadata['article:tag']?.split(',').map((v) => v.trim())
  const keywords = metadata['keywords']?.split(',').map((v) => v.trim())
  return [...new Set([...keywords, ...(ogTags || ''), ...(tags || '')])].filter(
    (v) => v
  )
}
export default async (url: string): Promise<Metadata> => {
  try {
    const rawMetadata = await urlMetadata(url)

    const metadata = {
      url: rawMetadata['og:url'] ?? rawMetadata.url,
      title: rawMetadata.title,
      excerpt: rawMetadata.description,
      tags: generateTags(rawMetadata)
    }

    return metadata
  } catch (e) {
    logError('updateClient %o', e)

    const message = useErrorParser(e)

    if (message === 'duplicated')
      throw new ApolloError(
        'A client with the same name already exists.',
        '409'
      )

    throw new ApolloError(message, e.code ?? '500', {})
  }
}
