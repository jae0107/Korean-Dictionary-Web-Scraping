import { gql } from "../../../../generated/gql";

export const bulkAddMyVocabularyMutation = gql(`
  mutation BulkAddMyVocabulary($wordIds: [ID!]!) {
    bulkAddMyVocabulary(wordIds: $wordIds)
  }
`);