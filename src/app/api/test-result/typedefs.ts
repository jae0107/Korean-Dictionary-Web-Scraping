import { gql } from 'graphql-tag';

export const testResultTypeDefs = gql`
  scalar DateTime

  type TestResult {
    id: ID!
    testVenue: TestVenue
    user: User
    testScore: Int!
    createdAt: DateTime
  }

  input TestResultInput {
    testVenueId: ID!
    testScore: Int!
  }

  type Mutation {
    createTestResult(input: TestResultInput!): Boolean!
  }
`;