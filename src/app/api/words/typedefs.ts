import { gql } from 'graphql-tag';

export const wordTypeDefs = gql`
  enum WordStatus {
    APPROVED
    PENDING
    DUPLICATED
    DENIED
  }

  enum SortOptions {
    ASC
    DESC
  }

  input WordFilterOptions {
    status: WordStatus!
    word: String
    requestorId: ID
    year: Int
    class: String
    pageFrom: Int
    pageTo: Int
    titleSort: SortOptions
    pageSort: SortOptions
  }

  type Word {
    id: ID!
    title: String!
    status: WordStatus!
    previousStatus: WordStatus
    korDicResults: [String!]
    naverDicResults: [String!]
    pages: [Int]
    examples: [String!]
    deniedReason: String
    requestors: [User!]
    isMyVocabulary: Boolean
    wordId: ID
    createdAt: DateTime!
    originalWord: Word
  }

  input WordInput {
    title: String
    status: WordStatus
    korDicResults: [String!]
    naverDicResults: [String!]
    pages: [Int!]
    examples: [String!]
    deniedReason: String
    requestorIds: [ID!]
    wordId: ID
  }

  type WordOffsetPaginationResponse {
    records: [Word!]!
    pageInfo: OffsetPaginationPageInfo!
  }

  type Query {
    getWord(id: ID!): Word!
    getWordByTitle(title: String!): Word!
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
    bulkMigrationWords(inputs: [WordInput!]!): [Word!]!
    duplicateWordRequest(input: WordInput!): Word!
    updateWordRequest(id: ID!, input: WordInput!): Word!
    approveWordRequest(id: ID!): Boolean!
    approveDuplicatedWordRequest(id: ID!): Boolean!
    recoverWordRequest(id: ID!): Boolean!
    denyWordRequest(id: ID!, deniedReason: String): Boolean!
    deleteWordRequest(id: ID!): Boolean!
    bulkApproveWordRequests(ids: [ID!]!): Boolean!
    bulkRecoverWordRequests(ids: [ID!]!): Boolean!
    bulkDenyWordRequests(ids: [ID!]!): Boolean!
    bulkDeleteWordRequests(ids: [ID!]!): Boolean!
    updateDeniedReason(id: ID!, deniedReason: String): Word!
  }
`;