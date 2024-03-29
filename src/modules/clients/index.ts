import { Resolvers } from '@/types/modules'
import { gql } from 'apollo-server-core'
import createClient from './mutations/create-client'
import updateClient from './mutations/update-client'
import getClient from './queries/get-client'
import getClients from './queries/get-clients'
import deleteClient from './mutations/delete-client'
import totalContents from './fields/total-contents'
import totalAmount from './fields/total-amount'
import deleteBulkClient from './mutations/delete-bulk-client'

const typeDefs = gql`
  type Client {
    id: ID!
    name: String!
    website: String
    profile: String
    icon: String
    amount: Float
    totalAmount: Float
    paymentType: PaymentType
    status: String
    user: User
    visibility: Visibility
    totalContents: String
    updatedAt: Time!
    createdAt: Time!
  }

  input CreateProfileInput {
    profileLink: String!
    profileAvatar: String
  }

  input CreateClientInput {
    name: String!
    website: String
    amount: Float
    paymentType: PaymentType
    profile: String
  }

  input ClientFiltersInput {
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

  enum Status {
    ACTIVE
    INACTIVE
  }

  type ClientResponse {
    meta: Meta!
    clients: [Client!]!
  }

  input DeleteBulkClientInput {
    ids: [ID!]!
  }

  input UpdateClientInput {
    name: String
    website: String
    amount: Float
    paymentType: PaymentType
    profile: String
    status: Status
    visibility: Visibility
  }

  extend type Query {
    getClients(
      size: Int
      skip: Int
      filters: ClientFiltersInput
    ): ClientResponse!
    getClient(id: ID!): Client!
  }

  extend type Mutation {
    createClient(input: CreateClientInput!): Client!
    updateClient(id: ID!, input: UpdateClientInput!): Client!
    deleteClient(id: ID!): Boolean!
    deleteBulkClient(input: DeleteBulkClientInput!): Boolean!
  }
`
const resolvers: Resolvers = {
  Query: {
    getClients,
    getClient
  },

  Mutation: {
    createClient,
    updateClient,
    deleteClient,
    deleteBulkClient
  },

  Client: {
    totalContents: totalContents,
    totalAmount: totalAmount
  }
}
export default { typeDefs, resolvers }
