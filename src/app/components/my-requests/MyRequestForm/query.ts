import { gql } from "../../../generated/gql";

export const updateWordRequestMutation = gql(`
  mutation UpdateWordRequest($updateWordRequestId: ID!, $input: WordInput!) {
    updateWordRequest(id: $updateWordRequestId, input: $input) {
      id
    }
  }
`);