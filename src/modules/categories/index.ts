import { Resolvers } from '@/types/modules'
import { gql } from 'apollo-server-core'
import getCategories from './queries/get-categories'
import getCategory from './queries/get-category'
import createCategory from './mutations/create-category'
import totalContents from './fields/total-contents'
import totalAmount from './fields/total-amount'
import updateCategory from './mutations/update-category'
import deleteCategory from './mutations/delete-category'

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

  input UpdateCategoryInput {
    name: String!
    color: String
  }

  type CategoryResponse {
    meta: Meta!
    categories: [Category!]!
  }

  input CategoryFiltersInput {
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
    fromDate: String
    toDate: String
    topics: [String!]
  }

  extend type Query {
    getCategories(
      size: Int
      skip: Int
      filters: CategoryFiltersInput
    ): CategoryResponse!
    getCategory(id: ID!): Category!
  }

  extend type Mutation {
    createCategory(input: CreateCategoryInput!): Category!
    updateCategory(id: ID!, input: UpdateCategoryInput!): Category!
    deleteCategory(id: ID!): Boolean!
  }
`
const resolvers: Resolvers = {
  Query: {
    getCategories,
    getCategory
  },

  Mutation: {
    createCategory,
    updateCategory,
    deleteCategory
  },

  Category: {
    totalContents: totalContents,
    totalAmount: totalAmount
  }
}
export default { typeDefs, resolvers }
