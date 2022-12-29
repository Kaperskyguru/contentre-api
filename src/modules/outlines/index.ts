import { Resolvers } from '@/types/modules'
import { gql } from 'apollo-server-express'
import getOutline from './queries/get-outline'
import getOutlines from './queries/get-outlines'
import createOutline from './mutations/create-outline'
import deleteOutline from './mutations/delete-outline'
import updateOutline from './mutations/update-outline'
import deleteBulkOutline from './mutations/delete-bulk-outline'
import convertNoteOutline from './mutations/convert-note-outline'

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
    status: StatusType
    createdAt: Time!
    updatedAt: Time!
  }

  input CreateOutlineInput {
    title: String!
    content: String
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

  input ConvertOutlineInput {
    url: String
    content: String
    title: String!
    excerpt: String
    clientId: ID
    tags: [String!]
    topics: [String!]
    category: String
    featuredImage: String
    noteId: ID
    apps: Apps
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
    convertNoteOutline(id: ID!, input: ConvertOutlineInput!): Outline
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
    createOutline,
    deleteOutline,
    updateOutline,
    deleteBulkOutline,
    convertNoteOutline
  }
}
export default { typeDefs, resolvers }
