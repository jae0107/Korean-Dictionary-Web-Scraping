import { gql } from "../../../../generated/gql";

export const createUserMutation = gql(`
  mutation CreateUser($input: UserInput!) {
    createUser(input: $input) {
      id
    }
  }
`);
