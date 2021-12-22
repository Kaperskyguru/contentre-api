import { Resolvers } from '@/types/modules'
import { gql } from 'apollo-server-core'
import changePassword from './mutations/change-password'
import loginUser from './mutations/login-user'
import logoutUser from './mutations/logout-user'

const typeDefs = gql`
  input LoginUserInput {
    email: String!
    password: String
    remember: Boolean
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
  }
`

const resolvers: Resolvers = {
  Mutation: {
    loginUser,
    changePassword,
    logoutUser
  }
}
export default { typeDefs, resolvers }
