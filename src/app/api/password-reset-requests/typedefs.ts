import { gql } from 'graphql-tag';

export const passwordResetRequestTypeDefs = gql`
  scalar DateTime

  type PasswordResetRequest {
    id: ID!
    requestor: User
    createdAt: DateTime!
  }

  input PasswordResetRequestInput {
    name: String!
    accountId: String!
    email: String
    year: Int
    class: String
    number: Int
    role: UserRole!
  }

  input PasswordResetRequestFilterOptions {
    roles: [UserRole!]!
  }

  type PasswordResetRequestOffsetPaginationResponse {
    records: [PasswordResetRequest!]!
    pageInfo: OffsetPaginationPageInfo!
  }

  type Query {
    getPasswordResetRequests(
      paginationOptions: OffsetPaginationOptions!
      filterOptions: PasswordResetRequestFilterOptions!
    ): PasswordResetRequestOffsetPaginationResponse!
  }

  type Mutation {
    createPasswordResetRequest(input: PasswordResetRequestInput!): PasswordResetRequest!
  }
`;