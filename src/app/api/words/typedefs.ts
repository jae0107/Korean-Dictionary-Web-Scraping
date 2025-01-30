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
    korDicResults: [String!]
    naverDicResults: [String!]
    page: Int
    example: String
    deniedReason: String
    requestor: User!
    createdAt: DateTime!
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
`;