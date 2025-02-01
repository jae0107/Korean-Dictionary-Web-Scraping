import { gql } from "../../generated/gql";

export const singleTeacherFragment = gql(`
  fragment SingleTeacherItems on User {
    email
    name
    year
    class
    role
  }
`);

export const getTeacherQuery = gql(`
  query GetTeacher($getUserId: ID!) {
    getUser(id: $getUserId) {
      ...SingleTeacherItems
    }
  }
`);