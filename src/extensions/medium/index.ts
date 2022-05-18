import { logHelper } from '@/helpers/logger'
import { ApolloError } from 'apollo-server-errors'
import { environment } from '@/helpers/environment'
import axios from 'axios'
import { Format, AppStatus } from '@/types/modules'
import { ConnectedApp } from '@prisma/client'

interface Post {
  title: string
  content: string
  contentFormat: Format
  canonicalUrl?: string
  notifyFollowers?: boolean
  tags?: Array<string>
  publishStatus: AppStatus
}

interface MediumUser {
  id: string
  username: string
  imageUrl: string
}

// 2d70de98a4a6c0318f6c049945d120890f460fe93de781e095afc5192e692ba64
class Medium {
  axios: any
  constructor(medium: ConnectedApp) {
    this.axios = axios.create({
      baseURL: environment.medium.BASE_URL ?? 'https://api.medium.com',
      headers: {
        Authorization: `Bearer ${medium.token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Accept-Charset': 'utf-8'
      }
    })
  }

  async create(data: Post | null): Promise<Post | undefined> {
    if (environment.context !== 'PRODUCTION') return

    // Get User
    const userInfo = await this.user()
    if (!userInfo) {
      throw new ApolloError('User not found', '404')
    }

    const res = await this.axios.post(`/users/${userInfo.id}/posts`, data)
    return res.data.data
  }

  async publish(publicationId: string, data: Post | null): Promise<boolean> {
    if (!this.axios) {
      logHelper('Medium %o', {
        data
      })
      throw new ApolloError('')
    }

    // Get User
    const userInfo = await this.user()
    if (!userInfo) {
      throw new ApolloError('User not found', '404')
    }

    const res = await this.axios.post(`/publications/${publicationId}/posts`)
    return res.data.data
  }

  async user(): Promise<MediumUser> {
    if (!this.axios) {
      throw new ApolloError('')
    }
    const res = await this.axios.get('/v1/me')
    return res.data.data
  }

  async getPosts(): Promise<MediumUser[]> {
    if (!this.axios) {
      throw new ApolloError('')
    }

    const userInfo = await this.user()
    if (!userInfo) {
      throw new ApolloError('User not found', '404')
    }

    const res = await this.axios.get(`/users/${userInfo.id}/posts`)
    return res.data.data
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
