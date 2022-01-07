import { Resolvers } from '@/types/modules'
import { gql } from 'apollo-server-core'
import changePassword from './mutations/change-password'
import loginUser from './mutations/login-user'
import logoutUser from './mutations/logout-user'
import resetPassword from './mutations/reset-password'
import useEmailCode from './mutations/use-email-code'
import usePasswordResetCode from './mutations/use-password-reset-code'
import usePhoneCode from './mutations/use-phone-code'
import verifyUsername from './mutations/verify-username'
import sendEmailCode from './mutations/send-email-code'
import sendPasswordResetCode from './mutations/send-password-reset-code'

const typeDefs = gql`
  input LoginUserInput {
    email: String!
    password: String
    remember: Boolean
  }

  extend type User {
    emailConfirmed: Boolean!
    phoneConfirmed: Boolean!
  }

  input RegisterUserInput {
    email: String!
    password: String!
    name: String!
    username: String
  }

  extend type Mutation {
    loginUser(data: LoginUserInput!): User!
    sendPhoneCode(phoneCode: String!, phoneNumber: String!): Boolean!
    sendEmailCode(email: String!): Boolean!
    changePassword(oldPassword: String!, newPassword: String!): User!
    logoutUser: Boolean!
    resetPassword(newPassword: String!): User!
    sendPasswordResetCode(email: String!): Boolean!
    useEmailCode(code: String!): User!
    usePasswordResetCode(code: String!, email: String!): User!
    usePhoneCode(code: String!): User!
    verifyUsername(username: String!): Boolean
  }
`

const resolvers: Resolvers = {
  Mutation: {
    loginUser,
    changePassword,
    logoutUser,
    resetPassword,
    useEmailCode,
    usePasswordResetCode,
    usePhoneCode,
    verifyUsername,
    sendEmailCode,
    sendPasswordResetCode
  }
}
export default { typeDefs, resolvers }
