import { Resolvers } from '@/types/modules'
import { gql } from 'apollo-server-core'
import createClient from './mutations/create-client'
import updateClient from './mutations/update-client'
import getClient from './queries/get-client'
import getClients from './queries/get-clients'
import deleteClient from './mutations/delete-client'
import totalContents from './fields/total-contents'

const typeDefs = gql`
  type Client {
    id: ID!
    name: String!
    website: String
    profile: String
    icon: String
    amount: Float
    paymentType: PaymentType
    status: String
    user: User
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
  }

  input UpdateClientInput {
    name: String
    website: String
    amount: Float
    paymentType: PaymentType
    profile: String
  }

  extend type Query {
    getClients(size: Int, skip: Int, filters: ClientFiltersInput): [Client!]!
    getClient(id: ID!): Client!
  }

  extend type Mutation {
    createClient(input: CreateClientInput!): Client!
    updateClient(id: ID!, input: UpdateClientInput!): Client!
    deleteClient(id: ID!): Boolean!
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
    deleteClient
  },

  Client: {
    totalContents: totalContents
  }
}
export default { typeDefs, resolvers }
