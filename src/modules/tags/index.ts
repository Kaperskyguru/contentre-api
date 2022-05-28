import { Resolvers } from '@/types/modules'
import { gql } from 'apollo-server-express'
import getTag from './queries/get-tag'
import getTags from './queries/get-tags'
import createTag from './mutations/create-tag'
import deleteTag from './mutations/delete-tag'
import updateTag from './mutations/update-tag'
import totalAmount from './fields/total-amount'
import totalContents from './fields/total-contents'
import getTagStats from './queries/get-tag-stats'
import deleteBulkTag from './mutations/delete-bulk-tag'

const typeDefs = gql`
  type Tag {
    id: ID
    name: String!
    totalContents: Int
    totalAmount: Int
    userId: ID
    createdAt: Time!
    updatedAt: Time!
  }

  input CreateTagInput {
    name: String!
  }

  input UpdateTagInput {
    name: String
  }

  input DeleteBulkTagInput {
    ids: [ID!]!
  }

  input TagFiltersInput {
    terms: String
    sortBy: String
    all: Boolean
  }

  type TagResponse {
    meta: Meta!
    tags: [Tag!]!
  }

  extend type Query {
    getTags(size: Int, skip: Int, filters: TagFiltersInput): TagResponse!
    getTag(id: ID!): Tag!
    getTagStats(filters: ContentFiltersInput): OverallStatResponse
  }

  extend type Mutation {
    createTag(input: CreateTagInput!): Tag
    deleteTag(id: ID!): Boolean!
    updateTag(id: ID!, input: UpdateTagInput!): Tag!
    deleteBulkTag(input: DeleteBulkTagInput!): Boolean!
  }
`

const resolvers: Resolvers = {
  Query: {
    getTags,
    getTag,
    getTagStats
  },
  Mutation: {
    createTag,
    deleteTag,
    updateTag,
    deleteBulkTag
  },

  Tag: {
    totalContents,
    totalAmount
  }
}
export default { typeDefs, resolvers }
