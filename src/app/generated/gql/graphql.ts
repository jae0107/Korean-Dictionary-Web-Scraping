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

export type Mutation = {
  __typename: 'Mutation';
  approveWordRequest: Scalars['Boolean']['output'];
  bulkApproveWordRequests: Scalars['Boolean']['output'];
  bulkDeleteWordRequests: Scalars['Boolean']['output'];
  bulkDenyWordRequests: Scalars['Boolean']['output'];
  bulkRecoverWordRequests: Scalars['Boolean']['output'];
  createWordRequest: Word;
  deleteWordRequest: Scalars['Boolean']['output'];
  denyWordRequest: Scalars['Boolean']['output'];
  recoverWordRequest: Scalars['Boolean']['output'];
};


export type MutationApproveWordRequestArgs = {
  id: Scalars['ID']['input'];
};


export type MutationBulkApproveWordRequestsArgs = {
  ids: Array<Scalars['ID']['input']>;
};


export type MutationBulkDeleteWordRequestsArgs = {
  ids: Array<Scalars['ID']['input']>;
};


export type MutationBulkDenyWordRequestsArgs = {
  ids: Array<Scalars['ID']['input']>;
};


export type MutationBulkRecoverWordRequestsArgs = {
  ids: Array<Scalars['ID']['input']>;
};


export type MutationCreateWordRequestArgs = {
  input: WordInput;
};


export type MutationDeleteWordRequestArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDenyWordRequestArgs = {
  id: Scalars['ID']['input'];
};


export type MutationRecoverWordRequestArgs = {
  id: Scalars['ID']['input'];
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
  roles: Array<UserRole>;
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
  previousStatus?: Maybe<WordStatus>;
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

export type WordInput = {
  deniedReason?: InputMaybe<Scalars['String']['input']>;
  example?: InputMaybe<Scalars['String']['input']>;
  korDicResults?: InputMaybe<Array<Scalars['String']['input']>>;
  naverDicResults?: InputMaybe<Array<Scalars['String']['input']>>;
  page?: InputMaybe<Scalars['Int']['input']>;
  requestorId?: InputMaybe<Scalars['ID']['input']>;
  status?: InputMaybe<WordStatus>;
  title?: InputMaybe<Scalars['String']['input']>;
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

export type SingleAdminItemsFragment = { __typename: 'User', email: string, name: string, year?: number | null, class?: string | null, role: UserRole };

export type GetAdminQueryVariables = Exact<{
  getUserId: Scalars['ID']['input'];
}>;


export type GetAdminQuery = { __typename: 'Query', getUser: { __typename: 'User', email: string, name: string, year?: number | null, class?: string | null, role: UserRole } };

export type AdminItemsFragment = { __typename: 'User', id: string, name: string, year?: number | null, class?: string | null, email: string, status: UserStatus };

export type GetAdminsQueryVariables = Exact<{
  paginationOptions: OffsetPaginationOptions;
  filterOptions: UserFilterOptions;
}>;


export type GetAdminsQuery = { __typename: 'Query', getUsers: { __typename: 'UserOffsetPaginationResponse', records: Array<{ __typename: 'User', id: string, name: string, year?: number | null, class?: string | null, email: string, status: UserStatus }>, pageInfo: { __typename: 'OffsetPaginationPageInfo', totalRowCount: number, pageCount: number } } };

export type GetMyRoleQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMyRoleQuery = { __typename: 'Query', getCurrentUser: { __typename: 'User', role: UserRole } };

export type CreateWordRequestMutationVariables = Exact<{
  input: WordInput;
}>;


export type CreateWordRequestMutation = { __typename: 'Mutation', createWordRequest: { __typename: 'Word', id: string } };

export type RequestorDropDownItemsFragment = { __typename: 'User', id: string, name: string };

export type GetRequestorsDropDownQueryVariables = Exact<{
  paginationOptions: OffsetPaginationOptions;
  filterOptions: RequestorFilterOptions;
}>;


export type GetRequestorsDropDownQuery = { __typename: 'Query', getRequestors: { __typename: 'UserOffsetPaginationResponse', records: Array<{ __typename: 'User', id: string, name: string }>, pageInfo: { __typename: 'OffsetPaginationPageInfo', totalRowCount: number, pageCount: number } } };

export type BulkApproveWordRequestsMutationVariables = Exact<{
  ids: Array<Scalars['ID']['input']> | Scalars['ID']['input'];
}>;


export type BulkApproveWordRequestsMutation = { __typename: 'Mutation', bulkApproveWordRequests: boolean };

export type BulkDenyWordRequestsMutationVariables = Exact<{
  ids: Array<Scalars['ID']['input']> | Scalars['ID']['input'];
}>;


export type BulkDenyWordRequestsMutation = { __typename: 'Mutation', bulkDenyWordRequests: boolean };

export type BulkRecoverWordRequestsMutationVariables = Exact<{
  ids: Array<Scalars['ID']['input']> | Scalars['ID']['input'];
}>;


export type BulkRecoverWordRequestsMutation = { __typename: 'Mutation', bulkRecoverWordRequests: boolean };

export type BulkDeleteWordRequestsMutationVariables = Exact<{
  ids: Array<Scalars['ID']['input']> | Scalars['ID']['input'];
}>;


export type BulkDeleteWordRequestsMutation = { __typename: 'Mutation', bulkDeleteWordRequests: boolean };

export type ApproveWordRequestMutationVariables = Exact<{
  approveWordRequestId: Scalars['ID']['input'];
}>;


export type ApproveWordRequestMutation = { __typename: 'Mutation', approveWordRequest: boolean };

export type DenyWordRequestMutationVariables = Exact<{
  denyWordRequestId: Scalars['ID']['input'];
}>;


export type DenyWordRequestMutation = { __typename: 'Mutation', denyWordRequest: boolean };

export type RecoverWordRequestMutationVariables = Exact<{
  recoverWordRequestId: Scalars['ID']['input'];
}>;


export type RecoverWordRequestMutation = { __typename: 'Mutation', recoverWordRequest: boolean };

export type DeleteWordRequestMutationVariables = Exact<{
  deleteWordRequestId: Scalars['ID']['input'];
}>;


export type DeleteWordRequestMutation = { __typename: 'Mutation', deleteWordRequest: boolean };

export type StudentRequestItemsFragment = { __typename: 'Word', id: string, korDicResults?: Array<string> | null, naverDicResults?: Array<string> | null, status: WordStatus, title: string, page?: number | null, example?: string | null, deniedReason?: string | null };

export type GetStudentRequestsQueryVariables = Exact<{
  paginationOptions: OffsetPaginationOptions;
  filterOptions: WordFilterOptions;
}>;


export type GetStudentRequestsQuery = { __typename: 'Query', getWords: { __typename: 'WordOffsetPaginationResponse', records: Array<{ __typename: 'Word', id: string, korDicResults?: Array<string> | null, naverDicResults?: Array<string> | null, status: WordStatus, title: string, page?: number | null, example?: string | null, deniedReason?: string | null }>, pageInfo: { __typename: 'OffsetPaginationPageInfo', totalRowCount: number, pageCount: number } } };

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

export type WordRequestItemsFragment = { __typename: 'Word', id: string, korDicResults?: Array<string> | null, naverDicResults?: Array<string> | null, status: WordStatus, title: string, page?: number | null, example?: string | null, deniedReason?: string | null, requestor: { __typename: 'User', id: string, name: string, role: UserRole, year?: number | null, class?: string | null, number?: number | null, email: string } };

export type GetWordRequestsQueryVariables = Exact<{
  paginationOptions: OffsetPaginationOptions;
  filterOptions: WordFilterOptions;
}>;


export type GetWordRequestsQuery = { __typename: 'Query', getWords: { __typename: 'WordOffsetPaginationResponse', records: Array<{ __typename: 'Word', id: string, korDicResults?: Array<string> | null, naverDicResults?: Array<string> | null, status: WordStatus, title: string, page?: number | null, example?: string | null, deniedReason?: string | null, requestor: { __typename: 'User', id: string, name: string, role: UserRole, year?: number | null, class?: string | null, number?: number | null, email: string } }>, pageInfo: { __typename: 'OffsetPaginationPageInfo', totalRowCount: number, pageCount: number } } };

export type SingleStudentItemsFragment = { __typename: 'User', email: string, name: string, year?: number | null, class?: string | null, number?: number | null, role: UserRole };

export type GetStudentQueryVariables = Exact<{
  getUserId: Scalars['ID']['input'];
}>;


export type GetStudentQuery = { __typename: 'Query', getUser: { __typename: 'User', email: string, name: string, year?: number | null, class?: string | null, number?: number | null, role: UserRole } };

export type StudentItemsFragment = { __typename: 'User', id: string, name: string, year?: number | null, class?: string | null, number?: number | null, email: string, status: UserStatus };

export type GetStudentsQueryVariables = Exact<{
  paginationOptions: OffsetPaginationOptions;
  filterOptions: UserFilterOptions;
}>;


export type GetStudentsQuery = { __typename: 'Query', getUsers: { __typename: 'UserOffsetPaginationResponse', records: Array<{ __typename: 'User', id: string, name: string, year?: number | null, class?: string | null, number?: number | null, email: string, status: UserStatus }>, pageInfo: { __typename: 'OffsetPaginationPageInfo', totalRowCount: number, pageCount: number } } };

export type SingleTeacherItemsFragment = { __typename: 'User', email: string, name: string, year?: number | null, class?: string | null, role: UserRole };

export type GetTeacherQueryVariables = Exact<{
  getUserId: Scalars['ID']['input'];
}>;


export type GetTeacherQuery = { __typename: 'Query', getUser: { __typename: 'User', email: string, name: string, year?: number | null, class?: string | null, role: UserRole } };

export type TeacherItemsFragment = { __typename: 'User', id: string, name: string, year?: number | null, class?: string | null, email: string, status: UserStatus };

export type GetTeachersQueryVariables = Exact<{
  paginationOptions: OffsetPaginationOptions;
  filterOptions: UserFilterOptions;
}>;


export type GetTeachersQuery = { __typename: 'Query', getUsers: { __typename: 'UserOffsetPaginationResponse', records: Array<{ __typename: 'User', id: string, name: string, year?: number | null, class?: string | null, email: string, status: UserStatus }>, pageInfo: { __typename: 'OffsetPaginationPageInfo', totalRowCount: number, pageCount: number } } };

export type VocabularyItemsFragment = { __typename: 'Word', id: string, korDicResults?: Array<string> | null, naverDicResults?: Array<string> | null, title: string, page?: number | null, example?: string | null };

export type GetVocabulariesQueryVariables = Exact<{
  paginationOptions: OffsetPaginationOptions;
  filterOptions: WordFilterOptions;
}>;


export type GetVocabulariesQuery = { __typename: 'Query', getWords: { __typename: 'WordOffsetPaginationResponse', records: Array<{ __typename: 'Word', id: string, korDicResults?: Array<string> | null, naverDicResults?: Array<string> | null, title: string, page?: number | null, example?: string | null }>, pageInfo: { __typename: 'OffsetPaginationPageInfo', totalRowCount: number, pageCount: number } } };

export const SingleAdminItemsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SingleAdminItems"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"year"}},{"kind":"Field","name":{"kind":"Name","value":"class"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]} as unknown as DocumentNode<SingleAdminItemsFragment, unknown>;
export const AdminItemsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AdminItems"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"year"}},{"kind":"Field","name":{"kind":"Name","value":"class"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]} as unknown as DocumentNode<AdminItemsFragment, unknown>;
export const RequestorDropDownItemsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RequestorDropDownItems"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]} as unknown as DocumentNode<RequestorDropDownItemsFragment, unknown>;
export const StudentRequestItemsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StudentRequestItems"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Word"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"korDicResults"}},{"kind":"Field","name":{"kind":"Name","value":"naverDicResults"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"example"}},{"kind":"Field","name":{"kind":"Name","value":"deniedReason"}}]}}]} as unknown as DocumentNode<StudentRequestItemsFragment, unknown>;
export const MyRequestItemsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MyRequestItems"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Word"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"korDicResults"}},{"kind":"Field","name":{"kind":"Name","value":"naverDicResults"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"example"}},{"kind":"Field","name":{"kind":"Name","value":"deniedReason"}}]}}]} as unknown as DocumentNode<MyRequestItemsFragment, unknown>;
export const MyProfileItemsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MyProfileItems"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"year"}},{"kind":"Field","name":{"kind":"Name","value":"class"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]} as unknown as DocumentNode<MyProfileItemsFragment, unknown>;
export const RequestorItemsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RequestorItems"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"year"}},{"kind":"Field","name":{"kind":"Name","value":"class"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]} as unknown as DocumentNode<RequestorItemsFragment, unknown>;
export const WordRequestItemsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"WordRequestItems"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Word"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"requestor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"RequestorItems"}}]}},{"kind":"Field","name":{"kind":"Name","value":"korDicResults"}},{"kind":"Field","name":{"kind":"Name","value":"naverDicResults"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"example"}},{"kind":"Field","name":{"kind":"Name","value":"deniedReason"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RequestorItems"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"year"}},{"kind":"Field","name":{"kind":"Name","value":"class"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]} as unknown as DocumentNode<WordRequestItemsFragment, unknown>;
export const SingleStudentItemsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SingleStudentItems"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"year"}},{"kind":"Field","name":{"kind":"Name","value":"class"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]} as unknown as DocumentNode<SingleStudentItemsFragment, unknown>;
export const StudentItemsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StudentItems"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"year"}},{"kind":"Field","name":{"kind":"Name","value":"class"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]} as unknown as DocumentNode<StudentItemsFragment, unknown>;
export const SingleTeacherItemsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SingleTeacherItems"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"year"}},{"kind":"Field","name":{"kind":"Name","value":"class"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]} as unknown as DocumentNode<SingleTeacherItemsFragment, unknown>;
export const TeacherItemsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TeacherItems"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"year"}},{"kind":"Field","name":{"kind":"Name","value":"class"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]} as unknown as DocumentNode<TeacherItemsFragment, unknown>;
export const VocabularyItemsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"VocabularyItems"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Word"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"korDicResults"}},{"kind":"Field","name":{"kind":"Name","value":"naverDicResults"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"example"}}]}}]} as unknown as DocumentNode<VocabularyItemsFragment, unknown>;
export const GetAdminDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAdmin"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"getUserId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"getUserId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SingleAdminItems"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SingleAdminItems"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"year"}},{"kind":"Field","name":{"kind":"Name","value":"class"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]} as unknown as DocumentNode<GetAdminQuery, GetAdminQueryVariables>;
export const GetAdminsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAdmins"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"paginationOptions"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"OffsetPaginationOptions"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filterOptions"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UserFilterOptions"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getUsers"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"paginationOptions"},"value":{"kind":"Variable","name":{"kind":"Name","value":"paginationOptions"}}},{"kind":"Argument","name":{"kind":"Name","value":"filterOptions"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filterOptions"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"records"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AdminItems"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalRowCount"}},{"kind":"Field","name":{"kind":"Name","value":"pageCount"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AdminItems"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"year"}},{"kind":"Field","name":{"kind":"Name","value":"class"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]} as unknown as DocumentNode<GetAdminsQuery, GetAdminsQueryVariables>;
export const GetMyRoleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMyRole"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getCurrentUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]}}]} as unknown as DocumentNode<GetMyRoleQuery, GetMyRoleQueryVariables>;
export const CreateWordRequestDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateWordRequest"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"WordInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createWordRequest"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<CreateWordRequestMutation, CreateWordRequestMutationVariables>;
export const GetRequestorsDropDownDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetRequestorsDropDown"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"paginationOptions"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"OffsetPaginationOptions"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filterOptions"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RequestorFilterOptions"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getRequestors"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"paginationOptions"},"value":{"kind":"Variable","name":{"kind":"Name","value":"paginationOptions"}}},{"kind":"Argument","name":{"kind":"Name","value":"filterOptions"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filterOptions"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"records"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"RequestorDropDownItems"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalRowCount"}},{"kind":"Field","name":{"kind":"Name","value":"pageCount"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RequestorDropDownItems"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]} as unknown as DocumentNode<GetRequestorsDropDownQuery, GetRequestorsDropDownQueryVariables>;
export const BulkApproveWordRequestsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"BulkApproveWordRequests"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"ids"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bulkApproveWordRequests"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"ids"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ids"}}}]}]}}]} as unknown as DocumentNode<BulkApproveWordRequestsMutation, BulkApproveWordRequestsMutationVariables>;
export const BulkDenyWordRequestsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"BulkDenyWordRequests"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"ids"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bulkDenyWordRequests"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"ids"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ids"}}}]}]}}]} as unknown as DocumentNode<BulkDenyWordRequestsMutation, BulkDenyWordRequestsMutationVariables>;
export const BulkRecoverWordRequestsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"BulkRecoverWordRequests"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"ids"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bulkRecoverWordRequests"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"ids"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ids"}}}]}]}}]} as unknown as DocumentNode<BulkRecoverWordRequestsMutation, BulkRecoverWordRequestsMutationVariables>;
export const BulkDeleteWordRequestsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"BulkDeleteWordRequests"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"ids"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bulkDeleteWordRequests"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"ids"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ids"}}}]}]}}]} as unknown as DocumentNode<BulkDeleteWordRequestsMutation, BulkDeleteWordRequestsMutationVariables>;
export const ApproveWordRequestDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ApproveWordRequest"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"approveWordRequestId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"approveWordRequest"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"approveWordRequestId"}}}]}]}}]} as unknown as DocumentNode<ApproveWordRequestMutation, ApproveWordRequestMutationVariables>;
export const DenyWordRequestDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DenyWordRequest"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"denyWordRequestId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"denyWordRequest"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"denyWordRequestId"}}}]}]}}]} as unknown as DocumentNode<DenyWordRequestMutation, DenyWordRequestMutationVariables>;
export const RecoverWordRequestDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RecoverWordRequest"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"recoverWordRequestId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"recoverWordRequest"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"recoverWordRequestId"}}}]}]}}]} as unknown as DocumentNode<RecoverWordRequestMutation, RecoverWordRequestMutationVariables>;
export const DeleteWordRequestDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteWordRequest"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"deleteWordRequestId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteWordRequest"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"deleteWordRequestId"}}}]}]}}]} as unknown as DocumentNode<DeleteWordRequestMutation, DeleteWordRequestMutationVariables>;
export const GetStudentRequestsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetStudentRequests"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"paginationOptions"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"OffsetPaginationOptions"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filterOptions"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"WordFilterOptions"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getWords"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"paginationOptions"},"value":{"kind":"Variable","name":{"kind":"Name","value":"paginationOptions"}}},{"kind":"Argument","name":{"kind":"Name","value":"filterOptions"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filterOptions"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"records"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"StudentRequestItems"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalRowCount"}},{"kind":"Field","name":{"kind":"Name","value":"pageCount"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StudentRequestItems"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Word"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"korDicResults"}},{"kind":"Field","name":{"kind":"Name","value":"naverDicResults"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"example"}},{"kind":"Field","name":{"kind":"Name","value":"deniedReason"}}]}}]} as unknown as DocumentNode<GetStudentRequestsQuery, GetStudentRequestsQueryVariables>;
export const GetMyRequestsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMyRequests"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"paginationOptions"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"OffsetPaginationOptions"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filterOptions"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"WordFilterOptions"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getMyRequests"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"paginationOptions"},"value":{"kind":"Variable","name":{"kind":"Name","value":"paginationOptions"}}},{"kind":"Argument","name":{"kind":"Name","value":"filterOptions"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filterOptions"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"records"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MyRequestItems"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalRowCount"}},{"kind":"Field","name":{"kind":"Name","value":"pageCount"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MyRequestItems"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Word"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"korDicResults"}},{"kind":"Field","name":{"kind":"Name","value":"naverDicResults"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"example"}},{"kind":"Field","name":{"kind":"Name","value":"deniedReason"}}]}}]} as unknown as DocumentNode<GetMyRequestsQuery, GetMyRequestsQueryVariables>;
export const GetMyProfileDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMyProfile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getCurrentUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"MyProfileItems"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MyProfileItems"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"year"}},{"kind":"Field","name":{"kind":"Name","value":"class"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]} as unknown as DocumentNode<GetMyProfileQuery, GetMyProfileQueryVariables>;
export const GetWordRequestsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetWordRequests"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"paginationOptions"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"OffsetPaginationOptions"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filterOptions"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"WordFilterOptions"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getWords"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"paginationOptions"},"value":{"kind":"Variable","name":{"kind":"Name","value":"paginationOptions"}}},{"kind":"Argument","name":{"kind":"Name","value":"filterOptions"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filterOptions"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"records"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"WordRequestItems"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalRowCount"}},{"kind":"Field","name":{"kind":"Name","value":"pageCount"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RequestorItems"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"year"}},{"kind":"Field","name":{"kind":"Name","value":"class"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"WordRequestItems"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Word"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"requestor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"RequestorItems"}}]}},{"kind":"Field","name":{"kind":"Name","value":"korDicResults"}},{"kind":"Field","name":{"kind":"Name","value":"naverDicResults"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"example"}},{"kind":"Field","name":{"kind":"Name","value":"deniedReason"}}]}}]} as unknown as DocumentNode<GetWordRequestsQuery, GetWordRequestsQueryVariables>;
export const GetStudentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetStudent"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"getUserId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"getUserId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SingleStudentItems"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SingleStudentItems"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"year"}},{"kind":"Field","name":{"kind":"Name","value":"class"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]} as unknown as DocumentNode<GetStudentQuery, GetStudentQueryVariables>;
export const GetStudentsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetStudents"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"paginationOptions"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"OffsetPaginationOptions"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filterOptions"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UserFilterOptions"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getUsers"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"paginationOptions"},"value":{"kind":"Variable","name":{"kind":"Name","value":"paginationOptions"}}},{"kind":"Argument","name":{"kind":"Name","value":"filterOptions"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filterOptions"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"records"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"StudentItems"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalRowCount"}},{"kind":"Field","name":{"kind":"Name","value":"pageCount"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StudentItems"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"year"}},{"kind":"Field","name":{"kind":"Name","value":"class"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]} as unknown as DocumentNode<GetStudentsQuery, GetStudentsQueryVariables>;
export const GetTeacherDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetTeacher"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"getUserId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"getUserId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SingleTeacherItems"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SingleTeacherItems"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"year"}},{"kind":"Field","name":{"kind":"Name","value":"class"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]} as unknown as DocumentNode<GetTeacherQuery, GetTeacherQueryVariables>;
export const GetTeachersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetTeachers"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"paginationOptions"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"OffsetPaginationOptions"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filterOptions"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UserFilterOptions"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getUsers"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"paginationOptions"},"value":{"kind":"Variable","name":{"kind":"Name","value":"paginationOptions"}}},{"kind":"Argument","name":{"kind":"Name","value":"filterOptions"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filterOptions"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"records"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TeacherItems"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalRowCount"}},{"kind":"Field","name":{"kind":"Name","value":"pageCount"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TeacherItems"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"year"}},{"kind":"Field","name":{"kind":"Name","value":"class"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]} as unknown as DocumentNode<GetTeachersQuery, GetTeachersQueryVariables>;
export const GetVocabulariesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetVocabularies"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"paginationOptions"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"OffsetPaginationOptions"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filterOptions"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"WordFilterOptions"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getWords"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"paginationOptions"},"value":{"kind":"Variable","name":{"kind":"Name","value":"paginationOptions"}}},{"kind":"Argument","name":{"kind":"Name","value":"filterOptions"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filterOptions"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"records"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"VocabularyItems"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalRowCount"}},{"kind":"Field","name":{"kind":"Name","value":"pageCount"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"VocabularyItems"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Word"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"korDicResults"}},{"kind":"Field","name":{"kind":"Name","value":"naverDicResults"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"example"}}]}}]} as unknown as DocumentNode<GetVocabulariesQuery, GetVocabulariesQueryVariables>;