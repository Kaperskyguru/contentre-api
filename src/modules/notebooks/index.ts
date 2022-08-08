import { Resolvers } from '@/types/modules'
import { gql } from 'apollo-server-express'
import getNotebook from './queries/get-notebook'
import getNotebooks from './queries/get-notebooks'
import createNotebook from './mutations/create-notebook'
import deleteNotebook from './mutations/delete-notebook'
import updateNotebook from './mutations/update-notebook'
import totalNotes from './fields/total-notes'
import deleteBulkNotebook from './mutations/delete-bulk-notebook'
import createNote from './mutations/create-note'
import deleteNote from './mutations/delete-note'
import updateNote from './mutations/update-note'

import getNote from './queries/get-note'
import getNotes from './queries/get-notes'

const typeDefs = gql`
  type Notebook {
    id: ID
    name: String!
    totalNotes: Int
    userId: ID
    teamId: ID
    shareable: Boolean
    link: String
    createdAt: Time!
    updatedAt: Time!
  }

  type Note {
    id: ID
    title: String
    content: String
    shareLink: String
    userId: ID
    teamId: ID
    notebookId: ID
    shareable: Boolean
    link: String
    createdAt: Time!
    updatedAt: Time!
  }

  input CreateNotebookInput {
    name: String!
  }

  input CreateNoteInput {
    title: String
    content: String!
    notebookId: ID
  }

  input UpdateNotebookInput {
    name: String
    shareable: Boolean
  }

  input UpdateNoteInput {
    title: String
    content: String
    shareable: Boolean
    notebookId: ID
  }

  input DeleteBulkNotebookInput {
    ids: [ID!]!
  }

  input DeleteBulkNoteInput {
    ids: [ID!]!
  }

  input NotebookFiltersInput {
    terms: String
    sortBy: String
    all: Boolean
  }

  input NoteFiltersInput {
    terms: String
    notebookId: ID
    fromDate: String
    toDate: String
    sortBy: String
    all: Boolean
  }

  type NotebookResponse {
    meta: Meta!
    notebooks: [Notebook!]!
  }

  type NoteResponse {
    meta: Meta!
    notes: [Note!]!
  }

  extend type Query {
    getNotebooks(
      size: Int
      skip: Int
      filters: NotebookFiltersInput
    ): NotebookResponse!
    getNotebook(id: ID!): Notebook!

    getNotes(size: Int, skip: Int, filters: NoteFiltersInput): NoteResponse!
    getNote(id: ID!): Note!
  }

  extend type Mutation {
    createNotebook(input: CreateNotebookInput!): Notebook
    deleteNotebook(id: ID!): Boolean!
    updateNotebook(id: ID!, input: UpdateNotebookInput!): Notebook!
    deleteBulkNotebook(input: DeleteBulkNotebookInput!): Boolean!
    createNote(input: CreateNoteInput!): Note
    deleteBulkNote(input: DeleteBulkNoteInput!): Boolean!
    deleteNote(id: ID!): Boolean!
    updateNote(id: ID!, input: UpdateNoteInput!): Note!
  }
`

const resolvers: Resolvers = {
  Query: {
    getNotebooks,
    getNotebook,
    getNotes,
    getNote
  },
  Mutation: {
    createNotebook,
    deleteNotebook,
    updateNotebook,
    createNote,
    deleteNote,
    updateNote,
    deleteBulkNotebook
  },
  Notebook: {
    totalNotes: totalNotes
  }
}
export default { typeDefs, resolvers }
