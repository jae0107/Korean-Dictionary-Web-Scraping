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
    testResults {
      title
      testScore
    }
  }
`);

export const getUserStatsQuery = gql(`
  query GetUserStats($paginationOptions: OffsetPaginationOptions!, $filterOptions: UserFilterOptions!, $isUserStat: Boolean) {
    getUsers(paginationOptions: $paginationOptions, filterOptions: $filterOptions, isUserStat: $isUserStat) {
      records {
        ...UserStatItems
      }
      maxNumTest
      pageInfo {
        pageCount
        totalRowCount
      }
    }
  }
`);