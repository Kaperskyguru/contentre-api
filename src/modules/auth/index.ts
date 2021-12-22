import { Resolvers } from '@/types/modules'
import { gql } from 'apollo-server-core'
import loginUser from './mutations/login-user'

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
  }
`

const resolvers: Resolvers = {
  Mutation: {
    loginUser
  }
}
export default { typeDefs, resolvers }
