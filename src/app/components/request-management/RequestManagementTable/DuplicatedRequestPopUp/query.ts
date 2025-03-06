import { gql } from '../../../../generated/gql';

export const duplicatedWordRequestFragment = gql(`
  fragment DuplicatedWordRequestItems on Word {
    id
    pages
    title
    korDicResults
    naverDicResults
    examples
    requestors {
      ...RequestorItems
    }
  }
`);

export const getWordQuery = gql(`
  query GetWord($getWordId: ID!) {
    getWord(id: $getWordId) {
      ...DuplicatedWordRequestItems
    }
  }
`);

export const approveDuplicatedWordRequestMutation = gql(`
  mutation ApproveDuplicatedWordRequest($approveDuplicatedWordRequestId: ID!) {
    approveDuplicatedWordRequest(id: $approveDuplicatedWordRequestId)
  }
`);