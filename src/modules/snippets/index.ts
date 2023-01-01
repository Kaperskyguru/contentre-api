import { Resolvers } from '@/types/modules'
import { gql } from 'apollo-server-express'
import getSnippet from './queries/get-snippet'
import getSnippets from './queries/get-snippets'
import createSnippet from './mutations/create-snippet'
import deleteSnippet from './mutations/delete-snippet'
import updateSnippet from './mutations/update-snippet'
// import totalSnippets from './fields/total-notes'
import deleteBulkSnippet from './mutations/delete-bulk-snippet'

const typeDefs = gql`
  type Snippet {
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

  input CreateSnippetInput {
    title: String!
    content: String!
  }

  input UpdateSnippetInput {
    title: String
    content: String
    shareable: Boolean
    status: StatusType
  }

  input DeleteBulkSnippetInput {
    ids: [ID!]!
  }

  input SnippetFiltersInput {
    terms: String
    fromDate: String
    toDate: String
    sortBy: String
  }

  type SnippetResponse {
    meta: Meta!
    snippets: [Snippet!]!
  }

  extend type Query {
    getSnippets(
      size: Int
      skip: Int
      filters: SnippetFiltersInput
    ): SnippetResponse!
    getSnippet(id: ID!): Snippet!
  }

  extend type Mutation {
    createSnippet(input: CreateSnippetInput!): Snippet
    deleteBulkSnippet(input: DeleteBulkSnippetInput!): Boolean!
    deleteSnippet(id: ID!): Boolean!
    updateSnippet(id: ID!, input: UpdateSnippetInput!): Snippet!
  }
`

const resolvers: Resolvers = {
  Query: {
    getSnippets,
    getSnippet
  },
  Mutation: {
    createSnippet,
    deleteSnippet,
    updateSnippet,
    deleteBulkSnippet
  }
  //   Snippet: {
  //     totalSnippets: totalSnippets
  //   }
}
export default { typeDefs, resolvers }
