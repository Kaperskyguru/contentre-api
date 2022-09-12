import { Resolvers } from '@/types/modules'
import { gql } from 'apollo-server-core'
import createContent from './mutations/create-content'
import deleteContent from './mutations/delete-content'
import updateContent from './mutations/update-content'
import getContent from './queries/get-content'
import getContents from './queries/get-contents'
import uploadContent from './mutations/upload-content'
import uploadMultipleContent from './mutations/upload-multiple-contents'
import interactions from './fields/interactions'
import getIndexMetadata from './queries/get-index-metadata'
import getOverallStats from './queries/get-overall-stats'
import getCategoryStats from './queries/get-category-stats'
import getBoxStats from './queries/get-box-stats'
import deleteBulkContent from './mutations/delete-bulk-content'
import getContentStats from './queries/get-content-stats'
import convertNoteContent from './mutations/convert-note-content'
import removeContentTag from './mutations/remove-content-tags'

const typeDefs = gql`
  type Content {
    id: ID!
    title: String!
    client: Client
    visibility: Visibility!
    lastUpdated: Time
    url: String
    tags: JSON
    topics: JSON
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
    publishedDate: Time
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
    amountPercent: Float
    amount: Float
    totalContents: Int!

    amountPercentStat: Float
    contentPercent: Float!
    totalClients: Int!
    clientPercent: Float!
    interactionPercent: Float!
    currentInteractions: Int!
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
    totalInteractions: Int!
    totalAmount: Float!
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

    totalInteractions: Int!
    totalAmount: Float!
    totalClients: Int!
  }

  input CreateContentInput {
    url: String
    content: String
    title: String!
    excerpt: String
    clientId: ID
    tags: [String!]
    topics: [String!]
    category: String
    featuredImage: String
    amount: Float
    noteId: ID
    status: StatusType
    comments: Int
    visibility: Visibility
    likes: Int
    shares: Int
    apps: Apps
    paymentType: PaymentType
  }

  input ConvertContentInput {
    url: String
    content: String
    title: String!
    excerpt: String
    clientId: ID
    tags: [String!]
    topics: [String!]
    category: String
    featuredImage: String
    amount: Float
    noteId: ID
    status: StatusType
    comments: Int
    visibility: Visibility
    likes: Int
    shares: Int
    apps: Apps
    paymentType: PaymentType
  }

  input UploadContentInput {
    url: String!
  }

  input UploadMultipleContentInput {
    urls: [String!]!
  }

  input DeleteBulkContentInput {
    ids: [ID!]!
  }

  input UpdateContentInput {
    title: String
    comments: Int
    excerpt: String
    content: String
    url: String
    featuredImage: String
    likes: Int
    shares: Int
    shareable: Boolean
    status: StatusType
    paymentType: String
    amount: Float
    tags: [String!]
    topics: [String!]
    apps: Apps
    clientId: ID
    category: String
    visibility: String
  }

  type Metadata {
    title: String!
    url: String!
    image: String!
    excerpt: String!
    publishedDate: Time
    tags: [String!]
    client: Client!
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
    clients: [String!]
    fromDate: String
    toDate: String
    topics: [String!]
  }

  type Meta {
    total: Int!
    netTotal: Int
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
    getContentStats(filters: ContentFiltersInput): IndexMetadataResponse
    getCategoryStats(filters: ContentFiltersInput): OverallStatResponse
    getBoxStats(filters: ContentFiltersInput): BoxStats
  }

  extend type Mutation {
    createContent(input: CreateContentInput!): Content
    convertNoteContent(id: ID!, input: ConvertContentInput!): Content
    uploadContent(input: UploadContentInput!): Content!
    uploadMultipleContent(input: UploadMultipleContentInput!): [Content!]!
    deleteContent(id: ID!): Boolean!
    deleteBulkContent(input: DeleteBulkContentInput!): Boolean!
    updateContent(id: ID!, input: UpdateContentInput!): Content!
    removeContentTag(id: ID!, tags: [String!]): Content
  }
`
const resolvers: Resolvers = {
  Query: {
    getContents,
    getContent,
    getContentStats,
    getIndexMetadata,
    getOverallStats,
    getCategoryStats,
    getBoxStats
  },

  Mutation: {
    createContent,
    convertNoteContent,
    uploadContent,
    deleteContent,
    updateContent,
    deleteBulkContent,
    uploadMultipleContent,
    removeContentTag
  },

  Content: {
    interactions: interactions
  }
}

export default { typeDefs, resolvers }
