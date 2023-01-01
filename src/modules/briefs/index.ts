import { Resolvers } from '@/types/modules'
import { gql } from 'apollo-server-express'
import getBrief from './queries/get-brief'
import getBriefs from './queries/get-briefs'
import createBrief from './mutations/create-brief'
import deleteBrief from './mutations/delete-brief'
import updateBrief from './mutations/update-brief'
import convertNoteBrief from './mutations/convert-note-brief'
import deleteBulkBrief from './mutations/delete-bulk-brief'

const typeDefs = gql`
  type Brief {
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

  input CreateBriefInput {
    title: String!
    content: String!
  }

  input UpdateBriefInput {
    title: String
    content: String
    shareable: Boolean
    status: StatusType
  }

  input DeleteBulkBriefInput {
    ids: [ID!]!
  }

  input BriefFiltersInput {
    terms: String
    fromDate: String
    toDate: String
    sortBy: String
    desc: Boolean
  }

  type BriefResponse {
    meta: Meta!
    briefs: [Brief!]!
  }

  input ConvertBriefInput {
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

  extend type Query {
    getBriefs(size: Int, skip: Int, filters: BriefFiltersInput): BriefResponse!
    getBrief(id: ID!): Brief!
  }

  extend type Mutation {
    convertNoteBrief(id: ID!, input: ConvertBriefInput!): Brief
    createBrief(input: CreateBriefInput!): Brief
    deleteBulkBrief(input: DeleteBulkBriefInput!): Boolean!
    deleteBrief(id: ID!): Boolean!
    updateBrief(id: ID!, input: UpdateBriefInput!): Brief!
  }
`

const resolvers: Resolvers = {
  Query: {
    getBriefs,
    getBrief
  },
  Mutation: {
    createBrief,
    deleteBrief,
    updateBrief,
    deleteBulkBrief,
    convertNoteBrief
  }
}
export default { typeDefs, resolvers }
