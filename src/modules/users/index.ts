import { Resolvers } from '@/types/modules'
import { gql } from 'apollo-server-core'
import createUser from './mutations/create-user'
import userAvatarURL from './fields/user-avatar-url'
import getCurrentUser from './queries/get-current-user'
import updateUser from './mutations/update-user'
import deleteUser from './mutations/delete-user'
import getUser from './queries/getUser'
import usersReferred from './fields/users-referred'
import totalContents from './fields/total-contents'

const typeDefs = gql`
  type User {
    id: ID!
    email: String!
    name: String!
    firstname: String
    lastname: String
    bio: String
    homeAddress: String
    portfolio: String
    jobTitle: String
    username: String
    phoneCode: String
    phoneNumber: String
    totalUsersReferred: String
    hasFinishedOnboarding: Boolean
    totalContents: Int
    avatarURL: String
    createdAt: Time!
    updatedAt: Time!
    lastActivityAt: Time!
    clients: [Client!]
  }

  input CreateUserInput {
    email: String!
    password: String!
    name: String!
    username: String!
    referrer: String
    language: String
    analyticsSource: String
    analyticsSourceData: String
    signedUpThrough: SignedUpThrough
  }

  enum SignedUpThrough {
    CONTENTRE
    GOOGLE
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
    getUser(uuid: String!): User!
    getCurrentUser: User
  }

  extend type Mutation {
    createUser(input: CreateUserInput!): User!
    deleteUser(feedback: String, oldPassword: String!): Boolean!
    updateUser(input: UpdateUserInput!): User!
  }
`
// isPasswordSet: Boolean
// signedUpThrough: SignedUpThrough

const resolvers: Resolvers = {
  Query: {
    getUser,
    getCurrentUser
  },

  Mutation: {
    createUser,
    deleteUser,
    updateUser
  },

  User: {
    avatarURL: userAvatarURL,
    totalUsersReferred: usersReferred,
    totalContents: totalContents
  }
}

export default { typeDefs, resolvers }
