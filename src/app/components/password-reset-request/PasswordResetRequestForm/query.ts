import { gql } from "../../../generated/gql";

export const createPasswordResetRequestMutation = gql(`
  mutation CreatePasswordResetRequest($input: PasswordResetRequestInput!) {
    createPasswordResetRequest(input: $input) {
      id
    }
  }
`);

export const sendPasswordResetEmailMutation = gql(`
  mutation SendPasswordResetEmail($input: PasswordResetEmailInput!) {
    sendPasswordResetEmail(input: $input)
  }
`);
