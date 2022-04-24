import { Resolvers } from '@/types/modules'
import { gql } from 'apollo-server-express'
// import getSocial from './queries/get-social'
import getSocials from './queries/get-socials'
import createSocial from './mutations/create-social'

const typeDefs = gql`
  type Social {
    id: ID
    name: String!
    link: String!
    icon: String
    createdAt: Time!
    updatedAt: Time!
  }

  input CreateSocialInput {
    name: String!
    link: String!
    icon: String
  }

  input UpdateSocialInput {
    name: String
  }

  input SocialFiltersInput {
    terms: String
    sortBy: String
    all: Boolean
  }

  type SocialResponse {
    meta: Meta!
    socials: [Social!]!
  }

  extend type Query {
    getSocials(
      size: Int
      skip: Int
      filters: SocialFiltersInput
    ): SocialResponse!
    getSocial(id: ID!): Social!
  }

  extend type Mutation {
    createSocial(input: CreateSocialInput!): Social
    deleteSocial(id: ID!): Boolean!
    updateSocial(id: ID!, input: UpdateSocialInput!): Social!
  }
`

const resolvers: Resolvers = {
  Query: {
    getSocials
    // getSocial
  },
  Mutation: {
    createSocial
    // deleteSocial,
    // updateSocial
  }
}
export default { typeDefs, resolvers }
