import { Resolvers } from '@/types/modules'
import { gql } from 'apollo-server-core'
// import createUser from './mutations/create-user'
// import userAvatarURL from './fields/user-avatar-url'
// import getCurrentUser from './queries/get-current-user'

const typeDefs = gql`
  type Content {
    id: ID!
    title: String!
    client: [Client!]!
    visibility: Boolean!
    lastUpdated: Time
    link: String!
    tags: [Tags!]
    topics: [String!]
    type: ContentType
    excerpt: String!
    content: String
    featuredImage: String
    createdAt: Time!
    updatedAt: Time!
  }

  enum ContentType {
    TEXT
    AUDIO
    VIDEO
  }
`

const resolvers: Resolvers = {
  Query: {
    // findUser,
    // getCurrentUser
  },

  Mutation: {
    // createUser
    // deleteUser,
    // updateUser,
    // forceUserToVerifyPhoneNumber,
    // userSwitchedLanguage
  }
}

export default { typeDefs, resolvers }
