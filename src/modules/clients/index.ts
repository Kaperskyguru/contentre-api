import { Resolvers } from '@/types/modules'
import { gql } from 'apollo-server-core'
import createClient from './mutations/create-client'

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

  extend type Mutation {
    createClient(input: CreateClientInput!): Client!
  }
`
const resolvers: Resolvers = {
  Query: {
    // findUser,
    //   getCurrentUser
  },

  Mutation: {
    createClient
    // deleteUser,
    // updateUser,
    // forceUserToVerifyPhoneNumber,
    // userSwitchedLanguage
  }
}
export default { typeDefs, resolvers }
