import { gql } from "../generated/gql";

export const testVenueFragment = gql(`
  fragment TestVenueItems on TestVenue {
    id
    year
    class
    pageFrom
    pageTo
  }
`);

export const getTestVenuesQuery = gql(`
  query GetTestVenues($paginationOptions: OffsetPaginationOptions!, $filterOptions: TestVenueFilterOptions) {
    getTestVenues(paginationOptions: $paginationOptions, filterOptions: $filterOptions) {
      records {
        ...TestVenueItems
      }
      pageInfo {
        pageCount
        totalRowCount
      }
    }
  }
`);