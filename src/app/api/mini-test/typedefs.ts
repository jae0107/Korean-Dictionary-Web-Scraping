import { gql } from 'graphql-tag';

export const miniTestTypeDefs = gql`
  scalar DateTime

  type MiniTest {
    id: ID!
    correctAnswer: String!
    korDicResults: [String!]
    naverDicResults: [String!]
    options: [String!]!
  }

  input MiniTestFilterOptions {
    pageFrom: Int
    pageTo: Int
  }

  type Query {
    getMiniTests(
      filterOptions: MiniTestFilterOptions!
    ): [MiniTest!]!
  }
`;