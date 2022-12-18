import { Resolvers } from '@/types/modules'
import { gql } from 'apollo-server-express'
import getOutline from './queries/get-outline'
import getOutlines from './queries/get-outlines'
// import createOutline from './mutations/create-outline'
// import deleteOutline from './mutations/delete-outline'
// import updateOutline from './mutations/update-outline'
// import totalOutlines from './fields/total-notes'
// import deleteBulkOutline from './mutations/delete-bulk-outline'

const typeDefs = gql`
  type Outline {
    id: ID
    title: String
    content: String
    shareLink: String
    userId: ID
    teamId: ID
    shareable: Boolean
    link: String
    createdAt: Time!
    updatedAt: Time!
  }

  input CreateOutlineInput {
    title: String!
    content: String!
  }

  input UpdateOutlineInput {
    title: String
    content: String
    shareable: Boolean
    status: StatusType
  }

  input DeleteBulkOutlineInput {
    ids: [ID!]!
  }

  input OutlineFiltersInput {
    terms: String
    fromDate: String
    toDate: String
    sortBy: String
  }

  type OutlineResponse {
    meta: Meta!
    outlines: [Outline!]!
  }

  extend type Query {
    getOutlines(
      size: Int
      skip: Int
      filters: OutlineFiltersInput
    ): OutlineResponse!
    getOutline(id: ID!): Outline!
  }

  extend type Mutation {
    createOutline(input: CreateOutlineInput!): Outline
    deleteBulkOutline(input: DeleteBulkOutlineInput!): Boolean!
    deleteOutline(id: ID!): Boolean!
    updateOutline(id: ID!, input: UpdateOutlineInput!): Outline!
  }
`

const resolvers: Resolvers = {
  Query: {
    getOutlines,
    getOutline
  },
  Mutation: {
    //     createOutline,
    //     deleteOutline,
    //     updateOutline,
    //     deleteBulkOutline
  }
  //   Outline: {
  //     totalOutlines: totalOutlines
  //   }
}
export default { typeDefs, resolvers }
