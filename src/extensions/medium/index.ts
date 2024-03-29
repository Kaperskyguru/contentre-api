import { logHelper } from '@/helpers/logger'
import { ApolloError } from 'apollo-server-errors'
import { environment } from '@/helpers/environment'
import axios from 'axios'
import { Format, AppStatus } from '@/types/modules'
import { ConnectedApp } from '@prisma/client'

interface Post {
  title: string
  content: string
  contentFormat: string
  canonicalUrl?: string
  notifyFollowers?: boolean
  tags?: Array<string>
  publishStatus: AppStatus
  featuredImage?: string
  excerpt?: string
}

interface MediumUser {
  id: string
  username: string
  imageUrl: string
}

class Medium {
  axios: any
  constructor(medium: ConnectedApp) {
    this.axios = axios.create({
      baseURL: environment.medium.BASE_URL ?? 'https://api.medium.com/v1',
      headers: {
        Authorization: `Bearer ${medium.token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Accept-Charset': 'utf-8'
      }
    })
  }

  async publish(input: any) {
    const { apps } = input

    const title = input.title
    const content = input.content ?? input.excerpt
    const tags = input.tags

    const mediumData = apps.medium

    let formatContent = `
    <h1> ${title!} </h1>
    ${content!}
    `

    const Post = {
      title: title!,
      content: formatContent,
      contentFormat: 'html',
      canonicalUrl: !mediumData.canonicalUrl
        ? input.canonicalUrl
        : mediumData.canonicalUrl,
      notifyFollowers: mediumData.notifyFollowers ?? false,
      tags: tags!,
      publishStatus: mediumData.publishedStatus ?? 'public'
    }

    return await this.create(Post)
  }

  async create(data: Post | null) {
    // Get User
    const userInfo = await this.user()
    if (!userInfo) {
      throw new ApolloError('User not found', '404')
    }

    try {
      const res = await this.axios.post(`/users/${userInfo.id}/posts`, data)

      const { data: post } = res.data

      return {
        title: post.title,
        url: post.canonicalUrl ?? post.url,
        tags: post.tags,
        status: post.publishStatus,
        client: {
          name: 'Medium',
          website: 'https://medium.com'
        }
      }
    } catch (e) {
      throw new ApolloError(e)
    }
  }

  async user(): Promise<MediumUser> {
    if (!this.axios) {
      throw new ApolloError('')
    }
    const res = await this.axios.get('/me')
    return res.data.data
  }

  async getPosts(): Promise<Post[]> {
    if (!this.axios) {
      throw new ApolloError('')
    }

    try {
      const userInfo = await this.user()

      if (!userInfo) {
        throw new ApolloError('User not found', '404')
      }

      const res = await axios.get(
        `https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@${userInfo.username}`
      )

      if (!res.data?.items) {
        throw new ApolloError('Content not found', '404')
      }

      return res.data.items.map((item: any) => {
        return {
          title: item.title,
          url: item.link,
          excerpt: item.content?.substring(0, 140) ?? '',
          tags: item.categories,
          publishedDate: !item.pubDate
            ? new Date().toISOString()
            : new Date(item.pubDate).toISOString(),
          featuredImage: item.thumbnail,
          client: {
            name: 'Medium',
            website: 'https://medium.com'
          }
        }
      })
    } catch (error) {
      throw new ApolloError(error)
    }
  }

  async getPublicationPosts(
    publicationId: string
  ): Promise<MediumUser | boolean> {
    if (!this.axios) {
      throw new ApolloError('')
    }

    const userInfo = await this.user()
    if (!userInfo) {
      throw new ApolloError('User not found', '404')
    }

    const res = await this.axios.get(`/publications/${publicationId}/posts`)
    return res.data.data
  }

  async getPublications(): Promise<MediumUser | boolean> {
    if (!this.axios) {
      throw new ApolloError('')
    }

    const userInfo = await this.user()
    if (!userInfo) {
      throw new ApolloError('User not found', '404')
    }

    const res = await this.axios.get(`/users/${userInfo.id}/publications`)
    return res.data.data
  }
}

export default Medium
