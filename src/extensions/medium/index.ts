import { useErrorParser } from '@/helpers'
import { logHelper } from '@/helpers/logger'
import { ApolloError } from 'apollo-server-errors'
import { environment } from '@/helpers/environment'
import axios from 'axios'

const Axios = axios.create({
  baseURL: 'https://api.medium.com',
  headers: {
    Authorization:
      'Bearer 2d70de98a4a6c0318f6c049945d120890f460fe93de781e095afc5192e692ba64',
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'Accept-Charset': 'utf-8'
  }
})

interface Post {
  title: string
  content: string
  contentFormat: Format
  canonicalUrl?: string
  notifyFollowers?: boolean
  tags?: Array<string>
  publishStatus: Status
}

enum Format {
  HTML,
  MARKDOWN
}

enum Status {
  PUBLIC,
  DRAFT,
  UNLISTED
}

interface MediumUser {
  id: string
  username: string
  imageUrl: string
}

async function create(data: Post | null): Promise<Post | undefined> {
  if (environment.context !== 'PRODUCTION') return

  // Get User
  const userInfo = await user()
  if (!userInfo) {
    throw new ApolloError('User not found', '404')
  }

  const res = await Axios.post(`/users/${userInfo.id}/posts`, data)
  return res.data.data
}

async function publish(
  publicationId: string,
  data: Post | null
): Promise<boolean> {
  if (!Axios) {
    logHelper('Medium %o', {
      data
    })
    throw new ApolloError('')
  }

  // Get User
  const userInfo = await user()
  if (!userInfo) {
    throw new ApolloError('User not found', '404')
  }

  const res = await Axios.post(`/publications/${publicationId}/posts`)
  return res.data.data
}

async function user(): Promise<MediumUser> {
  if (!Axios) {
    throw new ApolloError('')
  }
  const res = await Axios.get('/v1/me')
  return res.data.data
}

async function getPosts(): Promise<MediumUser[]> {
  if (!Axios) {
    throw new ApolloError('')
  }

  const userInfo = await user()
  if (!userInfo) {
    throw new ApolloError('User not found', '404')
  }

  const res = await Axios.get(`/users/${userInfo.id}/posts`)
  return res.data.data
}

async function getPublicationPosts(
  publicationId: string
): Promise<MediumUser | boolean> {
  if (!Axios) {
    throw new ApolloError('')
  }

  const userInfo = await user()
  if (!userInfo) {
    throw new ApolloError('User not found', '404')
  }

  const res = await Axios.get(`/publications/${publicationId}/posts`)
  return res.data.data
}

async function getPublications(): Promise<MediumUser | boolean> {
  if (!Axios) {
    throw new ApolloError('')
  }

  const userInfo = await user()
  if (!userInfo) {
    throw new ApolloError('User not found', '404')
  }

  const res = await Axios.get(`/users/${userInfo.id}/publications`)
  return res.data.data
}

export default {
  user,
  getPublicationPosts,
  getPosts,
  getPublications,
  publish,
  create
}
