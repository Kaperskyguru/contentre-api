import { ApolloError } from 'apollo-server-errors'
import { environment } from '@/helpers/environment'
import axios from 'axios'
import { ConnectedApp } from '@prisma/client'

interface Post {
  title: string
  content: string
  canonicalUrl?: string
  featuredImage?: string
  excerpt?: string
  hideFromHashnodeFeed?: boolean
  publicationId?: string
}

class Hashnode {
  axios: any
  hashnode: ConnectedApp

  constructor(hashnode: ConnectedApp) {
    this.hashnode = hashnode

    this.axios = axios.create({
      baseURL: environment.hashnode.BASE_URL,
      headers: {
        Authorization: `${hashnode.token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Accept-Charset': 'utf-8'
      }
    })
  }

  async all(page: number = 0) {
    if (!this.hashnode.username) throw new ApolloError('Add Hashnode username')
    const queries = JSON.stringify({
      query: `query getUserArticles($page: Int!, $username: String!){
            user(username: $username){
              blogHandle
              publicationDomain
              publication{
                domain
                posts(page: $page){
                  title
                  slug
                  brief
                  isActive
                  coverImage
                }
              }
            }
          }`,
      variables: {
        page,
        username: this.hashnode.username
      }
    })

    try {
      const { data } = await this.axios.post(`/`, queries)
      const {
        data: {
          user: { publication, blogHandle, publicationDomain }
        }
      } = data

      return publication?.posts.map((item: any) => {
        const domain = publicationDomain
          ? publicationDomain
          : `${blogHandle}.hashnode.dev`

        const url = `https://${domain}/${item.slug}`
        return {
          title: item.title,
          url,
          tags: [],
          status: item.isActive ? 'PUBLISHED' : 'DRAFT',
          excerpt: item.brief,
          featuredImage: item.coverImage,
          client: {
            name: 'Hashnode',
            website: 'https://hashnode.com/'
          }
        }
      })
    } catch (e) {
      throw new ApolloError(e)
    }
  }

  async get(slug: string, hostname: string = '') {
    const queries = JSON.stringify({
      query: `query getUserArticle($slug: String!, $hostnamne: String){
              post(slug: $slug, hostname: $hostnamne)){
                title
                slug
                brief
                isActive
                coverImage
                publication {
                  username
                  domain
                }
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
        data: {
          post,
          post: { publication }
        }
      } = data

      const domain = publication.domain
        ? publication.domain
        : `${publication.username}.hashnode.dev`

      const url = `https://${domain}/${post.slug}`
      return {
        title: post.title,
        url,
        tags: post.tags,
        status: post.isActive ? 'PUBLISHED' : 'DRAFT',
        excerpt: post.brief,
        featuredImage: post.coverImage,
        client: {
          name: 'Hashnode',
          website: 'https://hashnode.com/'
        }
      }
    } catch (e) {
      throw new ApolloError(e)
    }
  }

  async user(username: string) {
    const queries = JSON.stringify({
      query: `query user($username: String!){
              user(username: $username){
                _id
                name
                username
                blogHandle
                publication {
                  _id
                  title
                  domain
                }
              }
            } 
              }
            }`,
      variables: {
        username
      }
    })

    try {
      const { data } = await this.axios.post(`/`, queries)

      if (!data?.data?.user) return

      const {
        data: {
          user,
          user: { publication }
        }
      } = data

      return {
        id: user._id,
        name: user.name,
        username: user.username,
        publication: {
          name: publication.title,
          id: publication._id,
          blogHandle: user.blogHandle,
          domain: publication.domain
        }
      }
    } catch (e) {
      throw new ApolloError(e)
    }
  }

  async create(post: Post) {
    if (post.publicationId) {
      return await this.createPublicationStory(
        post.publicationId,
        post,
        post.hideFromHashnodeFeed
      )
    }

    const user = await this.user(this.hashnode?.username!)

    if (!user) return

    return await this.createPublicationStory(
      user.publication,
      post,
      post.hideFromHashnodeFeed
    )
  }

  async createPublicationStory(
    publication: any,
    post: Post,
    hideFromFeed: boolean = false
  ) {
    let input: any = {}
    if (post.canonicalUrl)
      input.isRepublished = {
        originalArticleURL: post.canonicalUrl
      }

    if (post.featuredImage) {
      input['coverImageURL'] = post.featuredImage
    }

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
                  isActive
                  coverImage
                }
            }
        }`,
      variables: {
        publicationId: publication.id,
        hideFromHashnodeFeed: hideFromFeed,
        input: {
          title: post.title,
          contentMarkdown: post.content, //'# You can put Markdown here.\n***\n',
          tags: [], // Create Tags in DB
          subtitle: post.excerpt,
          ...input
        }
      }
    }

    try {
      const {
        data: { data }
      } = await this.axios.post(`/`, queries)

      const { createPublicationStory } = data

      if (!createPublicationStory.success) return

      const { post } = createPublicationStory

      const domain = publication.domain
        ? publication.domain
        : `${publication.blogHandle}.hashnode.dev`

      const url = `https://${domain}/${post.slug}`
      return {
        title: post.title,
        url,
        tags: post.tags,
        status: post.isActive ? 'PUBLISHED' : 'DRAFT',
        excerpt: post.brief,
        featuredImage: post.coverImage,
        client: {
          name: 'Hashnode',
          website: 'https://hashnode.com/'
        }
      }
    } catch (e) {
      throw new ApolloError(e)
    }
  }
}

export default Hashnode
