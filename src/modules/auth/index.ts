import { Resolvers } from '@/types/modules'
import { gql } from 'apollo-server-core'
// import loginUser from './mutations/login-user'

const typeDefs = gql`
  input LoginUserInput {
    email: String!
    password: String
    remember: Boolean
  }

  type User {
    id: ID
    name: String
  }

  extend type Mutation {
    loginUser(data: LoginUserInput!): User!
    sendPhoneCode(phoneCode: String!, phoneNumber: String!): Boolean!
  }
`

const resolvers: Resolvers = {
  Mutation: {
    // loginUser
  }
}
export default { typeDefs, resolvers }
