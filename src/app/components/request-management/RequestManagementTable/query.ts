import { gql } from '../../../generated/gql';

export const approveWordRequestMutation = gql(`
  mutation ApproveWordRequest($approveWordRequestId: ID!) {
    approveWordRequest(id: $approveWordRequestId)
  }
`);

export const denyWordRequestMutation = gql(`
  mutation DenyWordRequest($denyWordRequestId: ID!) {
    denyWordRequest(id: $denyWordRequestId)
  }
`);

export const deleteWordRequestMutation = gql(`
  mutation DeleteWordRequest($deleteWordRequestId: ID!) {
    deleteWordRequest(id: $deleteWordRequestId)
  }
`);