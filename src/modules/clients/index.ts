import { Resolvers } from '@/types/modules'
import { gql } from 'apollo-server-core'
import createClient from './mutations/create-client'
import updateClient from './mutations/update-client'

const typeDefs = gql`
  type Client {
    id: String
    name: String!
    website: String
  }

  input CreateClientInput {
    name: String!
    website: String
  }

  input UpdateClientInput {
    name: String
    website: String
  }

  extend type Mutation {
    createClient(input: CreateClientInput!): Client!
    updateClient(id: ID!, input: UpdateClientInput!): Client!
  }
`
const resolvers: Resolvers = {
  Query: {
    // findUser,
    //   getCurrentUser
  },

  Mutation: {
    createClient,
    // deleteUser,
    updateClient
    // forceUserToVerifyPhoneNumber,
    // userSwitchedLanguage
  }
}
export default { typeDefs, resolvers }
