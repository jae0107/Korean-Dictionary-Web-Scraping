import { gql } from 'graphql-tag';

export const wordTypeDefs = gql`
  enum WordStatus {
    APPROVED
    PENDING
    DENIED
  }

  input WordFilterOptions {
    status: WordStatus!
    word: String
    requestorId: ID
    year: Int
    class: String
  }

  type Word {
    id: ID!
    title: String!
    status: WordStatus!
    previousStatus: WordStatus
    korDicResults: [String!]
    naverDicResults: [String!]
    page: Int
    example: String
    deniedReason: String
    requestor: User!
    createdAt: DateTime!
  }

  input WordInput {
    title: String
    status: WordStatus
    korDicResults: [String!]
    naverDicResults: [String!]
    page: Int
    example: String
    deniedReason: String
    requestorId: ID
  }

  type WordOffsetPaginationResponse {
    records: [Word!]!
    pageInfo: OffsetPaginationPageInfo!
  }

  type Query {
    getWords(
      paginationOptions: OffsetPaginationOptions!
      filterOptions: WordFilterOptions!
    ): WordOffsetPaginationResponse!
    getMyRequests(
      paginationOptions: OffsetPaginationOptions!
      filterOptions: WordFilterOptions!
    ): WordOffsetPaginationResponse!
  }

  type Mutation {
    createWordRequest(input: WordInput!): Word!
    approveWordRequest(id: ID!): Boolean!
    recoverWordRequest(id: ID!): Boolean!
    denyWordRequest(id: ID!): Boolean!
    deleteWordRequest(id: ID!): Boolean!
    bulkApproveWordRequests(ids: [ID!]!): Boolean!
    bulkRecoverWordRequests(ids: [ID!]!): Boolean!
    bulkDenyWordRequests(ids: [ID!]!): Boolean!
    bulkDeleteWordRequests(ids: [ID!]!): Boolean!
  }
`;