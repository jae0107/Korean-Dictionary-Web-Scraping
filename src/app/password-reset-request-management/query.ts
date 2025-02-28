import { gql } from "../generated/gql";

export const requestorFragment = gql(`
  fragment PasswordResetRequestorItems on User {
    id
    name
    role
    year
    class
    number
    accountId
  }
`);

export const passwordResetRequestFragment = gql(`
  fragment PasswordResetRequestItems on PasswordResetRequest {
    id
    requestor {
      ...PasswordResetRequestorItems
    }
  }
`);

export const getPasswordRequestsQuery = gql(`
  query GetPasswordResetRequests($paginationOptions: OffsetPaginationOptions!, $filterOptions: PasswordResetRequestFilterOptions!) {
    getPasswordResetRequests(paginationOptions: $paginationOptions, filterOptions: $filterOptions) {
      records {
        ...PasswordResetRequestItems
      }
      pageInfo {
        pageCount
        totalRowCount
      }
    }
  }
`);