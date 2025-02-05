import { gql } from "../../../../generated/gql";

export const userRequestFragment = gql(`
  fragment UserRequestItems on Word {
    id
    korDicResults
    naverDicResults
    status
    title
    page
    example
    deniedReason
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