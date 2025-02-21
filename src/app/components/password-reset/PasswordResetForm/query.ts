import { gql } from "../../../generated/gql";

export const passwordResetMutation = gql(`
  mutation PasswordReset($input: PasswordResetInput!) {
    passwordReset(input: $input) {
      id
    }
  }
`);
