import { environment } from '@/helpers/environment'
import { gql } from 'apollo-server-express'
import { GraphQLScalarType } from 'graphql'
import { makeExecutableSchema } from '@graphql-tools/schema'
import GraphQLJSON from 'graphql-type-json'
import auth from './auth'
import users from './users'
import clients from './clients'
import contents from './contents'
import portfolios from './portfolios'
import categories from './categories'
import segment from './segment'
import tags from './tags'
import socials from './socials'
import teams from './teams'
import media from './media'
import apps from './apps'
import invites from './invites'
import topic from './topics'
import notebooks from './notebooks'
import outlines from './outlines'

const typeDefs = gql`
  scalar Time
  scalar JSON

  type Query {
    getVersion: String!
  }

  type Mutation {
    version: String!
  }
`

const timeScalar = new GraphQLScalarType({
  name: 'Time',
  description: 'Time custom scalar type',
  serialize: (value) => value
})

const resolvers = {
  Time: timeScalar,
  JSON: GraphQLJSON,
  Query: {
    getVersion: () => `${environment.context} v1`
  }
}

const schema = makeExecutableSchema({
  typeDefs: [
    typeDefs,
    clients.typeDefs,
    portfolios.typeDefs,
    auth.typeDefs,
    contents.typeDefs,
    tags.typeDefs,
    categories.typeDefs,
    socials.typeDefs,
    invites.typeDefs,
    notebooks.typeDefs,
    users.typeDefs,
    teams.typeDefs,
    media.typeDefs,
    topic.typeDefs,
    segment.typeDefs,
    apps.typeDefs,
    outlines.typeDefs
  ],
  resolvers: [
    resolvers,
    clients.resolvers,
    portfolios.resolvers,
    auth.resolvers,
    contents.resolvers,
    tags.resolvers,
    categories.resolvers,
    socials.resolvers,
    invites.resolvers,
    notebooks.resolvers,
    users.resolvers,
    teams.resolvers,
    media.resolvers,
    topic.resolvers,
    segment.resolvers,
    apps.resolvers,
    outlines.resolvers
  ]
})

export default schema
