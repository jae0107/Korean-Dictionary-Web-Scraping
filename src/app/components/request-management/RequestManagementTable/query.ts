import { gql } from '../../../generated/gql';

export const approveWordRequestMutation = gql(`
  mutation ApproveWordRequest($approveWordRequestId: ID!) {
    approveWordRequest(id: $approveWordRequestId)
  }
`);

export const denyWordRequestMutation = gql(`
  mutation DenyWordRequest($denyWordRequestId: ID!, $deniedReason: String) {
    denyWordRequest(id: $denyWordRequestId, deniedReason: $deniedReason)
  }
`);

export const recoverWordRequestMutation = gql(`
  mutation RecoverWordRequest($recoverWordRequestId: ID!) {
    recoverWordRequest(id: $recoverWordRequestId)
  }
`);

export const deleteWordRequestMutation = gql(`
  mutation DeleteWordRequest($deleteWordRequestId: ID!) {
    deleteWordRequest(id: $deleteWordRequestId)
  }
`);

export const updateDeniedReasonMutation = gql(`
  mutation UpdateDeniedReason($updateDeniedReasonId: ID!, $deniedReason: String) {
    updateDeniedReason(id: $updateDeniedReasonId, deniedReason: $deniedReason) {
      id
      deniedReason
    }
  }
`);