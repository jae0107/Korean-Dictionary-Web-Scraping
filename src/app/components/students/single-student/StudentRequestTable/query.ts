import { gql } from "../../../../generated/gql";

export const studentRequestFragment = gql(`
  fragment StudentRequestItems on Word {
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

export const getStudentRequestsQuery = gql(`
  query GetStudentRequests($paginationOptions: OffsetPaginationOptions!, $filterOptions: WordFilterOptions!) {
    getWords(paginationOptions: $paginationOptions, filterOptions: $filterOptions) {
      records {
        ...StudentRequestItems
      }
      pageInfo {
        totalRowCount
        pageCount
      }
    }
  }
`);