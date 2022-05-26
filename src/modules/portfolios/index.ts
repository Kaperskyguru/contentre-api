import { Resolvers } from '@/types/modules'
import { gql } from 'apollo-server-core'
import createPortfolio from './mutations/create-portfolio'
import getPortfolios from './queries/get-portfolios'
import deletePortfolio from './mutations/delete-portfolio'
import getPortfolioContent from './queries/get-portfolio-contents'
import getPortfolioDetail from './queries/get-portfolio-details'
import getPortfolio from './queries/get-portfolio'
import updatePortfolio from './mutations/update-portfolio'
import getTemplates from './queries/get-templates'
import updateUserTemplate from './mutations/update-user-template'

const typeDefs = gql`
  type Portfolio {
    id: ID!
    title: String!
    userId: ID
    type: String
    url: String!
    description: String
    templateId: ID!
    template: UserTemplate
    createdAt: Time!
    updatedAt: Time!
  }

  type Template {
    id: ID!
    title: String!
    slug: String!
    type: TemplateType
  }

  type UserTemplate {
    id: ID!
    content: String
    css: String
    template: Template
    createdAt: Time!
    updatedAt: Time!
  }

  type PortfolioContent {
    contents: ContentResponse
    clients: [Client!]
    categories: [Category!]
    tags: [Tag!]
  }

  type PortfolioDetail {
    html: String
    css: String
    about: String
    templateSlug: String!
    templateType: TemplateType!
    job: String
    coverImage: String
    name: String!
    profileImage: String
    contact: Contact
  }

  type Contact {
    phone: String
    email: String
    address: String
  }

  input CreatePortfolioInput {
    url: String
    title: String!
    description: String
    templateId: ID
    clientId: ID
    categoryId: ID
    tags: [String!]
    shouldCustomize: Boolean
  }

  input CreateUserTemplateInput {
    url: String
    title: String!
    description: String
    templateId: ID
    clientId: ID
    categoryId: ID
    tags: [String!]
  }

  enum TemplateType {
    TEMPLATE
    CUSTOMIZED
  }

  input UpdatePortfolioInput {
    title: String
    description: String
    url: String
  }

  input UpdateUserTemplateInput {
    content: String
    css: String
  }

  input PortfolioFiltersInput {
    terms: String
  }

  input TemplateFiltersInput {
    terms: String
  }

  input PortfolioContentFilters {
    terms: String
    username: String!
    code: String
    url: String
    clients: [String!]
    categories: [String!]
    topics: [String!]
    tags: [String!]
    fromDate: Time
    toDate: Time
    sortBy: String
  }

  input PortfolioDetailsFilters {
    username: String!
    code: String
    url: String
  }

  extend type Query {
    getPortfolios(
      size: Int
      skip: Int
      filters: PortfolioFiltersInput
    ): [Portfolio!]!

    getTemplates(
      size: Int
      skip: Int
      filters: TemplateFiltersInput
    ): [Template!]!

    getPortfolio(id: ID!): Portfolio!
    getPortfolioContent(
      size: Int
      skip: Int
      filters: PortfolioContentFilters!
    ): PortfolioContent
    getPortfolioDetail(filters: PortfolioDetailsFilters!): PortfolioDetail!
  }

  extend type Mutation {
    createPortfolio(input: CreatePortfolioInput!): Portfolio
    deletePortfolio(id: ID!): Boolean!
    updatePortfolio(id: ID!, input: UpdatePortfolioInput!): Portfolio!
    updateUserTemplate(id: ID!, input: UpdateUserTemplateInput!): UserTemplate!
  }
`
const resolvers: Resolvers = {
  Query: {
    getPortfolios,
    getPortfolio,
    getPortfolioContent,
    getPortfolioDetail,
    getTemplates
  },

  Mutation: {
    createPortfolio,
    deletePortfolio,
    updatePortfolio,
    updateUserTemplate
  }
}

export default { typeDefs, resolvers }
