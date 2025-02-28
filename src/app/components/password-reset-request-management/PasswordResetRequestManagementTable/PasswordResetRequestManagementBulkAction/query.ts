import { gql } from "../../../../generated/gql";

export const bulkPasswordResetMutation = gql(`
  mutation BulkPasswordReset($ids: [ID!]!) {
    bulkPasswordReset(ids: $ids)
  }
`);
