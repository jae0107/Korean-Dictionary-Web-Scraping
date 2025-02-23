import { gql } from "../../generated/gql";

export const singleAdminFragment = gql(`
  fragment SingleAdminItems on User {
    accountId
    name
    year
    class
    role
  }
`);

export const getAdminQuery = gql(`
  query GetAdmin($getUserId: ID!) {
    getUser(id: $getUserId) {
      ...SingleAdminItems
    }
  }
`);