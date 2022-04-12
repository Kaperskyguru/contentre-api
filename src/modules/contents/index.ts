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
import getOverallStats from './queries/get-overall-stats'
import getCategoryStats from './queries/get-category-stats'
import getTopicStats from './queries/get-topic-stats'

const typeDefs = gql`
  type Content {
    id: ID!
    title: String!
    client: Client
    visibility: Visibility!
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
    status: StatusType
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

  enum Visibility {
    PUBLIC
    PRIVATE
    TEAM
    UNLISTED
  }

  enum StatusType {
    PUBLISHED
    DRAFT
    DELETED
    INACTIVE
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

  type Chart {
    current: [Float!]!
    last: [Float!]!
  }

  type RevenueChart {
    data: Chart!
    months: [String!]!
  }

  type BoxStats {
    likePercent: Float!
    commentPercent: Float!
    sharePercent: Float!
    amountPercent: Float!
    likes: Float!
    shares: Float!
    comments: Float!
  }

  type Stat {
    interactions: Float!
    growth: Float!
    name: String!
    status: String!
    totalShares: Int!
    totalComments: Int!
    totalLikes: Int!
    totalContents: Int!
  }

  type Performance {
    totalShares: Int!
    totalComments: Int!
    totalLikes: Int!
    totalContents: Int!
  }

  type OverallStatsResponse {
    stats: [Stat!]
    performance: Performance
    categoryStat: OverallStatResponse
  }

  type IndexMetadataResponse {
    box: BoxStats
    revenue: RevenueChart
  }

  type OverallStatResponse {
    name: String!
    totalContents: Int!
    totalLikes: Int!
    totalComments: Int!
    totalShares: Int!
  }

  input CreateContentInput {
    url: String
    content: String
    title: String!
    excerpt: String!
    clientId: ID!
    tags: [String!]
    category: String
    amount: Float
    status: StatusType
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
    comments: Int
    likes: Int
    shares: Int
    status: StatusType
    paymentType: String
    amount: Float
    category: String
    visibility: String
  }

  input ContentFiltersInput {
    terms: String
    sortBy: String
    categoryIds: [ID!]
    topicIds: [ID!]
    duration: Int
    daily: Boolean
    tags: [String!]
    fromAmount: Float
    toAmount: Float
    categories: [String!]
    fromDate: String
    toDate: String
    topics: [String!]
  }

  type Meta {
    total: Int!
  }

  type ContentResponse {
    meta: Meta!
    contents: [Content!]!
  }

  extend type Query {
    getContents(
      size: Int
      skip: Int
      filters: ContentFiltersInput
    ): ContentResponse!
    getContent(id: ID!): Content!
    getIndexMetadata(filters: ContentFiltersInput): IndexMetadataResponse
    getOverallStats(filters: ContentFiltersInput): OverallStatsResponse

    getCategoryStats(filters: ContentFiltersInput): OverallStatResponse
    getTopicStats(filters: ContentFiltersInput): OverallStatResponse
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
    getIndexMetadata,
    getOverallStats,
    getCategoryStats,
    getTopicStats
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
