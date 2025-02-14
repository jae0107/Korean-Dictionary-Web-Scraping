import { gql } from "../generated/gql";

export const getMyPasswordQuery = gql(`
  query GetMyPassword {
    getCurrentUser {
      id
      password
    }
  }
`);

export const findMyPasswordQuery = gql(`
  query FindMyPassword($email: String!) {
    findPassword(email: $email)
  }
`);