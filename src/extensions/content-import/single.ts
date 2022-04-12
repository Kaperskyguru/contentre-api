import { useErrorParser } from '@/helpers'
import { logError } from '@/helpers/logger'
import { Metadata } from '@/types/modules'
import { ApolloError } from 'apollo-server-errors'
import urlMetadata from 'url-metadata'

interface Client {
  website: string
  name: string
  icon?: string
}

const generateTags = (metadata: urlMetadata.Result) => {
  const ogTags = metadata['og:article:tag']?.split(',').map((v) => v.trim())
  const tags = metadata['article:tag']?.split(',').map((v) => v.trim())
  const keywords = metadata['keywords']?.split(',').map((v) => v.trim())
  return [...new Set([...keywords, ...(ogTags || ''), ...(tags || '')])].filter(
    (v) => v
  )
}

const generateName = (metadata: urlMetadata.Result) => {
  const n = metadata['og:site_name']
  if (!n) {
    const sites = metadata.source.split('.')
    if (sites.includes('www')) {
      return sites[1]
    } else {
      return sites[0]
    }
  }
  return n
}

const generateFavicon = (metadata: urlMetadata.Result) => {
  if (metadata.url.startsWith('https')) {
    return `https://${metadata.source}/favicon.ico`
  }
  return `http://${metadata.source}/favicon.ico`
}

const generateURL = (metadata: urlMetadata.Result) => {
  const url = metadata['og:url'] ?? metadata.url
  if (url.trim().charAt(url.length - 1) === '/') {
    return url.trim().substring(0, url.length - 1)
  }
  return url
}

const generateDate = (metadata: urlMetadata.Result) => {
  const date =
    metadata['article:published_time'] ?? metadata['og:article:published_time']
  return new Date(date!).toISOString() ?? undefined
}

export default async (url: string): Promise<Metadata> => {
  try {
    const rawMetadata = await urlMetadata(url)

    const metadata = {
      url: generateURL(rawMetadata),
      title: rawMetadata.title,
      excerpt: rawMetadata.description,
      publishedDate: generateDate(rawMetadata),
      image:
        rawMetadata.image ??
        rawMetadata['og:image'] ??
        rawMetadata['og:image:secure_url'] ??
        undefined,
      tags: generateTags(rawMetadata),
      client: {
        id: '',
        website: rawMetadata.source,
        name: generateName(rawMetadata),
        icon: generateFavicon(rawMetadata),
        updatedAt: new Date(),
        createdAt: new Date()
      }
    }

    return metadata
  } catch (e) {
    logError('importContent %o', e)

    const message = useErrorParser(e)

    if (message === 'duplicated')
      throw new ApolloError(
        'A client with the same name already exists.',
        '409'
      )

    if (e?.Error === 'response code 403')
      throw new ApolloError(
        'The website does not permit this operation. You can still add it manually',
        '403',
        {}
      )

    throw new ApolloError(message, e.code ?? '500', {})
  }
}
