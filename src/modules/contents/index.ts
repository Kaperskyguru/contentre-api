import { Resolvers } from '@/types/modules'
import { gql } from 'apollo-server-core'
import createContent from './mutations/create-content'
import deleteContent from './mutations/delete-content'
// import userAvatarURL from './fields/user-avatar-url'
// import getCurrentUser from './queries/get-current-user'

const typeDefs = gql`
  type Content {
    id: ID!
    title: String!
    client: Client
    visibility: VisibilityType!
    lastUpdated: Time
    url: String!
    tags: [String!]
    topics: [String!]
    type: ContentType
    excerpt: String!
    content: String
    featuredImage: String
    createdAt: Time!
    updatedAt: Time!
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

  input CreateContentInput {
    url: String
    clientId: ID!
  }

  input ContentFiltersInput {
    terms: String
  }

  extend type Query {
    getContents(size: Int, skip: Int, filters: ContentFiltersInput): [Content!]!
    getContent(id: ID!): Content!
  }

  extend type Mutation {
    createContent(input: CreateContentInput!): Content
    deleteContent(id: ID!): Boolean!
  }
`
// [Tags!]
const resolvers: Resolvers = {
  Query: {
    // findUser,
    // getCurrentUser
  },

  Mutation: {
    createContent,
    deleteContent
    // updateUser,
    // forceUserToVerifyPhoneNumber,
    // userSwitchedLanguage
  }
}

export default { typeDefs, resolvers }
