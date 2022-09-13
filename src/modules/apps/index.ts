import { Resolvers } from '@/types/modules'
import { gql } from 'apollo-server-core'
import createConnectedApp from './mutations/create-connected-app'
import updateConnectedApp from './mutations/update-connected-app'
import getConnectedApps from './queries/get-connected-apps'
import getConnectedApp from './queries/get-connected-app'
import getApps from './queries/get-apps'

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

  type ConnectedAppResponse {
    apps: [App!]!
    meta: Meta!
  }

  type AppResponse {
    apps: [Integration!]!
    meta: Meta!
  }

  input Apps {
    medium: Medium
  }

  enum Format {
    html
    markdown
  }

  enum AppStatus {
    public
    draft
    unlisted
  }

  extend type Query {
    getConnectedApps(
      size: Int
      skip: Int
      filters: AppFiltersInput
    ): ConnectedAppResponse!
    getApps(size: Int, skip: Int, filters: AppFiltersInput): AppResponse!
    getConnectedApp(id: ID!): App!
  }

  extend type Mutation {
    createConnectedApp(input: CreateAppInput!): App
    deleteConnectedApp(id: ID!): Boolean!
    updateConnectedApp(id: ID!, input: UpdateAppInput!): App!
  }
`

const resolvers: Resolvers = {
  Query: {
    getConnectedApps,
    getApps,
    getConnectedApp
  },

  Mutation: {
    createConnectedApp,
    updateConnectedApp
  }
}

export default { typeDefs, resolvers }
