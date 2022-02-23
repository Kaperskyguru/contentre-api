import { Resolvers } from '@/types/modules'
import { gql } from 'apollo-server-core'
import getCategories from './queries/get-categories'

const typeDefs = gql`
  type Category {
    id: ID!
    name: String!
    color: String
    createdAt: Time!
    updatedAt: Time!
  }

  input CreateCategoryInput {
    name: String!
    color: String
  }

  input CategoryFiltersInput {
    terms: String
  }

  extend type Query {
    getCategories(
      size: Int
      skip: Int
      filters: CategoryFiltersInput
    ): [Category!]!
    getCategory(id: ID!): Category!
  }

  extend type Mutation {
    createCategory(input: CreateCategoryInput!): Category!
    updateCategory(id: ID!, input: CreateCategoryInput!): Category!
    deleteCategory(id: ID!): Boolean!
  }
`
const resolvers: Resolvers = {
  Query: {
    getCategories
    // getCategory
  },

  Mutation: {
    // createCategory,
    // updateCategory,
    // deleteCategory
  }
}
export default { typeDefs, resolvers }
