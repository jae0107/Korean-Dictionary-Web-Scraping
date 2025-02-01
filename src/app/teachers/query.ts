import { gql } from "../generated/gql";

export const teacherFragment = gql(`
  fragment TeacherItems on User {
    id
    name
    year
    class
    email
    status
  }
`);

export const getTeachersQuery = gql(`
  query GetTeachers($paginationOptions: OffsetPaginationOptions!, $filterOptions: UserFilterOptions!) {
    getUsers(paginationOptions: $paginationOptions, filterOptions: $filterOptions) {
      records {
        ...TeacherItems
      }
      pageInfo {
        totalRowCount
        pageCount
      }
    }
  }
`);