import { gql } from "../generated/gql";

export const miniTestFragment = gql(`
  fragment MiniTestItems on MiniTest {
    id
    correctAnswer
    korDicResults
    naverDicResults
    options
  }
`);

export const getMiniTestsQuery = gql(`
  query GetMiniTests($filterOptions: MiniTestFilterOptions!) {
    getMiniTests(filterOptions: $filterOptions) {
      ...MiniTestItems
    }
  }
`);