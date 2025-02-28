import { gql } from "../generated/gql";

export const userFragment = gql(`
  fragment UserItems on User {
    id
    accountId
  }
`);

export const getUsersQuery = gql(`
  query GetUsers($paginationOptions: OffsetPaginationOptions!, $filterOptions: UserFilterOptions!) {
    getUsers(paginationOptions: $paginationOptions, filterOptions: $filterOptions) {
      records {
        ...UserItems
      }
      pageInfo {
        totalRowCount
        pageCount
      }
    }
  }
`);

export const bulkCreateStudentMutation = gql(`
  mutation BulkCreateStudents($inputs: [UserInput!]!) {
    bulkCreateUsers(inputs: $inputs) {
      id
    }
  }
`);
