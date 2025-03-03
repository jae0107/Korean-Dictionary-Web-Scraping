import { gql } from '../../../../generated/gql';

export const duplicateWordRequestMutation = gql(`
  mutation DuplicateWordRequest($input: WordInput!) {
    duplicateWordRequest(input: $input) {
      id
    }
  }
`);