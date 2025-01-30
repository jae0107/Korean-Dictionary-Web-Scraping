import { gql } from "../generated/gql";

export const studentFragment = gql(`
  fragment StudentItems on User {
    id
    name
    year
    class
    number
    email
    status
  }
`);

export const getStudentsQuery = gql(`
  query GetUsers($paginationOptions: OffsetPaginationOptions!, $filterOptions: UserFilterOptions!) {
    getUsers(paginationOptions: $paginationOptions, filterOptions: $filterOptions) {
      records {
        ...StudentItems
      }
      pageInfo {
        totalRowCount
        pageCount
      }
    }
  }
`);