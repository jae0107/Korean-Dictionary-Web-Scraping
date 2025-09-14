import { gql } from "../generated/gql";

export const ExistingVocabularyFragment = gql(`
  fragment ExistingVocabularyItems on Word {
    id
    title
  }
`);

export const getExistingVocabulariesQuery = gql(`
  query GetExistingVocabularies($paginationOptions: OffsetPaginationOptions!, $filterOptions: WordFilterOptions!) {
    getWords(paginationOptions: $paginationOptions, filterOptions: $filterOptions) {
      records {
        ...ExistingVocabularyItems
      }
      pageInfo {
        totalRowCount
        pageCount
      }
    }
  }
`);