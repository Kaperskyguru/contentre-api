import { Resolvers } from '@/types/modules'
import { gql } from 'apollo-server-express'
import inviteFriends from './mutations/invite-friends'

const typeDefs = gql`
  input InviteFriendsInput {
    emails: [String!]!
  }

  extend type Mutation {
    inviteFriends(data: InviteFriendsInput!): Boolean!
  }
`

const resolvers: Resolvers = {
  Mutation: {
    inviteFriends
  }
}
export default { typeDefs, resolvers }
