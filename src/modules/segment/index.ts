import { Resolvers } from '@modules-types'
import { gql } from 'apollo-server-express'
import sendSegment from './mutations/send-segment'

const typeDefs = gql`
  input SendSegmentInput {
    userId: String!
    operation: String!
    data: JSON!
    groupId: String
    eventName: String
    pageName: String
  }

  extend type Mutation {
    sendSegment(input: SendSegmentInput!): Boolean!
  }
`
const resolvers: Resolvers = {
  Mutation: {
    sendSegment
  }
}

export default { typeDefs, resolvers }
