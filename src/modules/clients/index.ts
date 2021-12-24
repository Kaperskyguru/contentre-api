import { Resolvers } from '@/types/modules'
import { gql } from 'apollo-server-core'
import createClient from './mutations/create-client'
import updateClient from './mutations/update-client'
import getClient from './queries/get-client'
import getClients from './queries/get-clients'

const typeDefs = gql`
  type Client {
    id: String
    name: String!
    website: String
    authorsLink: String
    updatedAt: Time!
    createdAt: Time!
  }

  input CreateClientInput {
    name: String!
    website: String
    authorsLink: String
  }

  input ClientFiltersInput {
    terms: String
  }

  input UpdateClientInput {
    name: String
    website: String
    authorsLink: String
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
    updateClient
  }
}
export default { typeDefs, resolvers }
