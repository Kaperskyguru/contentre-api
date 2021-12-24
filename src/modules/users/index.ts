import { Resolvers } from '@/types/modules'
import { gql } from 'apollo-server-core'
import createUser from './mutations/create-user'
import userAvatarURL from './fields/user-avatar-url'
import getCurrentUser from './queries/get-current-user'

const typeDefs = gql`
  type User {
    id: ID!
    email: String!
    name: String!
    phoneCode: String
    phoneNumber: String
    avatarURL: String
    createdAt: Time!
    updatedAt: Time!
    lastActivityAt: Time!
  }

  input CreateUserInput {
    email: String!
    password: String!
    name: String!
    username: String!
  }

  extend type Query {
    findUser(uuid: String!): User
    getCurrentUser: User
  }

  extend type Mutation {
    createUser(input: CreateUserInput!): User!
    deleteUser: Boolean!
    forceUserToVerifyPhoneNumber(token: String!, userId: String!): Boolean!
    userSwitchedLanguage(newLanguage: String!): Boolean!
  }
`
// isPasswordSet: Boolean
// signedUpThrough: SignedUpThrough

const resolvers: Resolvers = {
  Query: {
    // findUser,
    getCurrentUser
  },

  Mutation: {
    createUser
    // deleteUser,
    // updateUser,
    // forceUserToVerifyPhoneNumber,
    // userSwitchedLanguage
  },

  User: {
    avatarURL: userAvatarURL
  }
}

export default { typeDefs, resolvers }
