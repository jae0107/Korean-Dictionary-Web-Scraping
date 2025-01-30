import { gql } from "../generated/gql";

export const MyRequestFragment = gql(`
  fragment MyRequestItems on Word {
    id
    korDicResults
    naverDicResults
    title
    page
    example
    deniedReason
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