import { gql } from "../../../generated/gql";

export const addMyVocabularyMutation = gql(`
  mutation AddMyVocabulary($input: MyVocabularyInput!) {
    addMyVocabulary(input: $input) {
      id
    }
  }
`);

export const removeMyVocabularyMutation = gql(`
  mutation RemoveMyVocabulary($input: MyVocabularyInput!) {
    removeMyVocabulary(input: $input)
  }
`);