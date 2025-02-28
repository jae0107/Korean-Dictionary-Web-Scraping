import { gql } from "../../../generated/gql";

export const passwordResetMutation = gql(`
  mutation PasswordReset($passwordResetId: ID!, $password: String) {
    passwordReset(id: $passwordResetId, password: $password) {
      id
    }
  }
`);
