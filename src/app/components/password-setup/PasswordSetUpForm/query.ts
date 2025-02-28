import { gql } from "../../../generated/gql";

export const passwordSetUpMutation = gql(`
  mutation PasswordSetUp($passwordSetUpId: ID!, $password: String!) {
    passwordSetUp(id: $passwordSetUpId, password: $password) {
      id
    }
  }
`);
