import { gql } from '../../../generated/gql'

export const updateTestVenueMutation = gql(`
  mutation UpdateTestVenue($updateTestVenueId: ID!, $input: TestVenueInput!) {
    updateTestVenue(id: $updateTestVenueId, input: $input) {
      id
    }
  }
`);

export const openTestVenueMutation = gql(`
  mutation OpenTestVenue($openTestVenueId: ID!) {
    openTestVenue(id: $openTestVenueId)
  }
`);

export const closeTestVenueMutation = gql(`
  mutation CloseTestVenue($closeTestVenueId: ID!) {
    closeTestVenue(id: $closeTestVenueId)
  }
`);

export const deleteTestVenueMutation = gql(`
  mutation DeleteTestVenue($deleteTestVenueId: ID!) {
    deleteTestVenue(id: $deleteTestVenueId)
  }
`);

export const restoreTestVenueMutation = gql(`
  mutation RestoreTestVenue($restoreTestVenueId: ID!) {
    restoreTestVenue(id: $restoreTestVenueId)
  }
`);