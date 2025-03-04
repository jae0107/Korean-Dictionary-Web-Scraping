import { gql } from "../../../../generated/gql";

export const userRequestFragment = gql(`
  fragment UserRequestItems on Word {
    id
    korDicResults
    naverDicResults
    status
    title
    pages
    example
    deniedReason
    wordId
  }
`);

export const getUserRequestsQuery = gql(`
  query GetUserRequests($paginationOptions: OffsetPaginationOptions!, $filterOptions: WordFilterOptions!) {
    getWords(paginationOptions: $paginationOptions, filterOptions: $filterOptions) {
      records {
        ...UserRequestItems
      }
      pageInfo {
        totalRowCount
        pageCount
      }
    }
  }
`);