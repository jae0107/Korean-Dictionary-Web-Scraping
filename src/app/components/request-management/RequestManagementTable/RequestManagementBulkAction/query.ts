import { gql } from '../../../../generated/gql';

export const bulkApproveWordRequestMutation = gql(`
  mutation BulkApproveWordRequests($ids: [ID!]!) {
    bulkApproveWordRequests(ids: $ids)
  }
`);

export const bulkDenyWordRequestMutation = gql(`
  mutation BulkDenyWordRequests($ids: [ID!]!) {
    bulkDenyWordRequests(ids: $ids)
  }
`);

export const bulkRecoverWordRequestMutation = gql(`
  mutation BulkRecoverWordRequests($ids: [ID!]!) {
    bulkRecoverWordRequests(ids: $ids)
  }
`);

export const bulkDeleteWordRequestMutation = gql(`
  mutation BulkDeleteWordRequests($ids: [ID!]!) {
    bulkDeleteWordRequests(ids: $ids)
  }
`);