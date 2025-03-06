import { gql } from "../generated/gql";

export const VocabularyFragment = gql(`
  fragment VocabularyItems on Word {
    id
    isMyVocabulary
    korDicResults
    naverDicResults
    title
    pages
    examples
  }
`);

export const getVocabulariesQuery = gql(`
  query GetVocabularies($paginationOptions: OffsetPaginationOptions!, $filterOptions: WordFilterOptions!) {
    getWords(paginationOptions: $paginationOptions, filterOptions: $filterOptions) {
      records {
        ...VocabularyItems
      }
      pageInfo {
        totalRowCount
        pageCount
      }
    }
  }
`);