import { gql } from 'graphql-tag';

export const testVenueTypeDefs = gql`
  scalar DateTime

  enum TestVenueStatus {
    OPEN
    CLOSED
  }

  type TestVenue {
    id: ID!
    year: Int!
    class: String!
    pageFrom: Int
    pageTo: Int
    status: TestVenueStatus
    createdAt: DateTime
  }

  input TestVenueInput {
    year: Int!
    class: String!
    pageFrom: Int
    pageTo: Int
  }

  input TestVenueFilterOptions {
    year: Int
    class: String
    status: TestVenueStatus
  }

  type TestVenueOffsetPaginationResponse {
    records: [TestVenue!]!
    pageInfo: OffsetPaginationPageInfo!
  }

  type Query {
    getTestVenue(id: ID!): TestVenue!
    getTestVenues(
      paginationOptions: OffsetPaginationOptions!
      filterOptions: TestVenueFilterOptions
    ): TestVenueOffsetPaginationResponse!
  }

  type Mutation {
    createTestVenue(input: TestVenueInput!): TestVenue!
    updateTestVenue(id: ID!, input: TestVenueInput!): TestVenue!
    closeTestVenue(id: ID!): Boolean!
    restoreTestVenue(id: ID!): Boolean!
    deleteTestVenue(id: ID!): Boolean!
  }
`;