import { gql } from "../../generated/gql";

export const singleStudentFragment = gql(`
  fragment SingleStudentItems on User {
    accountId
    name
    year
    class
    number
    role
  }
`);

export const getStudentQuery = gql(`
  query GetStudent($getUserId: ID!) {
    getUser(id: $getUserId) {
      ...SingleStudentItems
    }
  }
`);