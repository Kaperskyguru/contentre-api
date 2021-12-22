import { environment } from '@/helpers/environment'
import { gql } from 'apollo-server-express'
import { GraphQLScalarType } from 'graphql'
import { makeExecutableSchema } from '@graphql-tools/schema'
import GraphQLJSON from 'graphql-type-json'
import auth from './auth'
import users from './users'

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
    //   accessRights.typeDefs,
    //   accounts.typeDefs,
    auth.typeDefs,
    //   consents.typeDefs,
    //   companies.typeDefs,
    //   categories.typeDefs,
    //   institutions.typeDefs,
    //   invites.typeDefs,
    //   notifications.typeDefs,
    users.typeDefs
    //   transactions.typeDefs,
    //   storage.typeDefs,
    //   admin.typeDefs,
    //   segment.typeDefs,
    //   invoices.typeDefs
  ],
  resolvers: [
    resolvers,
    //   accessRights.resolvers,
    //   accounts.resolvers,
    auth.resolvers,
    //   consents.resolvers,
    //   companies.resolvers,
    //   categories.resolvers,
    //   institutions.resolvers,
    //   invites.resolvers,
    //   notifications.resolvers,
    users.resolvers
    //   transactions.resolvers,
    //   storage.resolvers,
    //   admin.resolvers,
    //   segment.resolvers,
    //   invoices.resolvers
  ]
})

export default schema
