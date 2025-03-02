import { gql } from "../generated/gql";

export const MyVocabularyFragment = gql(`
  fragment MyVocabularyItems on Word {
    id
    pages
    title
    korDicResults
    naverDicResults
    example
  }
`);

export const getMyVocabulariesQuery = gql(`
  query GetMyVocabularies($paginationOptions: OffsetPaginationOptions!, $filterOptions: MyVocabularyFilterOptions!) {
    getMyVocabularies(paginationOptions: $paginationOptions, filterOptions: $filterOptions) {
      records {
        word {
          ...MyVocabularyItems
        }
      }
      pageInfo {
        pageCount
        totalRowCount
      }
    }
  }
`);