import { Resolvers } from '@/types/modules'
import { gql } from 'apollo-server-core'
import createContent from './mutations/create-content'
import deleteContent from './mutations/delete-content'
import updateContent from './mutations/update-content'
import getContent from './queries/get-content'
import getContents from './queries/get-contents'
import uploadContent from './mutations/upload-content'
import interactions from './fields/interactions'
import getIndexMetadata from './queries/get-index-metadata'

const typeDefs = gql`
  type Content {
    id: ID!
    title: String!
    client: Client
    visibility: VisibilityType!
    lastUpdated: Time
    url: String
    tags: JSON
    topics: [String!]
    type: ContentType!
    user: User
    excerpt: String!
    content: String
    comments: Int
    amount: Float
    paymentType: PaymentType
    likes: Int
    shares: Int
    interactions: Int
    category: Category
    featuredImage: String
    createdAt: Time!
    updatedAt: Time!
  }

  type Tag {
    id: ID
    name: String!
  }

  enum VisibilityType {
    PUBLISHED
    DRAFT
    DELETED
  }

  enum ContentType {
    TEXT
    AUDIO
    VIDEO
  }

  enum PaymentType {
    ARTICLE
    MONTHLY
    ONETIME
  }

  type IndexMetadataResponse {
    likePercent: Float!
    commentPercent: Float!
    sharePercent: Float!
    likes: Float!
    shares: Float!
    comments: Float!
  }

  input CreateContentInput {
    url: String
    content: String
    title: String!
    excerpt: String!
    clientId: ID!
    tags: JSON
    category: String
    amount: Float
    comments: Int
    likes: Int
    shares: Int
    paymentType: PaymentType
  }

  input UploadContentInput {
    url: String!
  }

  input UpdateContentInput {
    title: String
    clientId: ID
  }

  input ContentFiltersInput {
    terms: String
    sortBy: String
  }

  extend type Query {
    getContents(size: Int, skip: Int, filters: ContentFiltersInput): [Content!]!
    getContent(id: ID!): Content!
    getIndexMetadata(filters: ContentFiltersInput): IndexMetadataResponse!
  }

  extend type Mutation {
    createContent(input: CreateContentInput!): Content
    uploadContent(input: UploadContentInput!): Content!
    deleteContent(id: ID!): Boolean!
    updateContent(id: ID!, input: UpdateContentInput!): Content!
  }
`
// [Tags!]
const resolvers: Resolvers = {
  Query: {
    getContents,
    getContent,
    getIndexMetadata
  },

  Mutation: {
    createContent,
    uploadContent,
    deleteContent,
    updateContent
  },

  Content: {
    interactions: interactions
  }
}

export default { typeDefs, resolvers }
