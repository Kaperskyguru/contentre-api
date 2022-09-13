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
  featuredImage?: string
  excerpt?: string
}

class Hashnode {
  axios: any
  constructor(hashnode: ConnectedApp) {
    this.axios = axios.create({
      baseURL: environment.hashnode.BASE_URL,
      headers: {
        Authorization: `Bearer ${hashnode.token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Accept-Charset': 'utf-8'
      }
    })
  }

  async all(username: string, page: number = 0) {
    const queries = JSON.stringify({
      query: `query getUserArticles($page: Int!, $username: String!){
            user(username: $username){
              publication{
                title
                posts(page: $page){
                  title
                  slug
                  brief
                }
              }
            }
          }`,
      variables: {
        page,
        username
      }
    })

    try {
      const { data } = await this.axios.post(`/`, queries)
      const {
        data: {
          user: { publication }
        }
      } = data

      return publication?.posts
    } catch (e) {
      throw new ApolloError(e)
    }
  }

  async get(slug: string, hostname: string) {
    const queries = JSON.stringify({
      query: `query getUserArticle($slug: String!, $hostnamne: String){
              post(slug: $slug, hostname: $hostnamne)){
                title
                slug
                brief
                tags{
                    name
                }
              }
            }`,
      variables: {
        slug,
        hostname
      }
    })

    try {
      const { data } = await this.axios.post(`/`, queries)
      const {
        data: { post }
      } = data

      return post
    } catch (e) {
      throw new ApolloError(e)
    }
  }

  async create(post: Post) {
    const queries = JSON.stringify({
      query: `mutation createStory($input: CreateStoryInput!){ 
            createStory(input: $input){ 
                code 
                success 
                message 
                post{
                    title
                    slug
                    brief
                    tags{
                        name
                    }
                }
            } 
        }`,
      variables: {
        input: {
          title: post.title,
          contentMarkdown: post.content, //'# You can put Markdown here.\n***\n',
          tags: [], // Create Tags in DB
          coverImageURL: post.featuredImage,
          subtitle: post.excerpt,
          isRepublished: {
            originalArticleURL: post.canonicalUrl
          }
        }
      }
    })

    try {
      const { data } = await this.axios.post(`/`, queries)
      const {
        data: { post }
      } = data

      return post
    } catch (e) {
      throw new ApolloError(e)
    }
  }

  async createPublicationStory(
    publicationId: string,
    post: Post,
    hideFromFeed: boolean
  ) {
    const queries = {
      query: `mutation CreatePublicationStory($publicationId: String!, $input: CreateStoryInput!, $hideFromHashnodeFeed: Boolean) {
            createPublicationStory(publicationId: $publicationId, input: $input, hideFromHashnodeFeed: $hideFromHashnodeFeed) {
                code,
                success,
                message
                post{
                    title
                    slug
                    brief
                    tags{
                        name
                    }
                }
            }
        }`,
      variables: {
        publicationId,
        hideFromHashnodeFeed: hideFromFeed,
        input: {
          title: post.title,
          contentMarkdown: post.content, //'# You can put Markdown here.\n***\n',
          tags: [], // Create Tags in DB
          coverImageURL: post.featuredImage,
          subtitle: post.excerpt,
          isRepublished: {
            originalArticleURL: post.canonicalUrl
          }
        }
      }
    }

    try {
      const { data } = await this.axios.post(`/`, queries)
      const {
        data: { post }
      } = data

      return post
    } catch (e) {
      throw new ApolloError(e)
    }
  }
}

export default Hashnode
