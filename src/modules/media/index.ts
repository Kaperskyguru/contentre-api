import { Resolvers } from '@/types/modules'
import { gql } from 'apollo-server-express'
import getMedias from './queries/get-medias'

const typeDefs = gql`
  type Media {
    id: ID!
    title: String
    url: String!
    createdAt: Time!
    updatedAt: Time!
  }

  input MediaFiltersInput {
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

  input CreateMediaInput {
    url: String!
    title: String
  }

  input CreateMultipleMediaInput {
    media: [CreateMediaInput!]!
  }

  input UpdateMediaInput {
    title: String
    url: String!
  }

  type Meta {
    total: Int!
  }

  type MediaResponse {
    media: [Media!]!
    meta: Meta!
  }

  extend type Query {
    getMedias(size: Int, skip: Int, filters: MediaFiltersInput): MediaResponse!
    getMedia(id: ID!): Media!
  }

  extend type Mutation {
    createMedia(input: CreateMediaInput!): Media
    createMultipleMedia(input: CreateMultipleMediaInput!): [Media!]!
    deleteMedia(id: ID!): Boolean!
    updateMedia(id: ID!, input: UpdateMediaInput!): Media!
  }
`

const resolvers: Resolvers = {
  Query: {
    getMedias
    //   getMedia,
  },

  Mutation: {
    //   createMedia,
    //   deleteMedia,
    //   updateMedia,
    //   createMultipleMedia
  }
}

export default { typeDefs, resolvers }
