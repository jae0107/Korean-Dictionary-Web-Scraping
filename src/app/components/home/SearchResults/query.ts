import { gql } from '../../../generated/gql';

export const wordByTitleFragment = gql(`
  fragment WordByTitleItems on Word {
    id
    pages
    title
    korDicResults
    naverDicResults
    examples
    status
  }
`);

export const createWordRequestMutation = gql(`
  mutation CreateWordRequest($input: WordInput!) {
    createWordRequest(input: $input) {
      id
    }
  }
`);

export const getWordByTitleQuery = gql(`
  query GetWordByTitle($title: String!) {
    getWordByTitle(title: $title) {
      ...WordByTitleItems
    }
  }
`);