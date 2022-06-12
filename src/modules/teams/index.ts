import { Resolvers } from '@modules-types'
import { gql } from 'apollo-server-express'
// import TeamAvatarURL from './fields/Team-avatar-url'
// import TeamContact from './fields/Team-contact'
// import memberAvatarURL from './fields/member-avatar-url'
// import createTeam from './mutations/create-Team'
// import createLegalEntity from './mutations/create-legalEntity'
// import deleteTeam from './mutations/delete-Team'
// import deleteLegalEntity from './mutations/delete-legalEntity'
// import switchTeam from './mutations/switch-Team'
// import switchLegalEntity from './mutations/switch-legalEntity'
// import updateActiveTeam from './mutations/update-active-Team'
// import updateLegalEntity from './mutations/update-legalEntity'
// import getTeams from './queries/get-Teams'
// import getLegalEntities from './queries/get-legalEntities'
// import getLegalEntity from './queries/get-legalEntity'
import getMembers from './queries/get-members'

const typeDefs = gql`
  type Team {
    id: ID!
    name: String!
    avatarURL: String
    createdAt: Time!
    updatedAt: Time!
  }

  type Member {
    id: ID!
    email: String!
    name: String
    username: String
    phoneNumber: String
    avatarURL: String
    createdAt: Time!
    updatedAt: Time!
    lastActivityAt: Time!
    role: MemberRole!
    team: Team
  }

  enum MemberRole {
    ADMIN
    MEMBER
  }

  type Country {
    code: String!
    name: String!
  }

  input CreateTeamInput {
    name: String
  }

  input TeamInput {
    name: String
    avatarURL: String
  }

  input CountryInput {
    code: String!
    name: String
  }

  input LegalEntityInput {
    countryCode: String
    name: String
  }

  input TeamAdminsRelation {
    connect: [ID]
    disconnect: [ID]
  }

  input TeamMembersRelation {
    connect: [ID]
    disconnect: [ID]
  }

  # Extensions #

  extend type User {
    activeTeam: Team
    activeTeamId: String
    teams: [Team!]
    activeRole: MemberRole
  }

  extend input UserInput {
    activeTeam: UserActiveTeamRelation
    teams: UserTeamsRelation
  }

  input UserActiveTeamRelation {
    create: CreateTeamInput
    connect: ID
    disconnect: Boolean
  }

  input UserTeamsRelation {
    create: [CreateTeamInput]
    connect: [ID]
    disconnect: [ID]
  }

  extend type Query {
    getMembers(contains: String): [Member!]
    getTeams: [Team!]!
  }

  extend type Mutation {
    createTeam(input: CreateTeamInput!): Team!
    deleteTeam(id: ID!): User!
    switchTeam(id: ID!): Team!
    updateActiveTeam(input: TeamInput!): Team!
  }
`
// union MemberOrInvite = Member | Invite
const resolvers: Resolvers = {
  Query: {
    //     getTeams,
    //     getLegalEntities,
    //     getLegalEntity,
    getMembers
  },
  Mutation: {
    //     createTeam,
    //     createLegalEntity,
    //     deleteTeam,
    //     deleteLegalEntity,
    //     switchTeam,
    //     switchLegalEntity,
    //     updateActiveTeam,
    //     updateLegalEntity
  }
  //   Team: {
  //     avatarURL: TeamAvatarURL,
  //     contact: TeamContact
  //   },
  //   Member: {
  //     avatarURL: memberAvatarURL
  //   },
  //   MemberOrInvite: {
  //     __resolveType: (obj: Member | Invite): 'Member' | 'Invite' => {
  //       if ('acceptedAt' in (obj as Invite)) {
  //         return 'Invite'
  //       }
  //       return 'Member'
  //     }
  //   }
}

export default { typeDefs, resolvers }
