import { gql } from '../../../generated/gql';

export const createTestVenueMutation = gql(`
  mutation CreateTestVenue($input: TestVenueInput!) {
    createTestVenue(input: $input) {
      id
    }
  }
`);