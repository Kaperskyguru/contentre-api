import { logHelper } from '@/helpers/logger'
import { ApolloError } from 'apollo-server-errors'
import { environment } from '@/helpers/environment'
import axios from 'axios'
import { Format, AppStatus, App, Integration } from '@/types/modules'
// import { ConnectedApp } from '@prisma/client'

interface Post {
  title: string
  content: string
  contentFormat: Format
  canonicalUrl?: string
  notifyFollowers?: boolean
  tags?: Array<string>
  publishStatus: AppStatus
  featuredImage?: string
  excerpt?: string
  organizationId?: string | number
  series?: string
}

class Devto {
  axios: any
  app: Integration
  constructor(devto: App) {
    this.app = devto?.app!
    this.axios = axios.create({
      baseURL: environment.devto.BASE_URL,
      headers: {
        'api-key': `${devto.token}`, //
        'Content-Type': 'application/json',
        Accept: 'application/vnd.forem.api-v1+json',
        'Accept-Charset': 'utf-8'
      }
    })
  }

  async all(per_page: number = 30, page: number = 1) {
    try {
      const { data } = await this.axios.get(
        `/articles/me?page=${page}&per_page=${per_page}`
      )
      return data.map((item: any) => {
        return {
          title: item.title,
          url: item.url,
          excerpt: item.description,
          tags: item.tag_list,
          featuredImage: item.cover_image,
          client: {
            name: this.app.name,
            website: this.app.website,
            icon: this.app.icon
          }
        }
      })
    } catch (e) {
      throw new ApolloError(e)
    }
  }

  async get(ID: number) {
    try {
      const { data } = await this.axios.get(`/articles/${ID}`)
      return {
        title: data.title,
        url: data.url,
        excerpt: data.description,
        tags: data.tag_list,
        featuredImage: data.cover_image,
        client: {
          name: this.app.name,
          website: this.app.website,
          icon: this.app.icon
        }
      }
    } catch (e) {
      throw new ApolloError(e)
    }
  }

  async getBySlug(username: string, slug: string) {
    try {
      const { data } = await this.axios.get(`/articles/${username}/${slug}`)
      return data.map((item: any) => {
        return {
          title: item.title,
          url: item.url,
          excerpt: item.description,
          tags: item.tag_list,
          featuredImage: item.cover_image,
          client: {
            name: this.app.name,
            website: this.app.website,
            icon: this.app.icon
          }
        }
      })
    } catch (e) {
      throw new ApolloError(e)
    }
  }

  async getPublished(per_page: number = 30, page: number = 1) {
    try {
      const { data } = await this.axios.get(
        `/articles/me/published?page=${page}&per_page=${per_page}`
      )

      return data.map((item: any) => {
        return {
          title: item.title,
          url: item.url,
          excerpt: item.description,
          tags: item.tag_list,
          featuredImage: item.cover_image,
          client: {
            name: this.app.name,
            website: this.app.website,
            icon: this.app.icon
          }
        }
      })
    } catch (e) {
      throw new ApolloError(e)
    }
  }

  async getDrafts(per_page: number = 30, page: number = 1) {
    try {
      const { data } = await this.axios.get(
        `/articles/me/unpublished?page=${page}&per_page=${per_page}`
      )
      return data.map((item: any) => {
        return {
          title: item.title,
          url: item.url,
          excerpt: item.description,
          tags: item.tag_list,
          featuredImage: item.cover_image,
          client: {
            name: this.app.name,
            website: this.app.website,
            icon: this.app.icon
          }
        }
      })
    } catch (e) {
      throw new ApolloError(e)
    }
  }

  async create(post: Post) {
    try {
      const article = JSON.stringify({
        article: {
          title: post.title,
          published: post.publishStatus === 'public' ? true : false,
          body_markdown: post.content,
          tags: post.tags,
          main_image: post.featuredImage,
          canonical_url: post.canonicalUrl,
          description: post.excerpt,
          series: post.series,
          organization_id: post.organizationId
        }
      })
      const { data } = await this.axios.post(`/articles`, article)
      return {
        title: data.title,
        url: data.url,
        excerpt: data.description,
        tags: data.tag_list,
        featuredImage: data.cover_image,
        client: {
          name: this.app.name,
          website: this.app.website,
          icon: this.app.icon
        }
      }
    } catch (e) {
      throw new ApolloError(e)
    }
  }
}

export default Devto
