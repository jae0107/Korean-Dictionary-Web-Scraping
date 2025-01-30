/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: any; output: any; }
};

export type OffsetPaginationOptions = {
  limit: Scalars['Int']['input'];
  pageNum: Scalars['Int']['input'];
};

export type OffsetPaginationPageInfo = {
  __typename: 'OffsetPaginationPageInfo';
  pageCount: Scalars['Int']['output'];
  totalRowCount: Scalars['Int']['output'];
};

export type Query = {
  __typename: 'Query';
  getCurrentUser: User;
  getMyRequests: WordOffsetPaginationResponse;
  getRequestors: UserOffsetPaginationResponse;
  getUser: User;
  getUsers: UserOffsetPaginationResponse;
  getWords: WordOffsetPaginationResponse;
};


export type QueryGetCurrentUserArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryGetMyRequestsArgs = {
  filterOptions: WordFilterOptions;
  paginationOptions: OffsetPaginationOptions;
};


export type QueryGetRequestorsArgs = {
  filterOptions: RequestorFilterOptions;
  paginationOptions: OffsetPaginationOptions;
};


export type QueryGetUserArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetUsersArgs = {
  filterOptions: UserFilterOptions;
  paginationOptions: OffsetPaginationOptions;
};


export type QueryGetWordsArgs = {
  filterOptions: WordFilterOptions;
  paginationOptions: OffsetPaginationOptions;
};

export type RequestorFilterOptions = {
  userName?: InputMaybe<Scalars['String']['input']>;
};

export type User = {
  __typename: 'User';
  class?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  number?: Maybe<Scalars['Int']['output']>;
  role: UserRole;
  status: UserStatus;
  words?: Maybe<Array<Word>>;
  year?: Maybe<Scalars['Int']['output']>;
};

export type UserFilterOptions = {
  role: UserRole;
  status: UserStatus;
  userName?: InputMaybe<Scalars['String']['input']>;
};

export type UserInput = {
  class?: InputMaybe<Scalars['String']['input']>;
  email: Scalars['String']['input'];
  name: Scalars['String']['input'];
  number?: InputMaybe<Scalars['Int']['input']>;
  role: UserRole;
  year?: InputMaybe<Scalars['Int']['input']>;
};

export type UserOffsetPaginationResponse = {
  __typename: 'UserOffsetPaginationResponse';
  pageInfo: OffsetPaginationPageInfo;
  records: Array<User>;
};

export enum UserRole {
  Admin = 'ADMIN',
  Student = 'STUDENT',
  Superadmin = 'SUPERADMIN',
  Teacher = 'TEACHER'
}

export enum UserStatus {
  Approved = 'APPROVED',
  Denied = 'DENIED',
  Pending = 'PENDING'
}

export type Word = {
  __typename: 'Word';
  createdAt: Scalars['DateTime']['output'];
  deniedReason?: Maybe<Scalars['String']['output']>;
  example?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  korDicResults?: Maybe<Array<Scalars['String']['output']>>;
  naverDicResults?: Maybe<Array<Scalars['String']['output']>>;
  page?: Maybe<Scalars['Int']['output']>;
  requestor: User;
  status: WordStatus;
  title: Scalars['String']['output'];
};

export type WordFilterOptions = {
  class?: InputMaybe<Scalars['String']['input']>;
  requestorId?: InputMaybe<Scalars['ID']['input']>;
  status: WordStatus;
  word?: InputMaybe<Scalars['String']['input']>;
  year?: InputMaybe<Scalars['Int']['input']>;
};

export type WordOffsetPaginationResponse = {
  __typename: 'WordOffsetPaginationResponse';
  pageInfo: OffsetPaginationPageInfo;
  records: Array<Word>;
};

export enum WordStatus {
  Approved = 'APPROVED',
  Denied = 'DENIED',
  Pending = 'PENDING'
}

export type GetMyRoleQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMyRoleQuery = { __typename: 'Query', getCurrentUser: { __typename: 'User', role: UserRole } };

export type RequestorDropDownItemsFragment = { __typename: 'User', id: string, name: string };

export type GetRequestorsDropDownQueryVariables = Exact<{
  paginationOptions: OffsetPaginationOptions;
  filterOptions: RequestorFilterOptions;
}>;


export type GetRequestorsDropDownQuery = { __typename: 'Query', getRequestors: { __typename: 'UserOffsetPaginationResponse', records: Array<{ __typename: 'User', id: string, name: string }>, pageInfo: { __typename: 'OffsetPaginationPageInfo', totalRowCount: number, pageCount: number } } };

export type MyRequestItemsFragment = { __typename: 'Word', id: string, korDicResults?: Array<string> | null, naverDicResults?: Array<string> | null, title: string, page?: number | null, example?: string | null, deniedReason?: string | null };

export type GetMyRequestsQueryVariables = Exact<{
  paginationOptions: OffsetPaginationOptions;
  filterOptions: WordFilterOptions;
}>;


export type GetMyRequestsQuery = { __typename: 'Query', getMyRequests: { __typename: 'WordOffsetPaginationResponse', records: Array<{ __typename: 'Word', id: string, korDicResults?: Array<string> | null, naverDicResults?: Array<string> | null, title: string, page?: number | null, example?: string | null, deniedReason?: string | null }>, pageInfo: { __typename: 'OffsetPaginationPageInfo', totalRowCount: number, pageCount: number } } };

export type MyProfileItemsFragment = { __typename: 'User', email: string, name: string, year?: number | null, class?: string | null, number?: number | null, role: UserRole };

export type GetMyProfileQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMyProfileQuery = { __typename: 'Query', getCurrentUser: { __typename: 'User', id: string, email: string, name: string, year?: number | null, class?: string | null, number?: number | null, role: UserRole } };

export type RequestorItemsFragment = { __typename: 'User', id: string, name: string, role: UserRole, year?: number | null, class?: string | null, number?: number | null, email: string };

export type WordRequestItemsFragment = { __typename: 'Word', id: string, korDicResults?: Array<string> | null, naverDicResults?: Array<string> | null, status: WordStatus, title: string, page?: number | null, example?: string | null, deniedReason?: string | null, createdAt: any, requestor: { __typename: 'User', id: string, name: string, role: UserRole, year?: number | null, class?: string | null, number?: number | null, email: string } };

export type GetWordRequestsQueryVariables = Exact<{
  paginationOptions: OffsetPaginationOptions;
  filterOptions: WordFilterOptions;
}>;


export type GetWordRequestsQuery = { __typename: 'Query', getWords: { __typename: 'WordOffsetPaginationResponse', records: Array<{ __typename: 'Word', id: string, korDicResults?: Array<string> | null, naverDicResults?: Array<string> | null, status: WordStatus, title: string, page?: number | null, example?: string | null, deniedReason?: string | null, createdAt: any, requestor: { __typename: 'User', id: string, name: string, role: UserRole, year?: number | null, class?: string | null, number?: number | null, email: string } }>, pageInfo: { __typename: 'OffsetPaginationPageInfo', totalRowCount: number, pageCount: number } } };

export type VocabularyItemsFragment = { __typename: 'Word', id: string, korDicResults?: Array<string> | null, naverDicResults?: Array<string> | null, title: string, page?: number | null, example?: string | null };

export type GetVocabulariesQueryVariables = Exact<{
  paginationOptions: OffsetPaginationOptions;
  filterOptions: WordFilterOptions;
}>;


export type GetVocabulariesQuery = { __typename: 'Query', getWords: { __typename: 'WordOffsetPaginationResponse', records: Array<{ __typename: 'Word', id: string, korDicResults?: Array<string> | null, naverDicResults?: Array<string> | null, title: string, page?: number | null, example?: string | null }>, pageInfo: { __typename: 'OffsetPaginationPageInfo', totalRowCount: number, pageCount: number } } };

export const RequestorDropDownItemsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RequestorDropDownItems"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]} as unknown as DocumentNode<RequestorDropDownItemsFragment, unknown>;
export const MyRequestItemsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MyRequestItems"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Word"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"korDicResults"}},{"kind":"Field","name":{"kind":"Name","value":"naverDicResults"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"example"}},{"kind":"Field","name":{"kind":"Name","value":"deniedReason"}}]}}]} as unknown as DocumentNode<MyRequestItemsFragment, unknown>;
export const MyProfileItemsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MyProfileItems"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"year"}},{"kind":"Field","name":{"kind":"Name","value":"class"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]} as unknown as DocumentNode<MyProfileItemsFragment, unknown>;
export const RequestorItemsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RequestorItems"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"year"}},{"kind":"Field","name":{"kind":"Name","value":"class"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]} as unknown as DocumentNode<RequestorItemsFragment, unknown>;
export const WordRequestItemsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"WordRequestItems"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Word"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"requestor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"RequestorItems"}}]}},{"kind":"Field","name":{"kind":"Name","value":"korDicResults"}},{"kind":"Field","name":{"kind":"Name","value":"naverDicResults"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"example"}},{"kind":"Field","name":{"kind":"Name","value":"deniedReason"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RequestorItems"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"year"}},{"kind":"Field","name":{"kind":"Name","value":"class"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]} as unknown as DocumentNode<WordRequestItemsFragment, unknown>;
export const VocabularyItemsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"VocabularyItems"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Word"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"korDicResults"}},{"kind":"Field","name":{"kind":"Name","value":"naverDicResults"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"example"}}]}}]} as unknown as DocumentNode<VocabularyItemsFragment, unknown>;
export const GetMyRoleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMyRole"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getCurrentUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]}}]} as unknown as DocumentNode<GetMyRoleQuery, GetMyRoleQueryVariables>;
export const GetRequestorsDropDownDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetRequestorsDropDown"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"paginationOptions"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"OffsetPaginationOptions"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filterOptions"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RequestorFilterOptions"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getRequestors"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"paginationOptions"},"value":{"kind":"Variable","name":{"kind":"Name","value":"paginationOptions"}}},{"kind":"Argument","name":{"kind":"Name","value":"filterOptions"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filterOptions"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"records"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"RequestorDropDownItems"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalRowCount"}},{"kind":"Field","name":{"kind":"Name","value":"pageCount"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RequestorDropDownItems"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]} as unknown as DocumentNode<GetRequestorsDropDownQuery, GetRequestorsDropDownQueryVariables>;
export const GetMyRequestsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMyRequests"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"paginationOptions"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"OffsetPaginationOptions"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filterOptions"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"WordFilterOptions"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getMyRequests"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"paginationOptions"},"value":{"kind":"Variable","name":{"kind":"Name","value":"paginationOptions"}}},{"kind":"Argument","name":{"kind":"Name","value":"filterOptions"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filterOptions"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"records"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MyRequestItems"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalRowCount"}},{"kind":"Field","name":{"kind":"Name","value":"pageCount"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MyRequestItems"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Word"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"korDicResults"}},{"kind":"Field","name":{"kind":"Name","value":"naverDicResults"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"example"}},{"kind":"Field","name":{"kind":"Name","value":"deniedReason"}}]}}]} as unknown as DocumentNode<GetMyRequestsQuery, GetMyRequestsQueryVariables>;
export const GetMyProfileDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMyProfile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getCurrentUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"MyProfileItems"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MyProfileItems"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"year"}},{"kind":"Field","name":{"kind":"Name","value":"class"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]} as unknown as DocumentNode<GetMyProfileQuery, GetMyProfileQueryVariables>;
export const GetWordRequestsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetWordRequests"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"paginationOptions"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"OffsetPaginationOptions"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filterOptions"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"WordFilterOptions"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getWords"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"paginationOptions"},"value":{"kind":"Variable","name":{"kind":"Name","value":"paginationOptions"}}},{"kind":"Argument","name":{"kind":"Name","value":"filterOptions"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filterOptions"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"records"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"WordRequestItems"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalRowCount"}},{"kind":"Field","name":{"kind":"Name","value":"pageCount"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RequestorItems"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"year"}},{"kind":"Field","name":{"kind":"Name","value":"class"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"WordRequestItems"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Word"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"requestor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"RequestorItems"}}]}},{"kind":"Field","name":{"kind":"Name","value":"korDicResults"}},{"kind":"Field","name":{"kind":"Name","value":"naverDicResults"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"example"}},{"kind":"Field","name":{"kind":"Name","value":"deniedReason"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]} as unknown as DocumentNode<GetWordRequestsQuery, GetWordRequestsQueryVariables>;
export const GetVocabulariesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetVocabularies"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"paginationOptions"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"OffsetPaginationOptions"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filterOptions"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"WordFilterOptions"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getWords"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"paginationOptions"},"value":{"kind":"Variable","name":{"kind":"Name","value":"paginationOptions"}}},{"kind":"Argument","name":{"kind":"Name","value":"filterOptions"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filterOptions"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"records"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"VocabularyItems"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalRowCount"}},{"kind":"Field","name":{"kind":"Name","value":"pageCount"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"VocabularyItems"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Word"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"korDicResults"}},{"kind":"Field","name":{"kind":"Name","value":"naverDicResults"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"example"}}]}}]} as unknown as DocumentNode<GetVocabulariesQuery, GetVocabulariesQueryVariables>;