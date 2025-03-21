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

  enum UserImportedStatus {
    IMPORTED
    NOT_IMPORTED
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
    statuses: [UserStatus!]
    roles: [UserRole!]!
    userName: String
    importedStatus: UserImportedStatus
    nameSort: SortOptions
    year: Int
    class: String
  }

  input RequestorFilterOptions {
    userName: String
  }

  type UserTestResult {
    title: String
    testScore: Int!
  }

  type User {
    id: ID!
    name: String!
    email: String
    accountId: String!
    password: String
    year: Int
    class: String
    number: Int
    role: UserRole!
    status: UserStatus!
    previousStatus: UserStatus
    importedStatus: UserImportedStatus
    words: [Word!]
    approvedCount: Int
    myVocabCount: Int
    sessionVersion: Int
    createdAt: DateTime!
    testResults: [UserTestResult!]
  }

  input UserInput {
    name: String
    accountId: String
    year: Int
    class: String
    number: Int
    role: UserRole
    password: String
    email: String
  }

  input FindPasswordInput {
    currentPassword: String!
    newPassword: String!
  }

  input PasswordResetInput {
    password: String!
  }

  input FindMyIdInput {
    name: String!
    email: String
    year: Int
    class: String
    number: Int
    role: UserRole!
  }

  type UserOffsetPaginationResponse {
    records: [User!]!
    pageInfo: OffsetPaginationPageInfo!
    maxNumTest: Int
  }

  type Query {
    getCurrentUser(id: ID): User!
    getUsers(
      paginationOptions: OffsetPaginationOptions!
      filterOptions: UserFilterOptions!
      isUserStat: Boolean
    ): UserOffsetPaginationResponse!
    getUser(id: ID!): User!
    findPassword(accountId: String!): String!
    getRequestors(
      paginationOptions: OffsetPaginationOptions
      filterOptions: RequestorFilterOptions!
    ): UserOffsetPaginationResponse!
    accountIdCheck(accountId: String!): Boolean!
  }

  type Mutation {
    createUser(input: UserInput!): User!
    bulkCreateUsers(inputs: [UserInput!]!): [User!]!
    changeCurrentPassword(id: ID!, input: FindPasswordInput!): User!
    passwordSetUp(id: ID!, password: String!): User!
    passwordReset(id: ID!, password: String): User!
    bulkPasswordReset(ids: [ID!]!): Boolean!
    updateUser(id: ID!, input: UserInput!): User!
    approveUser(id: ID!): Boolean!
    bulkApproveUsers(ids: [ID!]!): Boolean!
    denyUser(id: ID!): Boolean!
    bulkDenyUsers(ids: [ID!]!): Boolean!
    recoverUser(id: ID!): Boolean!
    bulkRecoverUsers(ids: [ID!]!): Boolean!
    deleteUser(id: ID!): Boolean!
    bulkDeleteUsers(ids: [ID!]!): Boolean!
    findMyId(input: FindMyIdInput!): String!
  }
`;