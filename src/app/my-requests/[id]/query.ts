import { gql } from "../../generated/gql";

export const myWordRequestFragment = gql(`
  fragment MyWordRequestItems on Word {
    id
    pages
    title
    korDicResults
    naverDicResults
    example
    originalWord {
      id
      pages
      title
      korDicResults
      naverDicResults
      example
    }
  }
`);

export const getMyWordRequestQuery = gql(`
  query GetMyWordRequest($getWordId: ID!) {
    getWord(id: $getWordId) {
      ...MyWordRequestItems
      status
      requestors {
        id
      }
    }
  }
`);