import { gql } from "../../../generated/gql";

export const bulkApproveUserMutation = gql(`
  mutation BulkApproveUsers($ids: [ID!]!) {
    bulkApproveUsers(ids: $ids)
  }
`);

export const bulkDenyUserMutation = gql(`
  mutation BulkDenyUsers($ids: [ID!]!) {
    bulkDenyUsers(ids: $ids)
  }
`);

export const bulkRecoverUserMutation = gql(`
  mutation BulkRecoverUsers($ids: [ID!]!) {
    bulkRecoverUsers(ids: $ids)
  }
`);

export const bulkDeleteUserMutation = gql(`
  mutation BulkDeleteUsers($ids: [ID!]!) {
    bulkDeleteUsers(ids: $ids)
  }
`);