import { Resolvers } from '@/types/modules'
import { gql } from 'apollo-server-core'
import createContent from './mutations/create-content'
import deleteContent from './mutations/delete-content'
import updateContent from './mutations/update-content'
import getContent from './queries/get-content'
import getContents from './queries/get-contents'

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
    type: ContentType!
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

  input UpdateContentInput {
    title: String
    clientId: ID
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
    updateContent(id: ID!, input: UpdateContentInput!): Content!
  }
`
// [Tags!]
const resolvers: Resolvers = {
  Query: {
    getContents,
    getContent
  },

  Mutation: {
    createContent,
    deleteContent,
    updateContent
  }
}

export default { typeDefs, resolvers }
