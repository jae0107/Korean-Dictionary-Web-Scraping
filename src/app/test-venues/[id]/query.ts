import { gql } from "../../generated/gql";

export const singleTestVenueFragment = gql(`
  fragment SingleTestVenueItems on TestVenue {
    id
    year
    class
    pageFrom
    pageTo
    status
  }
`);

export const getSingleTestVenueQuery = gql(`
  query GetTestVenue($getTestVenueId: ID!) {
    getTestVenue(id: $getTestVenueId) {
      ...SingleTestVenueItems
    }
  }
`);