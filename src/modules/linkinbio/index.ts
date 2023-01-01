import { Resolvers } from '@/types/modules'
import { gql } from 'apollo-server-express'
import getLinkProfile from './queries/get-link-profile'

const typeDefs = gql`
  type LinkProfile {
    name: String
    avatar: String
    jobTitle: String
    bio: String
    socials: [SocialLink]
    clients: [ClientLink]
    portfolios: [PortfolioLink]
  }

  type ClientLink {
    name: String!
    website: String
    profile: String!
    icon: String
  }

  type PortfolioLink {
    title: String!
    url: String
  }

  type SocialLink {
    name: String!
    link: String!
    icon: String
  }

  input LinkFiltersInput {
    username: String!
    url: String
  }

  extend type Query {
    getLinkProfile(filters: LinkFiltersInput): LinkProfile!
  }
`

const resolvers: Resolvers = {
  Query: {
    getLinkProfile
  },
  Mutation: {}
  //   Outline: {
  //     totalOutlines: totalOutlines
  //   }
}
export default { typeDefs, resolvers }
