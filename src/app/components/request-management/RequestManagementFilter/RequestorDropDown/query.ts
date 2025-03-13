import { gql } from "@/app/generated/gql";

export const requestorFragment = gql(`
  fragment RequestorDropDownItems on User {
    id
    name
  }
`);

export const getWordRequestsQuery = gql(`
  query GetRequestorsDropDown($paginationOptions: OffsetPaginationOptions, $filterOptions: RequestorFilterOptions!) {
    getRequestors(paginationOptions: $paginationOptions, filterOptions: $filterOptions) {
      records {
        ...RequestorDropDownItems
      }
      pageInfo {
        totalRowCount
        pageCount
      }
    }
  }
`);