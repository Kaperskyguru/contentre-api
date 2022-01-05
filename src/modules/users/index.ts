import { Resolvers } from '@/types/modules'
import { gql } from 'apollo-server-core'
import createUser from './mutations/create-user'
import userAvatarURL from './fields/user-avatar-url'
import getCurrentUser from './queries/get-current-user'
import updateUser from './mutations/update-user'

const typeDefs = gql`
  enum SignedUpThrough {
    AIRBANK
    GOOGLE
  }

  type User {
    id: ID!
    email: String!
    name: String!
    username: String
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

  input UpdateUserInput {
    name: String
    jobTitle: String
    homeAddress: String
    phoneNumber: String
    bio: String
    portfolio: String
    email: String
    avatarURL: String
  }

  extend type Query {
    findUser(uuid: String!): User
    getCurrentUser: User
  }

  extend type Mutation {
    createUser(input: CreateUserInput!): User!
    deleteUser: Boolean!
    updateUser(input: UpdateUserInput!): User!
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
    createUser,
    // deleteUser,
    updateUser
    // forceUserToVerifyPhoneNumber,
    // userSwitchedLanguage
  },

  User: {
    avatarURL: userAvatarURL
  }
}

export default { typeDefs, resolvers }
