import { gql } from "../generated/gql";

export const MyRequestFragment = gql(`
  fragment MyRequestItems on Word {
    id
    korDicResults
    naverDicResults
    title
    pages
    example
    deniedReason
    wordId
  }
`);

export const getMyRequestsQuery = gql(`
  query GetMyRequests($paginationOptions: OffsetPaginationOptions!, $filterOptions: WordFilterOptions!) {
    getMyRequests(paginationOptions: $paginationOptions, filterOptions: $filterOptions) {
      records {
        ...MyRequestItems
      }
      pageInfo {
        totalRowCount
        pageCount
      }
    }
  }
`);