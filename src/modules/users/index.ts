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
import isPaying from './fields/is-paying'
import isTrial from './fields/is-trial'

const typeDefs = gql`
  type User {
    id: ID!
    email: String!
    name: String!
    firstname: String
    lastname: String
    bio: String
    homeAddress: String
    portfolioURL: String
    jobTitle: String
    username: String
    hasTrial: Boolean
    trialEndDate: Time
    subscriptionId: ID
    subscription: Subscription
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
    paying: Boolean
    isTrial: Boolean
  }

  type subUser {
    id: ID!
    subscriptionId: ID
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

  type Subscription {
    id: ID!
    name: String!
    expiry: Time
    planId: String
    features: [Feature!]
  }

  type Feature {
    id: ID!
    feature: String!
    value: String!
  }

  enum SignedUpThrough {
    CONTENTRE
    GOOGLE
  }

  input UserInput {
    avatarURL: String
    email: String
    name: String
    phoneCode: String
    phoneNumber: String
  }

  extend input TeamInput {
    members: [TeamMembersRelation!]
  }

  extend input TeamMembersRelation {
    create: [UserInput]
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
    totalContents: totalContents,
    paying: isPaying,
    isTrial: isTrial
  }
}

export default { typeDefs, resolvers }
