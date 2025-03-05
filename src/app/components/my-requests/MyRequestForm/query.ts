import { gql } from "../../../generated/gql";

export const updateWordRequestMutation = gql(`
  mutation UpdateWordRequest($input: WordInput!) {
    updateWordRequest(input: $input) {
      id
    }
  }
`);