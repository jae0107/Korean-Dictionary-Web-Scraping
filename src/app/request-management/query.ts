import { gql } from "../generated/gql";

export const requestorFragment = gql(`
  fragment RequestorItems on User {
    id
    name
    role
    year
    class
    number
    accountId
  }
`);

export const wordRequestFragment = gql(`
  fragment WordRequestItems on Word {
    id
    requestors {
      ...RequestorItems
    }
    korDicResults
    naverDicResults
    status
    title
    pages
    examples
    deniedReason
    wordId
  }
`);

export const getWordRequestsQuery = gql(`
  query GetWordRequests($paginationOptions: OffsetPaginationOptions!, $filterOptions: WordFilterOptions!) {
    getWords(paginationOptions: $paginationOptions, filterOptions: $filterOptions) {
      records {
        ...WordRequestItems
      }
      pageInfo {
        totalRowCount
        pageCount
      }
    }
  }
`);