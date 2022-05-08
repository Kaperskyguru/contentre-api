import { gql } from 'apollo-server-express'

const typeDefs = gql`
  type Topic {
    id: ID
    name: String!
    totalContents: Int
    totalAmount: Int
    userId: ID
    createdAt: Time!
    updatedAt: Time!
  }

  input CreateTopicInput {
    name: String!
  }

  input UpdateTopicInput {
    name: String
  }

  input TopicFiltersInput {
    terms: String
    sortBy: String
    all: Boolean
  }

  type TopicResponse {
    meta: Meta!
    Topics: [Topic!]!
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
  }
`
