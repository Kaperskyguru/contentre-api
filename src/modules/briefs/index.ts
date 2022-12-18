import { Resolvers } from '@/types/modules'
import { gql } from 'apollo-server-express'
import getBrief from './queries/get-brief'
import getBriefs from './queries/get-briefs'
// import createBrief from './mutations/create-outline'
// import deleteBrief from './mutations/delete-outline'
// import updateBrief from './mutations/update-outline'
// import totalBriefs from './fields/total-notes'
// import deleteBulkBrief from './mutations/delete-bulk-outline'

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
  }

  type BriefResponse {
    meta: Meta!
    briefs: [Brief!]!
  }

  extend type Query {
    getBriefs(size: Int, skip: Int, filters: BriefFiltersInput): BriefResponse!
    getBrief(id: ID!): Brief!
  }

  extend type Mutation {
    createBrief(input: CreateBriefInput!): Brief
    deleteBulkBrief(input: DeleteBulkBriefInput!): Boolean!
    deleteBrief(id: ID!): Boolean!
    updateBrief(id: ID!, input: UpdateBriefInput!): Brief!
  }
`

const resolvers: Resolvers = {
  Query: {
    // getBriefs,
    // getBrief
  },
  Mutation: {
    //     createBrief,
    //     deleteBrief,
    //     updateBrief,
    //     deleteBulkBrief
  }
  //   Brief: {
  //     totalBriefs: totalBriefs
  //   }
}
export default { typeDefs, resolvers }
