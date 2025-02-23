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
  query FindMyPassword($accountId: String!) {
    findPassword(accountId: $accountId)
  }
`);