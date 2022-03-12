import { Resolvers } from '@/types/modules'
import { gql } from 'apollo-server-core'
import getCategories from './queries/get-categories'
import getCategory from './queries/get-category'
import createCategory from './mutations/create-category'
import totalContents from './fields/total-contents'
import totalAmount from './fields/total-amount'

const typeDefs = gql`
  type Category {
    id: ID!
    name: String!
    color: String
    userId: ID
    totalContents: String
    totalAmount: String
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
    getCategories,
    getCategory
  },

  Mutation: {
    createCategory
    // updateCategory,
    // deleteCategory
  },

  Category: {
    totalContents: totalContents,
    totalAmount: totalAmount
  }
}
export default { typeDefs, resolvers }
