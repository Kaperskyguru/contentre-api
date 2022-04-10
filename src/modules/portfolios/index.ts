import { Resolvers } from '@/types/modules'
import { gql } from 'apollo-server-core'
import createPortfolio from './mutations/create-portfolio'
import getPortfolios from './queries/get-portfolios'
import deletePortfolio from './mutations/delete-portfolio'
import getPortfolioContent from './queries/get-portfolio-contents'

const typeDefs = gql`
  type Portfolio {
    id: ID!
    title: String!
    userId: ID
    type: String
    url: String!
    description: String
    templateId: ID!
    createdAt: Time!
    updatedAt: Time!
  }

  type PortfolioContent {
    html: String
    about: String
    coverImage: String
    name: String!
    profileImage: String
    portfolios: [Content!]
  }

  input CreatePortfolioInput {
    url: String!
    title: String!
    description: String
    type: String
    templateId: ID
  }

  input UpdatePortfolioInput {
    title: String
    description: String
    type: String
  }

  input PortfolioFiltersInput {
    terms: String
  }

  input PortfolioContentFilters {
    username: String!
    url: String
  }

  extend type Query {
    getPortfolios(
      size: Int
      skip: Int
      filters: PortfolioFiltersInput
    ): [Portfolio!]!
    getPortfolio(id: ID!): Portfolio!
    getPortfolioContent(
      size: Int
      skip: Int
      filters: PortfolioContentFilters!
    ): PortfolioContent
  }

  extend type Mutation {
    createPortfolio(input: CreatePortfolioInput!): Portfolio
    deletePortfolio(id: ID!): Boolean!
    updatePortfolio(id: ID!, input: UpdatePortfolioInput!): Portfolio!
  }
`
const resolvers: Resolvers = {
  Query: {
    getPortfolios,
    // getPortfolio
    getPortfolioContent
  },

  Mutation: {
    createPortfolio,
    deletePortfolio
    // updatePortfolio
  }
}

export default { typeDefs, resolvers }
