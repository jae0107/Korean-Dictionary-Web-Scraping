import { gql } from "../../generated/gql";

export const studentFragment = gql(`
  fragment SingleStudentItems on User {
    email
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