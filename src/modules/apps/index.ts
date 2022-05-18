import { Resolvers } from '@/types/modules'
import { gql } from 'apollo-server-core'
import createApp from './mutations/create-app'
import updateApp from './mutations/update-app'
import getApps from './queries/get-apps'
import getApp from './queries/get-app'

const typeDefs = gql`
  type Integration {
    id: ID!
    name: String
    description: String
    icon: String
    createdAt: Time!
    updatedAt: Time!
  }

  type App {
    id: ID!
    name: String!
    slug: String
    token: String
    secret: String
    isActivated: Boolean
    app: Integration
    createdAt: Time!
    updatedAt: Time!
  }

  input CreateAppInput {
    token: String
    key: String
    name: String!
  }

  input UpdateAppInput {
    token: String
    key: String
    name: String
    isActivated: Boolean
  }

  input Medium {
    publishedStatus: AppStatus
    notifyFollowers: Boolean
    contentFormat: Format
    canonicalUrl: String
    title: String
    content: String
    tags: [String!]
  }

  input AppFiltersInput {
    terms: String
  }

  type AppResponse {
    apps: [App!]!
    meta: Meta!
  }

  input Apps {
    medium: Medium
  }

  enum Format {
    HTML
    MARKDOWN
  }

  enum AppStatus {
    PUBLIC
    DRAFT
    UNLISTED
  }

  extend type Query {
    getApps(size: Int, skip: Int, filters: AppFiltersInput): AppResponse!
    getApp(id: ID!): App!
  }

  extend type Mutation {
    createApp(input: CreateAppInput!): App
    deleteApp(id: ID!): Boolean!
    updateApp(id: ID!, input: UpdateAppInput!): App!
  }
`

const resolvers: Resolvers = {
  Query: {
    getApps,
    getApp
  },

  Mutation: {
    createApp,
    updateApp
  }
}

export default { typeDefs, resolvers }
