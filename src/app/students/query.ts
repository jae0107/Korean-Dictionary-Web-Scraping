import { gql } from "../generated/gql";

export const studentFragment = gql(`
  fragment StudentItems on User {
    id
    name
    year
    class
    number
    accountId
    status
    role
    status
    importedStatus
  }
`);

export const getStudentsQuery = gql(`
  query GetStudents($paginationOptions: OffsetPaginationOptions!, $filterOptions: UserFilterOptions!) {
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