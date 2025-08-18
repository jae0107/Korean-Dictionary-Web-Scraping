import { gql } from 'graphql-tag';

export const myVocabularyTypeDefs = gql`
  scalar DateTime

  type MyVocabulary {
    id: ID!
    user: User!
    word: Word!
    createdAt: DateTime!
  }

  input MyVocabularyInput {
    userId: ID
    wordId: ID!
  }

  input MyVocabularyFilterOptions {
    word: String
    userId: ID
    page: Int
    titleSort: SortOptions
    pageSort: SortOptions
  }

  type MyVocabularyOffsetPaginationResponse {
    records: [MyVocabulary!]!
    pageInfo: OffsetPaginationPageInfo!
  }

  type Query {
    getMyVocabularies(
      paginationOptions: OffsetPaginationOptions!
      filterOptions: MyVocabularyFilterOptions!
    ): MyVocabularyOffsetPaginationResponse!
  }

  type Mutation {
    addMyVocabulary(input: MyVocabularyInput!): MyVocabulary!
    bulkAddMyVocabulary(wordIds: [ID!]!): Boolean!
    removeMyVocabulary(input: MyVocabularyInput!): Boolean!
  }
`;