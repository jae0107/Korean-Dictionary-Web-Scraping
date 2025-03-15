import { gql } from "../generated/gql";

export const bulkMigrationWordsMutation = gql(`
  mutation BulkMigrationWords($inputs: [WordInput!]!) {
    bulkMigrationWords(inputs: $inputs) {
      id
    }
  }
`);