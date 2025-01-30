/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
const documents = {
    "\n  query GetMyRole {\n    getCurrentUser {\n      role\n    }\n  }\n": types.GetMyRoleDocument,
    "\n  fragment RequestorDropDownItems on User {\n    id\n    name\n  }\n": types.RequestorDropDownItemsFragmentDoc,
    "\n  query GetRequestorsDropDown($paginationOptions: OffsetPaginationOptions!, $filterOptions: RequestorFilterOptions!) {\n    getRequestors(paginationOptions: $paginationOptions, filterOptions: $filterOptions) {\n      records {\n        ...RequestorDropDownItems\n      }\n      pageInfo {\n        totalRowCount\n        pageCount\n      }\n    }\n  }\n": types.GetRequestorsDropDownDocument,
    "\n  fragment MyRequestItems on Word {\n    id\n    korDicResults\n    naverDicResults\n    title\n    page\n    example\n    deniedReason\n  }\n": types.MyRequestItemsFragmentDoc,
    "\n  query GetMyRequests($paginationOptions: OffsetPaginationOptions!, $filterOptions: WordFilterOptions!) {\n    getMyRequests(paginationOptions: $paginationOptions, filterOptions: $filterOptions) {\n      records {\n        ...MyRequestItems\n      }\n      pageInfo {\n        totalRowCount\n        pageCount\n      }\n    }\n  }\n": types.GetMyRequestsDocument,
    "\n  fragment MyProfileItems on User {\n    email\n    name\n    year\n    class\n    number\n    role\n  }\n": types.MyProfileItemsFragmentDoc,
    "\n  query GetMyProfile {\n    getCurrentUser {\n      id\n      ...MyProfileItems\n    }\n  }\n": types.GetMyProfileDocument,
    "\n  fragment RequestorItems on User {\n    id\n    name\n    role\n    year\n    class\n    number\n    email\n  }\n": types.RequestorItemsFragmentDoc,
    "\n  fragment WordRequestItems on Word {\n    id\n    requestor {\n      ...RequestorItems\n    }\n    korDicResults\n    naverDicResults\n    status\n    title\n    page\n    example\n    deniedReason\n    createdAt\n  }\n": types.WordRequestItemsFragmentDoc,
    "\n  query GetWordRequests($paginationOptions: OffsetPaginationOptions!, $filterOptions: WordFilterOptions!) {\n    getWords(paginationOptions: $paginationOptions, filterOptions: $filterOptions) {\n      records {\n        ...WordRequestItems\n      }\n      pageInfo {\n        totalRowCount\n        pageCount\n      }\n    }\n  }\n": types.GetWordRequestsDocument,
    "\n  fragment VocabularyItems on Word {\n    id\n    korDicResults\n    naverDicResults\n    title\n    page\n    example\n  }\n": types.VocabularyItemsFragmentDoc,
    "\n  query GetVocabularies($paginationOptions: OffsetPaginationOptions!, $filterOptions: WordFilterOptions!) {\n    getWords(paginationOptions: $paginationOptions, filterOptions: $filterOptions) {\n      records {\n        ...VocabularyItems\n      }\n      pageInfo {\n        totalRowCount\n        pageCount\n      }\n    }\n  }\n": types.GetVocabulariesDocument,
};

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function gql(source: string): unknown;

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetMyRole {\n    getCurrentUser {\n      role\n    }\n  }\n"): (typeof documents)["\n  query GetMyRole {\n    getCurrentUser {\n      role\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  fragment RequestorDropDownItems on User {\n    id\n    name\n  }\n"): (typeof documents)["\n  fragment RequestorDropDownItems on User {\n    id\n    name\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetRequestorsDropDown($paginationOptions: OffsetPaginationOptions!, $filterOptions: RequestorFilterOptions!) {\n    getRequestors(paginationOptions: $paginationOptions, filterOptions: $filterOptions) {\n      records {\n        ...RequestorDropDownItems\n      }\n      pageInfo {\n        totalRowCount\n        pageCount\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetRequestorsDropDown($paginationOptions: OffsetPaginationOptions!, $filterOptions: RequestorFilterOptions!) {\n    getRequestors(paginationOptions: $paginationOptions, filterOptions: $filterOptions) {\n      records {\n        ...RequestorDropDownItems\n      }\n      pageInfo {\n        totalRowCount\n        pageCount\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  fragment MyRequestItems on Word {\n    id\n    korDicResults\n    naverDicResults\n    title\n    page\n    example\n    deniedReason\n  }\n"): (typeof documents)["\n  fragment MyRequestItems on Word {\n    id\n    korDicResults\n    naverDicResults\n    title\n    page\n    example\n    deniedReason\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetMyRequests($paginationOptions: OffsetPaginationOptions!, $filterOptions: WordFilterOptions!) {\n    getMyRequests(paginationOptions: $paginationOptions, filterOptions: $filterOptions) {\n      records {\n        ...MyRequestItems\n      }\n      pageInfo {\n        totalRowCount\n        pageCount\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetMyRequests($paginationOptions: OffsetPaginationOptions!, $filterOptions: WordFilterOptions!) {\n    getMyRequests(paginationOptions: $paginationOptions, filterOptions: $filterOptions) {\n      records {\n        ...MyRequestItems\n      }\n      pageInfo {\n        totalRowCount\n        pageCount\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  fragment MyProfileItems on User {\n    email\n    name\n    year\n    class\n    number\n    role\n  }\n"): (typeof documents)["\n  fragment MyProfileItems on User {\n    email\n    name\n    year\n    class\n    number\n    role\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetMyProfile {\n    getCurrentUser {\n      id\n      ...MyProfileItems\n    }\n  }\n"): (typeof documents)["\n  query GetMyProfile {\n    getCurrentUser {\n      id\n      ...MyProfileItems\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  fragment RequestorItems on User {\n    id\n    name\n    role\n    year\n    class\n    number\n    email\n  }\n"): (typeof documents)["\n  fragment RequestorItems on User {\n    id\n    name\n    role\n    year\n    class\n    number\n    email\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  fragment WordRequestItems on Word {\n    id\n    requestor {\n      ...RequestorItems\n    }\n    korDicResults\n    naverDicResults\n    status\n    title\n    page\n    example\n    deniedReason\n    createdAt\n  }\n"): (typeof documents)["\n  fragment WordRequestItems on Word {\n    id\n    requestor {\n      ...RequestorItems\n    }\n    korDicResults\n    naverDicResults\n    status\n    title\n    page\n    example\n    deniedReason\n    createdAt\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetWordRequests($paginationOptions: OffsetPaginationOptions!, $filterOptions: WordFilterOptions!) {\n    getWords(paginationOptions: $paginationOptions, filterOptions: $filterOptions) {\n      records {\n        ...WordRequestItems\n      }\n      pageInfo {\n        totalRowCount\n        pageCount\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetWordRequests($paginationOptions: OffsetPaginationOptions!, $filterOptions: WordFilterOptions!) {\n    getWords(paginationOptions: $paginationOptions, filterOptions: $filterOptions) {\n      records {\n        ...WordRequestItems\n      }\n      pageInfo {\n        totalRowCount\n        pageCount\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  fragment VocabularyItems on Word {\n    id\n    korDicResults\n    naverDicResults\n    title\n    page\n    example\n  }\n"): (typeof documents)["\n  fragment VocabularyItems on Word {\n    id\n    korDicResults\n    naverDicResults\n    title\n    page\n    example\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetVocabularies($paginationOptions: OffsetPaginationOptions!, $filterOptions: WordFilterOptions!) {\n    getWords(paginationOptions: $paginationOptions, filterOptions: $filterOptions) {\n      records {\n        ...VocabularyItems\n      }\n      pageInfo {\n        totalRowCount\n        pageCount\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetVocabularies($paginationOptions: OffsetPaginationOptions!, $filterOptions: WordFilterOptions!) {\n    getWords(paginationOptions: $paginationOptions, filterOptions: $filterOptions) {\n      records {\n        ...VocabularyItems\n      }\n      pageInfo {\n        totalRowCount\n        pageCount\n      }\n    }\n  }\n"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;