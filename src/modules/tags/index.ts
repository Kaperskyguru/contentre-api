import { Resolvers } from '@/types/modules'
import { gql } from 'apollo-server-express'
import getTag from './queries/get-tag'
import getTags from './queries/get-tags'
import createTag from './mutations/create-tag'
import deleteTag from './mutations/delete-tag'
import updateTag from './mutations/update-tag'

const typeDefs = gql`
  type Tag {
    id: ID
    name: String!
    userId: ID
  }

  input CreateTagInput {
    name: String!
  }

  input UpdateTagInput {
    name: String
  }

  input TagFiltersInput {
    terms: String
    sortBy: String
  }

  extend type Query {
    getTags(size: Int, skip: Int, filters: TagFiltersInput): [Tag!]!
    getTag(id: ID!): Tag!
  }

  extend type Mutation {
    createTag(input: CreateTagInput!): Tag
    deleteTag(id: ID!): Boolean!
    updateTag(id: ID!, input: UpdateTagInput!): Tag!
  }
`

const resolvers: Resolvers = {
  Query: {
    getTags,
    getTag
  },
  Mutation: {
    createTag,
    deleteTag,
    updateTag
  }
}
export default { typeDefs, resolvers }
