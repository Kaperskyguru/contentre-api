import { Resolvers } from '@/types/modules'
import { gql } from 'apollo-server-express'
import getTopics from './queries/get-topics'
import getTopic from './queries/get-topic'
import createTopic from './mutations/create-topic'
import deleteTopic from './mutations/delete-topic'
import deleteBulkTopic from './mutations/delete-bulk-topic'
import updateTopic from './mutations/update-topic'
import totalContents from './fields/total-contents'
import totalAmount from './fields/total-amount'

const typeDefs = gql`
  type Topic {
    id: ID
    name: String!
    totalContents: Int
    totalAmount: Float
    userId: ID
    createdAt: Time!
    updatedAt: Time!
  }

  input DeleteBulkTopicInput {
    ids: [ID!]!
  }

  input CreateTopicInput {
    name: String!
  }

  input TopicFiltersInput {
    terms: String
    sortBy: String
    categoryIds: [ID!]
    topicIds: [ID!]
    duration: Int
    daily: Boolean
    tags: [String!]
    fromAmount: Float
    toAmount: Float
    categories: [String!]
    clients: [String!]
    fromDate: String
    toDate: String
    topics: [String!]
  }

  input UpdateTopicInput {
    name: String
  }

  type TopicResponse {
    meta: Meta!
    topics: [Topic!]!
  }

  extend type Query {
    getTopics(size: Int, skip: Int, filters: TopicFiltersInput): TopicResponse!
    getTopic(id: ID!): Topic!
    getTopicStats(filters: ContentFiltersInput): OverallStatResponse
  }

  extend type Mutation {
    createTopic(input: CreateTopicInput!): Topic
    deleteTopic(id: ID!): Boolean!
    updateTopic(id: ID!, input: UpdateTopicInput!): Topic!
    deleteBulkTopic(input: DeleteBulkTopicInput!): Boolean!
  }
`

const resolvers: Resolvers = {
  Query: {
    getTopics,
    getTopic
  },
  Mutation: {
    createTopic,
    updateTopic,
    deleteBulkTopic,
    deleteTopic
  },

  Topic: {
    totalContents: totalContents,
    totalAmount: totalAmount
  }
}
export default { typeDefs, resolvers }
