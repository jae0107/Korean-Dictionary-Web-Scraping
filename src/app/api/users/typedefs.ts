import { gql } from 'graphql-tag';

export const userTypeDefs = gql`
  scalar DateTime
  
  enum UserStatus {
    APPROVED
    PENDING
    DENIED
  }

  enum UserRole {
    STUDENT
    TEACHER
    ADMIN
    SUPERADMIN
  }

  type OffsetPaginationPageInfo {
    totalRowCount: Int!
    pageCount: Int!
  }

  input OffsetPaginationOptions {
    pageNum: Int!
    limit: Int!
  }

  input UserFilterOptions {
    status: UserStatus!
    roles: [UserRole!]!
    userName: String
  }

  input RequestorFilterOptions {
    userName: String
  }

  type User {
    id: ID!
    name: String!
    accountId: String!
    password: String
    year: Int
    class: String
    number: Int
    role: UserRole!
    status: UserStatus!
    words: [Word!]
    createdAt: DateTime!
  }

  input UserInput {
    name: String
    accountId: String
    year: Int
    class: String
    number: Int
    role: UserRole
    password: String
  }

  input FindPasswordInput {
    currentPassword: String!
    newPassword: String!
  }

  input PasswordResetInput {
    accountId: String!
    password: String!
  }

  type UserOffsetPaginationResponse {
    records: [User!]!
    pageInfo: OffsetPaginationPageInfo!
  }

  type Query {
    getCurrentUser(id: ID): User!
    getUsers(
      paginationOptions: OffsetPaginationOptions!
      filterOptions: UserFilterOptions!
    ): UserOffsetPaginationResponse!
    getUser(id: ID!): User!
    findPassword(accountId: String!): String!
    getRequestors(
      paginationOptions: OffsetPaginationOptions!
      filterOptions: RequestorFilterOptions!
    ): UserOffsetPaginationResponse!
    accountIdCheck(accountId: String!): Boolean!
  }

  type Mutation {
    createUser(input: UserInput!): User!
    changeCurrentPassword(id: ID!, input: FindPasswordInput!): User!
    passwordReset(input: PasswordResetInput!): User!
    updateUser(id: ID!, input: UserInput!): User!
    approveUser(id: ID!): Boolean!
    bulkApproveUsers(ids: [ID!]!): Boolean!
    denyUser(id: ID!): Boolean!
    bulkDenyUsers(ids: [ID!]!): Boolean!
    recoverUser(id: ID!): Boolean!
    bulkRecoverUsers(ids: [ID!]!): Boolean!
    deleteUser(id: ID!): Boolean!
    bulkDeleteUsers(ids: [ID!]!): Boolean!
  }
`;