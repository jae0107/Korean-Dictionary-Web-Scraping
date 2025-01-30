import { gql } from "../generated/gql";

export const myProfileFragment = gql(`
  fragment MyProfileItems on User {
    email
    name
    year
    class
    number
    role
  }
`);

export const getMyProfileQuery = gql(`
  query GetMyProfile {
    getCurrentUser {
      id
      ...MyProfileItems
    }
  }
`);