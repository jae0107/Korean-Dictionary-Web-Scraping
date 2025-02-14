import { gql } from "../../../generated/gql";

export const changeCurrentPasswordMutation = gql(`
  mutation ChangeCurrentPassword($changeCurrentPasswordId: ID!, $input: FindPasswordInput!) {
    changeCurrentPassword(id: $changeCurrentPasswordId, input: $input) {
      id
    }
  }
`);
