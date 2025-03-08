import { gql } from "../generated/gql";

export const userStatFragment = gql(`
  fragment UserStatItems on User {
    id
    name
    year
    class
    number
    approvedCount
    myVocabCount
  }
`);

export const getUserStatsQuery = gql(`
  query GetUserStats($paginationOptions: OffsetPaginationOptions!, $filterOptions: UserFilterOptions!) {
    getUsers(paginationOptions: $paginationOptions, filterOptions: $filterOptions) {
      records {
        ...UserStatItems
      }
      pageInfo {
        pageCount
        totalRowCount
      }
    }
  }
`);