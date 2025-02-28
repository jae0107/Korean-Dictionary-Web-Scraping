import { gql } from '../../../generated/gql';

export const findMyIdMutation = gql(`
  mutation FindMyId($input: FindMyIdInput!) {
    findMyId(input: $input)
  }
`);