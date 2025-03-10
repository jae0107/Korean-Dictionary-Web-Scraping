import { gql } from "../../../generated/gql";

export const createTestResultMutation = gql(`
  mutation CreateTestResult($input: TestResultInput!) {
    createTestResult(input: $input)
  }
`);