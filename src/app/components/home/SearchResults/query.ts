import { gql } from '../../../generated/gql';

export const createWordRequestMutation = gql(`
  mutation CreateWordRequest($input: WordInput!) {
    createWordRequest(input: $input) {
      id
    }
  }
`);