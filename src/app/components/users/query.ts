import { gql } from "../../generated/gql";

export const approveUserMutation = gql(`
  mutation ApproveUser($approveUserId: ID!) {
    approveUser(id: $approveUserId)
  }
`);

export const denyUserMutation = gql(`
  mutation DenyUser($denyUserId: ID!) {
    denyUser(id: $denyUserId)
  }
`);

export const recoverUserMutation = gql(`
  mutation RecoverUser($recoverUserId: ID!) {
    recoverUser(id: $recoverUserId)
  }
`);

export const deleteUserMutation = gql(`
  mutation DeleteUser($deleteUserId: ID!) {
    deleteUser(id: $deleteUserId)
  }
`);
