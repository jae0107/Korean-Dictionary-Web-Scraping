import { gql } from "../generated/gql";

export const adminFragment = gql(`
  fragment AdminItems on User {
    id
    name
    year
    class
    email
    status
    role
  }
`);

export const getAdminsQuery = gql(`
  query GetAdmins($paginationOptions: OffsetPaginationOptions!, $filterOptions: UserFilterOptions!) {
    getUsers(paginationOptions: $paginationOptions, filterOptions: $filterOptions) {
      records {
        ...AdminItems
      }
      pageInfo {
        totalRowCount
        pageCount
      }
    }
  }
`);