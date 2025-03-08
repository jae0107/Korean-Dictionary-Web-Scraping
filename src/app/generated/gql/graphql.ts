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

export type FindMyIdInput = {
  class?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  number?: InputMaybe<Scalars['Int']['input']>;
  role: UserRole;
  year?: InputMaybe<Scalars['Int']['input']>;
};

export type FindPasswordInput = {
  currentPassword: Scalars['String']['input'];
  newPassword: Scalars['String']['input'];
};

export type Mutation = {
  __typename: 'Mutation';
  addMyVocabulary: MyVocabulary;
  approveDuplicatedWordRequest: Scalars['Boolean']['output'];
  approveUser: Scalars['Boolean']['output'];
  approveWordRequest: Scalars['Boolean']['output'];
  bulkApproveUsers: Scalars['Boolean']['output'];
  bulkApproveWordRequests: Scalars['Boolean']['output'];
  bulkCreateUsers: Array<User>;
  bulkDeleteUsers: Scalars['Boolean']['output'];
  bulkDeleteWordRequests: Scalars['Boolean']['output'];
  bulkDenyUsers: Scalars['Boolean']['output'];
  bulkDenyWordRequests: Scalars['Boolean']['output'];
  bulkPasswordReset: Scalars['Boolean']['output'];
  bulkRecoverUsers: Scalars['Boolean']['output'];
  bulkRecoverWordRequests: Scalars['Boolean']['output'];
  changeCurrentPassword: User;
  createPasswordResetRequest: PasswordResetRequest;
  createUser: User;
  createWordRequest: Word;
  deleteUser: Scalars['Boolean']['output'];
  deleteWordRequest: Scalars['Boolean']['output'];
  denyUser: Scalars['Boolean']['output'];
  denyWordRequest: Scalars['Boolean']['output'];
  duplicateWordRequest: Word;
  findMyId: Scalars['String']['output'];
  passwordReset: User;
  passwordSetUp: User;
  recoverUser: Scalars['Boolean']['output'];
  recoverWordRequest: Scalars['Boolean']['output'];
  removeMyVocabulary: Scalars['Boolean']['output'];
  sendPasswordResetEmail: Scalars['Boolean']['output'];
  updateDeniedReason: Word;
  updateUser: User;
  updateWordRequest: Word;
};


export type MutationAddMyVocabularyArgs = {
  input: MyVocabularyInput;
};


export type MutationApproveDuplicatedWordRequestArgs = {
  id: Scalars['ID']['input'];
};


export type MutationApproveUserArgs = {
  id: Scalars['ID']['input'];
};


export type MutationApproveWordRequestArgs = {
  id: Scalars['ID']['input'];
};


export type MutationBulkApproveUsersArgs = {
  ids: Array<Scalars['ID']['input']>;
};


export type MutationBulkApproveWordRequestsArgs = {
  ids: Array<Scalars['ID']['input']>;
};


export type MutationBulkCreateUsersArgs = {
  inputs: Array<UserInput>;
};


export type MutationBulkDeleteUsersArgs = {
  ids: Array<Scalars['ID']['input']>;
};


export type MutationBulkDeleteWordRequestsArgs = {
  ids: Array<Scalars['ID']['input']>;
};


export type MutationBulkDenyUsersArgs = {
  ids: Array<Scalars['ID']['input']>;
};


export type MutationBulkDenyWordRequestsArgs = {
  ids: Array<Scalars['ID']['input']>;
};


export type MutationBulkPasswordResetArgs = {
  ids: Array<Scalars['ID']['input']>;
};


export type MutationBulkRecoverUsersArgs = {
  ids: Array<Scalars['ID']['input']>;
};


export type MutationBulkRecoverWordRequestsArgs = {
  ids: Array<Scalars['ID']['input']>;
};


export type MutationChangeCurrentPasswordArgs = {
  id: Scalars['ID']['input'];
  input: FindPasswordInput;
};


export type MutationCreatePasswordResetRequestArgs = {
  input: PasswordResetRequestInput;
};


export type MutationCreateUserArgs = {
  input: UserInput;
};


export type MutationCreateWordRequestArgs = {
  input: WordInput;
};


export type MutationDeleteUserArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteWordRequestArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDenyUserArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDenyWordRequestArgs = {
  deniedReason?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
};


export type MutationDuplicateWordRequestArgs = {
  input: WordInput;
};


export type MutationFindMyIdArgs = {
  input: FindMyIdInput;
};


export type MutationPasswordResetArgs = {
  id: Scalars['ID']['input'];
  password?: InputMaybe<Scalars['String']['input']>;
};


export type MutationPasswordSetUpArgs = {
  id: Scalars['ID']['input'];
  password: Scalars['String']['input'];
};


export type MutationRecoverUserArgs = {
  id: Scalars['ID']['input'];
};


export type MutationRecoverWordRequestArgs = {
  id: Scalars['ID']['input'];
};


export type MutationRemoveMyVocabularyArgs = {
  input: MyVocabularyInput;
};


export type MutationSendPasswordResetEmailArgs = {
  input: PasswordResetEmailInput;
};


export type MutationUpdateDeniedReasonArgs = {
  deniedReason?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
};


export type MutationUpdateUserArgs = {
  id: Scalars['ID']['input'];
  input: UserInput;
};


export type MutationUpdateWordRequestArgs = {
  input: WordInput;
};

export type MyVocabulary = {
  __typename: 'MyVocabulary';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  user: User;
  word: Word;
};

export type MyVocabularyFilterOptions = {
  page?: InputMaybe<Scalars['Int']['input']>;
  userId?: InputMaybe<Scalars['ID']['input']>;
  word?: InputMaybe<Scalars['String']['input']>;
};

export type MyVocabularyInput = {
  userId?: InputMaybe<Scalars['ID']['input']>;
  wordId: Scalars['ID']['input'];
};

export type MyVocabularyOffsetPaginationResponse = {
  __typename: 'MyVocabularyOffsetPaginationResponse';
  pageInfo: OffsetPaginationPageInfo;
  records: Array<MyVocabulary>;
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

export type PasswordResetEmailInput = {
  accountId: Scalars['String']['input'];
  email?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  role: UserRole;
};

export type PasswordResetInput = {
  password: Scalars['String']['input'];
};

export type PasswordResetRequest = {
  __typename: 'PasswordResetRequest';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  requestor?: Maybe<User>;
};

export type PasswordResetRequestFilterOptions = {
  roles: Array<UserRole>;
};

export type PasswordResetRequestInput = {
  accountId: Scalars['String']['input'];
  class?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  number?: InputMaybe<Scalars['Int']['input']>;
  role: UserRole;
  year?: InputMaybe<Scalars['Int']['input']>;
};

export type PasswordResetRequestOffsetPaginationResponse = {
  __typename: 'PasswordResetRequestOffsetPaginationResponse';
  pageInfo: OffsetPaginationPageInfo;
  records: Array<PasswordResetRequest>;
};

export type Query = {
  __typename: 'Query';
  accountIdCheck: Scalars['Boolean']['output'];
  findPassword: Scalars['String']['output'];
  getCurrentUser: User;
  getMyRequests: WordOffsetPaginationResponse;
  getMyVocabularies: MyVocabularyOffsetPaginationResponse;
  getPasswordResetRequests: PasswordResetRequestOffsetPaginationResponse;
  getRequestors: UserOffsetPaginationResponse;
  getUser: User;
  getUsers: UserOffsetPaginationResponse;
  getWord: Word;
  getWordByTitle: Word;
  getWords: WordOffsetPaginationResponse;
};


export type QueryAccountIdCheckArgs = {
  accountId: Scalars['String']['input'];
};


export type QueryFindPasswordArgs = {
  accountId: Scalars['String']['input'];
};


export type QueryGetCurrentUserArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryGetMyRequestsArgs = {
  filterOptions: WordFilterOptions;
  paginationOptions: OffsetPaginationOptions;
};


export type QueryGetMyVocabulariesArgs = {
  filterOptions: MyVocabularyFilterOptions;
  paginationOptions: OffsetPaginationOptions;
};


export type QueryGetPasswordResetRequestsArgs = {
  filterOptions: PasswordResetRequestFilterOptions;
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


export type QueryGetWordArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetWordByTitleArgs = {
  title: Scalars['String']['input'];
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
  accountId: Scalars['String']['output'];
  approvedCount?: Maybe<Scalars['Int']['output']>;
  class?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  email?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  myVocabCount?: Maybe<Scalars['Int']['output']>;
  name: Scalars['String']['output'];
  number?: Maybe<Scalars['Int']['output']>;
  password?: Maybe<Scalars['String']['output']>;
  previousStatus?: Maybe<UserStatus>;
  role: UserRole;
  sessionVersion?: Maybe<Scalars['Int']['output']>;
  status: UserStatus;
  words?: Maybe<Array<Word>>;
  year?: Maybe<Scalars['Int']['output']>;
};

export type UserFilterOptions = {
  roles: Array<UserRole>;
  statuses?: InputMaybe<Array<UserStatus>>;
  userName?: InputMaybe<Scalars['String']['input']>;
};

export type UserInput = {
  accountId?: InputMaybe<Scalars['String']['input']>;
  class?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  number?: InputMaybe<Scalars['Int']['input']>;
  password?: InputMaybe<Scalars['String']['input']>;
  role?: InputMaybe<UserRole>;
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
  examples?: Maybe<Array<Scalars['String']['output']>>;
  id: Scalars['ID']['output'];
  isMyVocabulary?: Maybe<Scalars['Boolean']['output']>;
  korDicResults?: Maybe<Array<Scalars['String']['output']>>;
  naverDicResults?: Maybe<Array<Scalars['String']['output']>>;
  originalWord?: Maybe<Word>;
  pages?: Maybe<Array<Maybe<Scalars['Int']['output']>>>;
  previousStatus?: Maybe<WordStatus>;
  requestors?: Maybe<Array<User>>;
  status: WordStatus;
  title: Scalars['String']['output'];
  wordId?: Maybe<Scalars['ID']['output']>;
};

export type WordFilterOptions = {
  class?: InputMaybe<Scalars['String']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  requestorId?: InputMaybe<Scalars['ID']['input']>;
  status: WordStatus;
  word?: InputMaybe<Scalars['String']['input']>;
  year?: InputMaybe<Scalars['Int']['input']>;
};

export type WordInput = {
  deniedReason?: InputMaybe<Scalars['String']['input']>;
  examples?: InputMaybe<Array<Scalars['String']['input']>>;
  korDicResults?: InputMaybe<Array<Scalars['String']['input']>>;
  naverDicResults?: InputMaybe<Array<Scalars['String']['input']>>;
  pages?: InputMaybe<Array<Scalars['Int']['input']>>;
  requestorIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  status?: InputMaybe<WordStatus>;
  title?: InputMaybe<Scalars['String']['input']>;
  wordId?: InputMaybe<Scalars['ID']['input']>;
};

export type WordOffsetPaginationResponse = {
  __typename: 'WordOffsetPaginationResponse';
  pageInfo: OffsetPaginationPageInfo;
  records: Array<Word>;
};

export enum WordStatus {
  Approved = 'APPROVED',
  Denied = 'DENIED',
  Duplicated = 'DUPLICATED',
  Pending = 'PENDING'
}

export type UserItemsFragment = { __typename: 'User', id: string, accountId: string };

export type GetUsersQueryVariables = Exact<{
  paginationOptions: OffsetPaginationOptions;
  filterOptions: UserFilterOptions;
}>;


export type GetUsersQuery = { __typename: 'Query', getUsers: { __typename: 'UserOffsetPaginationResponse', records: Array<{ __typename: 'User', id: string, accountId: string }>, pageInfo: { __typename: 'OffsetPaginationPageInfo', totalRowCount: number, pageCount: number } } };

export type BulkCreateStudentsMutationVariables = Exact<{
  inputs: Array<UserInput> | UserInput;
}>;


export type BulkCreateStudentsMutation = { __typename: 'Mutation', bulkCreateUsers: Array<{ __typename: 'User', id: string }> };

export type SingleAdminItemsFragment = { __typename: 'User', accountId: string, name: string, year?: number | null, class?: string | null, role: UserRole };

export type GetAdminQueryVariables = Exact<{
  getUserId: Scalars['ID']['input'];
}>;


export type GetAdminQuery = { __typename: 'Query', getUser: { __typename: 'User', accountId: string, name: string, year?: number | null, class?: string | null, role: UserRole } };

export type AdminItemsFragment = { __typename: 'User', id: string, name: string, year?: number | null, class?: string | null, accountId: string, status: UserStatus, role: UserRole };

export type GetAdminsQueryVariables = Exact<{
  paginationOptions: OffsetPaginationOptions;
  filterOptions: UserFilterOptions;
}>;


export type GetAdminsQuery = { __typename: 'Query', getUsers: { __typename: 'UserOffsetPaginationResponse', records: Array<{ __typename: 'User', id: string, name: string, year?: number | null, class?: string | null, accountId: string, status: UserStatus, role: UserRole }>, pageInfo: { __typename: 'OffsetPaginationPageInfo', totalRowCount: number, pageCount: number } } };

export type FindMyIdMutationVariables = Exact<{
  input: FindMyIdInput;
}>;


export type FindMyIdMutation = { __typename: 'Mutation', findMyId: string };

export type DuplicateWordRequestMutationVariables = Exact<{
  input: WordInput;
}>;


export type DuplicateWordRequestMutation = { __typename: 'Mutation', duplicateWordRequest: { __typename: 'Word', id: string } };

export type WordByTitleItemsFragment = { __typename: 'Word', id: string, pages?: Array<number | null> | null, title: string, korDicResults?: Array<string> | null, naverDicResults?: Array<string> | null, examples?: Array<string> | null };

export type CreateWordRequestMutationVariables = Exact<{
  input: WordInput;
}>;


export type CreateWordRequestMutation = { __typename: 'Mutation', createWordRequest: { __typename: 'Word', id: string } };

export type GetWordByTitleQueryVariables = Exact<{
  title: Scalars['String']['input'];
}>;


export type GetWordByTitleQuery = { __typename: 'Query', getWordByTitle: { __typename: 'Word', id: string, pages?: Array<number | null> | null, title: string, korDicResults?: Array<string> | null, naverDicResults?: Array<string> | null, examples?: Array<string> | null } };

export type UpdateWordRequestMutationVariables = Exact<{
  input: WordInput;
}>;


export type UpdateWordRequestMutation = { __typename: 'Mutation', updateWordRequest: { __typename: 'Word', id: string } };

export type ChangeCurrentPasswordMutationVariables = Exact<{
  changeCurrentPasswordId: Scalars['ID']['input'];
  input: FindPasswordInput;
}>;


export type ChangeCurrentPasswordMutation = { __typename: 'Mutation', changeCurrentPassword: { __typename: 'User', id: string } };

export type BulkPasswordResetMutationVariables = Exact<{
  ids: Array<Scalars['ID']['input']> | Scalars['ID']['input'];
}>;


export type BulkPasswordResetMutation = { __typename: 'Mutation', bulkPasswordReset: boolean };

export type PasswordResetMutationVariables = Exact<{
  passwordResetId: Scalars['ID']['input'];
  password?: InputMaybe<Scalars['String']['input']>;
}>;


export type PasswordResetMutation = { __typename: 'Mutation', passwordReset: { __typename: 'User', id: string } };

export type CreatePasswordResetRequestMutationVariables = Exact<{
  input: PasswordResetRequestInput;
}>;


export type CreatePasswordResetRequestMutation = { __typename: 'Mutation', createPasswordResetRequest: { __typename: 'PasswordResetRequest', id: string } };

export type SendPasswordResetEmailMutationVariables = Exact<{
  input: PasswordResetEmailInput;
}>;


export type SendPasswordResetEmailMutation = { __typename: 'Mutation', sendPasswordResetEmail: boolean };

export type PasswordSetUpMutationVariables = Exact<{
  passwordSetUpId: Scalars['ID']['input'];
  password: Scalars['String']['input'];
}>;


export type PasswordSetUpMutation = { __typename: 'Mutation', passwordSetUp: { __typename: 'User', id: string } };

export type RequestorDropDownItemsFragment = { __typename: 'User', id: string, name: string };

export type GetRequestorsDropDownQueryVariables = Exact<{
  paginationOptions: OffsetPaginationOptions;
  filterOptions: RequestorFilterOptions;
}>;


export type GetRequestorsDropDownQuery = { __typename: 'Query', getRequestors: { __typename: 'UserOffsetPaginationResponse', records: Array<{ __typename: 'User', id: string, name: string }>, pageInfo: { __typename: 'OffsetPaginationPageInfo', totalRowCount: number, pageCount: number } } };

export type DuplicatedWordRequestItemsFragment = { __typename: 'Word', id: string, pages?: Array<number | null> | null, title: string, korDicResults?: Array<string> | null, naverDicResults?: Array<string> | null, examples?: Array<string> | null, requestors?: Array<{ __typename: 'User', id: string, name: string, role: UserRole, year?: number | null, class?: string | null, number?: number | null, accountId: string }> | null };

export type GetWordQueryVariables = Exact<{
  getWordId: Scalars['ID']['input'];
}>;


export type GetWordQuery = { __typename: 'Query', getWord: { __typename: 'Word', id: string, pages?: Array<number | null> | null, title: string, korDicResults?: Array<string> | null, naverDicResults?: Array<string> | null, examples?: Array<string> | null, requestors?: Array<{ __typename: 'User', id: string, name: string, role: UserRole, year?: number | null, class?: string | null, number?: number | null, accountId: string }> | null } };

export type ApproveDuplicatedWordRequestMutationVariables = Exact<{
  approveDuplicatedWordRequestId: Scalars['ID']['input'];
}>;


export type ApproveDuplicatedWordRequestMutation = { __typename: 'Mutation', approveDuplicatedWordRequest: boolean };

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
  deniedReason?: InputMaybe<Scalars['String']['input']>;
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

export type UpdateDeniedReasonMutationVariables = Exact<{
  updateDeniedReasonId: Scalars['ID']['input'];
  deniedReason?: InputMaybe<Scalars['String']['input']>;
}>;


export type UpdateDeniedReasonMutation = { __typename: 'Mutation', updateDeniedReason: { __typename: 'Word', id: string, deniedReason?: string | null } };

export type BulkApproveUsersMutationVariables = Exact<{
  ids: Array<Scalars['ID']['input']> | Scalars['ID']['input'];
}>;


export type BulkApproveUsersMutation = { __typename: 'Mutation', bulkApproveUsers: boolean };

export type BulkDenyUsersMutationVariables = Exact<{
  ids: Array<Scalars['ID']['input']> | Scalars['ID']['input'];
}>;


export type BulkDenyUsersMutation = { __typename: 'Mutation', bulkDenyUsers: boolean };

export type BulkRecoverUsersMutationVariables = Exact<{
  ids: Array<Scalars['ID']['input']> | Scalars['ID']['input'];
}>;


export type BulkRecoverUsersMutation = { __typename: 'Mutation', bulkRecoverUsers: boolean };

export type BulkDeleteUsersMutationVariables = Exact<{
  ids: Array<Scalars['ID']['input']> | Scalars['ID']['input'];
}>;


export type BulkDeleteUsersMutation = { __typename: 'Mutation', bulkDeleteUsers: boolean };

export type ApproveUserMutationVariables = Exact<{
  approveUserId: Scalars['ID']['input'];
}>;


export type ApproveUserMutation = { __typename: 'Mutation', approveUser: boolean };

export type DenyUserMutationVariables = Exact<{
  denyUserId: Scalars['ID']['input'];
}>;


export type DenyUserMutation = { __typename: 'Mutation', denyUser: boolean };

export type RecoverUserMutationVariables = Exact<{
  recoverUserId: Scalars['ID']['input'];
}>;


export type RecoverUserMutation = { __typename: 'Mutation', recoverUser: boolean };

export type DeleteUserMutationVariables = Exact<{
  deleteUserId: Scalars['ID']['input'];
}>;


export type DeleteUserMutation = { __typename: 'Mutation', deleteUser: boolean };

export type CreateUserMutationVariables = Exact<{
  input: UserInput;
}>;


export type CreateUserMutation = { __typename: 'Mutation', createUser: { __typename: 'User', id: string } };

export type AccountIdCheckQueryVariables = Exact<{
  accountId: Scalars['String']['input'];
}>;


export type AccountIdCheckQuery = { __typename: 'Query', accountIdCheck: boolean };

export type UserRequestItemsFragment = { __typename: 'Word', id: string, korDicResults?: Array<string> | null, naverDicResults?: Array<string> | null, status: WordStatus, title: string, pages?: Array<number | null> | null, examples?: Array<string> | null, deniedReason?: string | null, wordId?: string | null };

export type GetUserRequestsQueryVariables = Exact<{
  paginationOptions: OffsetPaginationOptions;
  filterOptions: WordFilterOptions;
}>;


export type GetUserRequestsQuery = { __typename: 'Query', getWords: { __typename: 'WordOffsetPaginationResponse', records: Array<{ __typename: 'Word', id: string, korDicResults?: Array<string> | null, naverDicResults?: Array<string> | null, status: WordStatus, title: string, pages?: Array<number | null> | null, examples?: Array<string> | null, deniedReason?: string | null, wordId?: string | null }>, pageInfo: { __typename: 'OffsetPaginationPageInfo', totalRowCount: number, pageCount: number } } };

export type UpdateUserMutationVariables = Exact<{
  updateUserId: Scalars['ID']['input'];
  input: UserInput;
}>;


export type UpdateUserMutation = { __typename: 'Mutation', updateUser: { __typename: 'User', id: string } };

export type AddMyVocabularyMutationVariables = Exact<{
  input: MyVocabularyInput;
}>;


export type AddMyVocabularyMutation = { __typename: 'Mutation', addMyVocabulary: { __typename: 'MyVocabulary', id: string } };

export type RemoveMyVocabularyMutationVariables = Exact<{
  input: MyVocabularyInput;
}>;


export type RemoveMyVocabularyMutation = { __typename: 'Mutation', removeMyVocabulary: boolean };

export type GetUserQueryVariables = Exact<{
  getUserId: Scalars['ID']['input'];
}>;


export type GetUserQuery = { __typename: 'Query', getUser: { __typename: 'User', sessionVersion?: number | null } };

export type MyWordRequestItemsFragment = { __typename: 'Word', id: string, pages?: Array<number | null> | null, title: string, korDicResults?: Array<string> | null, naverDicResults?: Array<string> | null, examples?: Array<string> | null, originalWord?: { __typename: 'Word', id: string, pages?: Array<number | null> | null, title: string, korDicResults?: Array<string> | null, naverDicResults?: Array<string> | null, examples?: Array<string> | null } | null };

export type GetMyWordRequestQueryVariables = Exact<{
  getWordId: Scalars['ID']['input'];
}>;


export type GetMyWordRequestQuery = { __typename: 'Query', getWord: { __typename: 'Word', status: WordStatus, id: string, pages?: Array<number | null> | null, title: string, korDicResults?: Array<string> | null, naverDicResults?: Array<string> | null, examples?: Array<string> | null, requestors?: Array<{ __typename: 'User', id: string }> | null, originalWord?: { __typename: 'Word', id: string, pages?: Array<number | null> | null, title: string, korDicResults?: Array<string> | null, naverDicResults?: Array<string> | null, examples?: Array<string> | null } | null } };

export type MyRequestItemsFragment = { __typename: 'Word', id: string, korDicResults?: Array<string> | null, naverDicResults?: Array<string> | null, title: string, pages?: Array<number | null> | null, examples?: Array<string> | null, deniedReason?: string | null, wordId?: string | null };

export type GetMyRequestsQueryVariables = Exact<{
  paginationOptions: OffsetPaginationOptions;
  filterOptions: WordFilterOptions;
}>;


export type GetMyRequestsQuery = { __typename: 'Query', getMyRequests: { __typename: 'WordOffsetPaginationResponse', records: Array<{ __typename: 'Word', id: string, korDicResults?: Array<string> | null, naverDicResults?: Array<string> | null, title: string, pages?: Array<number | null> | null, examples?: Array<string> | null, deniedReason?: string | null, wordId?: string | null }>, pageInfo: { __typename: 'OffsetPaginationPageInfo', totalRowCount: number, pageCount: number } } };

export type MyVocabularyItemsFragment = { __typename: 'Word', id: string, pages?: Array<number | null> | null, title: string, korDicResults?: Array<string> | null, naverDicResults?: Array<string> | null, examples?: Array<string> | null };

export type GetMyVocabulariesQueryVariables = Exact<{
  paginationOptions: OffsetPaginationOptions;
  filterOptions: MyVocabularyFilterOptions;
}>;


export type GetMyVocabulariesQuery = { __typename: 'Query', getMyVocabularies: { __typename: 'MyVocabularyOffsetPaginationResponse', records: Array<{ __typename: 'MyVocabulary', word: { __typename: 'Word', id: string, pages?: Array<number | null> | null, title: string, korDicResults?: Array<string> | null, naverDicResults?: Array<string> | null, examples?: Array<string> | null } }>, pageInfo: { __typename: 'OffsetPaginationPageInfo', pageCount: number, totalRowCount: number } } };

export type GetMyPasswordQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMyPasswordQuery = { __typename: 'Query', getCurrentUser: { __typename: 'User', id: string, password?: string | null } };

export type FindMyPasswordQueryVariables = Exact<{
  accountId: Scalars['String']['input'];
}>;


export type FindMyPasswordQuery = { __typename: 'Query', findPassword: string };

export type PasswordResetRequestorItemsFragment = { __typename: 'User', id: string, name: string, role: UserRole, year?: number | null, class?: string | null, number?: number | null, accountId: string };

export type PasswordResetRequestItemsFragment = { __typename: 'PasswordResetRequest', id: string, requestor?: { __typename: 'User', id: string, name: string, role: UserRole, year?: number | null, class?: string | null, number?: number | null, accountId: string } | null };

export type GetPasswordResetRequestsQueryVariables = Exact<{
  paginationOptions: OffsetPaginationOptions;
  filterOptions: PasswordResetRequestFilterOptions;
}>;


export type GetPasswordResetRequestsQuery = { __typename: 'Query', getPasswordResetRequests: { __typename: 'PasswordResetRequestOffsetPaginationResponse', records: Array<{ __typename: 'PasswordResetRequest', id: string, requestor?: { __typename: 'User', id: string, name: string, role: UserRole, year?: number | null, class?: string | null, number?: number | null, accountId: string } | null }>, pageInfo: { __typename: 'OffsetPaginationPageInfo', pageCount: number, totalRowCount: number } } };

export type MyProfileItemsFragment = { __typename: 'User', accountId: string, name: string, year?: number | null, class?: string | null, number?: number | null, role: UserRole };

export type GetMyProfileQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMyProfileQuery = { __typename: 'Query', getCurrentUser: { __typename: 'User', id: string, accountId: string, name: string, year?: number | null, class?: string | null, number?: number | null, role: UserRole } };

export type RequestorItemsFragment = { __typename: 'User', id: string, name: string, role: UserRole, year?: number | null, class?: string | null, number?: number | null, accountId: string };

export type WordRequestItemsFragment = { __typename: 'Word', id: string, korDicResults?: Array<string> | null, naverDicResults?: Array<string> | null, status: WordStatus, title: string, pages?: Array<number | null> | null, examples?: Array<string> | null, deniedReason?: string | null, wordId?: string | null, requestors?: Array<{ __typename: 'User', id: string, name: string, role: UserRole, year?: number | null, class?: string | null, number?: number | null, accountId: string }> | null };

export type GetWordRequestsQueryVariables = Exact<{
  paginationOptions: OffsetPaginationOptions;
  filterOptions: WordFilterOptions;
}>;


export type GetWordRequestsQuery = { __typename: 'Query', getWords: { __typename: 'WordOffsetPaginationResponse', records: Array<{ __typename: 'Word', id: string, korDicResults?: Array<string> | null, naverDicResults?: Array<string> | null, status: WordStatus, title: string, pages?: Array<number | null> | null, examples?: Array<string> | null, deniedReason?: string | null, wordId?: string | null, requestors?: Array<{ __typename: 'User', id: string, name: string, role: UserRole, year?: number | null, class?: string | null, number?: number | null, accountId: string }> | null }>, pageInfo: { __typename: 'OffsetPaginationPageInfo', totalRowCount: number, pageCount: number } } };

export type SingleStudentItemsFragment = { __typename: 'User', accountId: string, name: string, year?: number | null, class?: string | null, number?: number | null, role: UserRole };

export type GetStudentQueryVariables = Exact<{
  getUserId: Scalars['ID']['input'];
}>;


export type GetStudentQuery = { __typename: 'Query', getUser: { __typename: 'User', accountId: string, name: string, year?: number | null, class?: string | null, number?: number | null, role: UserRole } };

export type StudentItemsFragment = { __typename: 'User', id: string, name: string, year?: number | null, class?: string | null, number?: number | null, accountId: string, status: UserStatus, role: UserRole };

export type GetStudentsQueryVariables = Exact<{
  paginationOptions: OffsetPaginationOptions;
  filterOptions: UserFilterOptions;
}>;


export type GetStudentsQuery = { __typename: 'Query', getUsers: { __typename: 'UserOffsetPaginationResponse', records: Array<{ __typename: 'User', id: string, name: string, year?: number | null, class?: string | null, number?: number | null, accountId: string, status: UserStatus, role: UserRole }>, pageInfo: { __typename: 'OffsetPaginationPageInfo', totalRowCount: number, pageCount: number } } };

export type SingleTeacherItemsFragment = { __typename: 'User', accountId: string, name: string, year?: number | null, class?: string | null, role: UserRole };

export type GetTeacherQueryVariables = Exact<{
  getUserId: Scalars['ID']['input'];
}>;


export type GetTeacherQuery = { __typename: 'Query', getUser: { __typename: 'User', accountId: string, name: string, year?: number | null, class?: string | null, role: UserRole } };

export type TeacherItemsFragment = { __typename: 'User', id: string, name: string, year?: number | null, class?: string | null, accountId: string, status: UserStatus, role: UserRole };

export type GetTeachersQueryVariables = Exact<{
  paginationOptions: OffsetPaginationOptions;
  filterOptions: UserFilterOptions;
}>;


export type GetTeachersQuery = { __typename: 'Query', getUsers: { __typename: 'UserOffsetPaginationResponse', records: Array<{ __typename: 'User', id: string, name: string, year?: number | null, class?: string | null, accountId: string, status: UserStatus, role: UserRole }>, pageInfo: { __typename: 'OffsetPaginationPageInfo', totalRowCount: number, pageCount: number } } };

export type UserStatItemsFragment = { __typename: 'User', id: string, name: string, year?: number | null, class?: string | null, number?: number | null, approvedCount?: number | null, myVocabCount?: number | null };

export type GetUserStatsQueryVariables = Exact<{
  paginationOptions: OffsetPaginationOptions;
  filterOptions: UserFilterOptions;
}>;


export type GetUserStatsQuery = { __typename: 'Query', getUsers: { __typename: 'UserOffsetPaginationResponse', records: Array<{ __typename: 'User', id: string, name: string, year?: number | null, class?: string | null, number?: number | null, approvedCount?: number | null, myVocabCount?: number | null }>, pageInfo: { __typename: 'OffsetPaginationPageInfo', pageCount: number, totalRowCount: number } } };

export type VocabularyItemsFragment = { __typename: 'Word', id: string, isMyVocabulary?: boolean | null, korDicResults?: Array<string> | null, naverDicResults?: Array<string> | null, title: string, pages?: Array<number | null> | null, examples?: Array<string> | null };

export type GetVocabulariesQueryVariables = Exact<{
  paginationOptions: OffsetPaginationOptions;
  filterOptions: WordFilterOptions;
}>;


export type GetVocabulariesQuery = { __typename: 'Query', getWords: { __typename: 'WordOffsetPaginationResponse', records: Array<{ __typename: 'Word', id: string, isMyVocabulary?: boolean | null, korDicResults?: Array<string> | null, naverDicResults?: Array<string> | null, title: string, pages?: Array<number | null> | null, examples?: Array<string> | null }>, pageInfo: { __typename: 'OffsetPaginationPageInfo', totalRowCount: number, pageCount: number } } };

export const UserItemsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserItems"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"accountId"}}]}}]} as unknown as DocumentNode<UserItemsFragment, unknown>;
export const SingleAdminItemsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SingleAdminItems"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accountId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"year"}},{"kind":"Field","name":{"kind":"Name","value":"class"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]} as unknown as DocumentNode<SingleAdminItemsFragment, unknown>;
export const AdminItemsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AdminItems"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"year"}},{"kind":"Field","name":{"kind":"Name","value":"class"}},{"kind":"Field","name":{"kind":"Name","value":"accountId"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]} as unknown as DocumentNode<AdminItemsFragment, unknown>;
export const WordByTitleItemsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"WordByTitleItems"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Word"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"pages"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"korDicResults"}},{"kind":"Field","name":{"kind":"Name","value":"naverDicResults"}},{"kind":"Field","name":{"kind":"Name","value":"examples"}}]}}]} as unknown as DocumentNode<WordByTitleItemsFragment, unknown>;
export const RequestorDropDownItemsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RequestorDropDownItems"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]} as unknown as DocumentNode<RequestorDropDownItemsFragment, unknown>;
export const RequestorItemsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RequestorItems"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"year"}},{"kind":"Field","name":{"kind":"Name","value":"class"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"accountId"}}]}}]} as unknown as DocumentNode<RequestorItemsFragment, unknown>;
export const DuplicatedWordRequestItemsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DuplicatedWordRequestItems"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Word"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"pages"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"korDicResults"}},{"kind":"Field","name":{"kind":"Name","value":"naverDicResults"}},{"kind":"Field","name":{"kind":"Name","value":"examples"}},{"kind":"Field","name":{"kind":"Name","value":"requestors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"RequestorItems"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RequestorItems"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"year"}},{"kind":"Field","name":{"kind":"Name","value":"class"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"accountId"}}]}}]} as unknown as DocumentNode<DuplicatedWordRequestItemsFragment, unknown>;
export const UserRequestItemsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserRequestItems"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Word"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"korDicResults"}},{"kind":"Field","name":{"kind":"Name","value":"naverDicResults"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"pages"}},{"kind":"Field","name":{"kind":"Name","value":"examples"}},{"kind":"Field","name":{"kind":"Name","value":"deniedReason"}},{"kind":"Field","name":{"kind":"Name","value":"wordId"}}]}}]} as unknown as DocumentNode<UserRequestItemsFragment, unknown>;
export const MyWordRequestItemsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MyWordRequestItems"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Word"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"pages"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"korDicResults"}},{"kind":"Field","name":{"kind":"Name","value":"naverDicResults"}},{"kind":"Field","name":{"kind":"Name","value":"examples"}},{"kind":"Field","name":{"kind":"Name","value":"originalWord"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"pages"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"korDicResults"}},{"kind":"Field","name":{"kind":"Name","value":"naverDicResults"}},{"kind":"Field","name":{"kind":"Name","value":"examples"}}]}}]}}]} as unknown as DocumentNode<MyWordRequestItemsFragment, unknown>;
export const MyRequestItemsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MyRequestItems"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Word"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"korDicResults"}},{"kind":"Field","name":{"kind":"Name","value":"naverDicResults"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"pages"}},{"kind":"Field","name":{"kind":"Name","value":"examples"}},{"kind":"Field","name":{"kind":"Name","value":"deniedReason"}},{"kind":"Field","name":{"kind":"Name","value":"wordId"}}]}}]} as unknown as DocumentNode<MyRequestItemsFragment, unknown>;
export const MyVocabularyItemsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MyVocabularyItems"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Word"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"pages"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"korDicResults"}},{"kind":"Field","name":{"kind":"Name","value":"naverDicResults"}},{"kind":"Field","name":{"kind":"Name","value":"examples"}}]}}]} as unknown as DocumentNode<MyVocabularyItemsFragment, unknown>;
export const PasswordResetRequestorItemsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PasswordResetRequestorItems"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"year"}},{"kind":"Field","name":{"kind":"Name","value":"class"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"accountId"}}]}}]} as unknown as DocumentNode<PasswordResetRequestorItemsFragment, unknown>;
export const PasswordResetRequestItemsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PasswordResetRequestItems"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PasswordResetRequest"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"requestor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PasswordResetRequestorItems"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PasswordResetRequestorItems"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"year"}},{"kind":"Field","name":{"kind":"Name","value":"class"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"accountId"}}]}}]} as unknown as DocumentNode<PasswordResetRequestItemsFragment, unknown>;
export const MyProfileItemsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MyProfileItems"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accountId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"year"}},{"kind":"Field","name":{"kind":"Name","value":"class"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]} as unknown as DocumentNode<MyProfileItemsFragment, unknown>;
export const WordRequestItemsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"WordRequestItems"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Word"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"requestors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"RequestorItems"}}]}},{"kind":"Field","name":{"kind":"Name","value":"korDicResults"}},{"kind":"Field","name":{"kind":"Name","value":"naverDicResults"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"pages"}},{"kind":"Field","name":{"kind":"Name","value":"examples"}},{"kind":"Field","name":{"kind":"Name","value":"deniedReason"}},{"kind":"Field","name":{"kind":"Name","value":"wordId"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RequestorItems"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"year"}},{"kind":"Field","name":{"kind":"Name","value":"class"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"accountId"}}]}}]} as unknown as DocumentNode<WordRequestItemsFragment, unknown>;
export const SingleStudentItemsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SingleStudentItems"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accountId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"year"}},{"kind":"Field","name":{"kind":"Name","value":"class"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]} as unknown as DocumentNode<SingleStudentItemsFragment, unknown>;
export const StudentItemsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StudentItems"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"year"}},{"kind":"Field","name":{"kind":"Name","value":"class"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"accountId"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]} as unknown as DocumentNode<StudentItemsFragment, unknown>;
export const SingleTeacherItemsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SingleTeacherItems"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accountId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"year"}},{"kind":"Field","name":{"kind":"Name","value":"class"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]} as unknown as DocumentNode<SingleTeacherItemsFragment, unknown>;
export const TeacherItemsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TeacherItems"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"year"}},{"kind":"Field","name":{"kind":"Name","value":"class"}},{"kind":"Field","name":{"kind":"Name","value":"accountId"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]} as unknown as DocumentNode<TeacherItemsFragment, unknown>;
export const UserStatItemsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserStatItems"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"year"}},{"kind":"Field","name":{"kind":"Name","value":"class"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"approvedCount"}},{"kind":"Field","name":{"kind":"Name","value":"myVocabCount"}}]}}]} as unknown as DocumentNode<UserStatItemsFragment, unknown>;
export const VocabularyItemsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"VocabularyItems"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Word"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isMyVocabulary"}},{"kind":"Field","name":{"kind":"Name","value":"korDicResults"}},{"kind":"Field","name":{"kind":"Name","value":"naverDicResults"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"pages"}},{"kind":"Field","name":{"kind":"Name","value":"examples"}}]}}]} as unknown as DocumentNode<VocabularyItemsFragment, unknown>;
export const GetUsersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetUsers"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"paginationOptions"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"OffsetPaginationOptions"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filterOptions"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UserFilterOptions"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getUsers"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"paginationOptions"},"value":{"kind":"Variable","name":{"kind":"Name","value":"paginationOptions"}}},{"kind":"Argument","name":{"kind":"Name","value":"filterOptions"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filterOptions"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"records"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserItems"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalRowCount"}},{"kind":"Field","name":{"kind":"Name","value":"pageCount"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserItems"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"accountId"}}]}}]} as unknown as DocumentNode<GetUsersQuery, GetUsersQueryVariables>;
export const BulkCreateStudentsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"BulkCreateStudents"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"inputs"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UserInput"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bulkCreateUsers"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"inputs"},"value":{"kind":"Variable","name":{"kind":"Name","value":"inputs"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<BulkCreateStudentsMutation, BulkCreateStudentsMutationVariables>;
export const GetAdminDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAdmin"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"getUserId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"getUserId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SingleAdminItems"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SingleAdminItems"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accountId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"year"}},{"kind":"Field","name":{"kind":"Name","value":"class"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]} as unknown as DocumentNode<GetAdminQuery, GetAdminQueryVariables>;
export const GetAdminsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAdmins"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"paginationOptions"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"OffsetPaginationOptions"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filterOptions"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UserFilterOptions"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getUsers"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"paginationOptions"},"value":{"kind":"Variable","name":{"kind":"Name","value":"paginationOptions"}}},{"kind":"Argument","name":{"kind":"Name","value":"filterOptions"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filterOptions"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"records"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AdminItems"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalRowCount"}},{"kind":"Field","name":{"kind":"Name","value":"pageCount"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AdminItems"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"year"}},{"kind":"Field","name":{"kind":"Name","value":"class"}},{"kind":"Field","name":{"kind":"Name","value":"accountId"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]} as unknown as DocumentNode<GetAdminsQuery, GetAdminsQueryVariables>;
export const FindMyIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"FindMyId"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"FindMyIdInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"findMyId"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<FindMyIdMutation, FindMyIdMutationVariables>;
export const DuplicateWordRequestDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DuplicateWordRequest"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"WordInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"duplicateWordRequest"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<DuplicateWordRequestMutation, DuplicateWordRequestMutationVariables>;
export const CreateWordRequestDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateWordRequest"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"WordInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createWordRequest"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<CreateWordRequestMutation, CreateWordRequestMutationVariables>;
export const GetWordByTitleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetWordByTitle"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"title"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getWordByTitle"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"title"},"value":{"kind":"Variable","name":{"kind":"Name","value":"title"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"WordByTitleItems"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"WordByTitleItems"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Word"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"pages"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"korDicResults"}},{"kind":"Field","name":{"kind":"Name","value":"naverDicResults"}},{"kind":"Field","name":{"kind":"Name","value":"examples"}}]}}]} as unknown as DocumentNode<GetWordByTitleQuery, GetWordByTitleQueryVariables>;
export const UpdateWordRequestDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateWordRequest"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"WordInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateWordRequest"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<UpdateWordRequestMutation, UpdateWordRequestMutationVariables>;
export const ChangeCurrentPasswordDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ChangeCurrentPassword"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"changeCurrentPasswordId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"FindPasswordInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"changeCurrentPassword"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"changeCurrentPasswordId"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<ChangeCurrentPasswordMutation, ChangeCurrentPasswordMutationVariables>;
export const BulkPasswordResetDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"BulkPasswordReset"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"ids"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bulkPasswordReset"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"ids"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ids"}}}]}]}}]} as unknown as DocumentNode<BulkPasswordResetMutation, BulkPasswordResetMutationVariables>;
export const PasswordResetDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"PasswordReset"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"passwordResetId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"passwordReset"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"passwordResetId"}}},{"kind":"Argument","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<PasswordResetMutation, PasswordResetMutationVariables>;
export const CreatePasswordResetRequestDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreatePasswordResetRequest"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PasswordResetRequestInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createPasswordResetRequest"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<CreatePasswordResetRequestMutation, CreatePasswordResetRequestMutationVariables>;
export const SendPasswordResetEmailDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SendPasswordResetEmail"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PasswordResetEmailInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sendPasswordResetEmail"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<SendPasswordResetEmailMutation, SendPasswordResetEmailMutationVariables>;
export const PasswordSetUpDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"PasswordSetUp"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"passwordSetUpId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"passwordSetUp"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"passwordSetUpId"}}},{"kind":"Argument","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<PasswordSetUpMutation, PasswordSetUpMutationVariables>;
export const GetRequestorsDropDownDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetRequestorsDropDown"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"paginationOptions"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"OffsetPaginationOptions"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filterOptions"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RequestorFilterOptions"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getRequestors"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"paginationOptions"},"value":{"kind":"Variable","name":{"kind":"Name","value":"paginationOptions"}}},{"kind":"Argument","name":{"kind":"Name","value":"filterOptions"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filterOptions"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"records"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"RequestorDropDownItems"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalRowCount"}},{"kind":"Field","name":{"kind":"Name","value":"pageCount"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RequestorDropDownItems"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]} as unknown as DocumentNode<GetRequestorsDropDownQuery, GetRequestorsDropDownQueryVariables>;
export const GetWordDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetWord"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"getWordId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getWord"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"getWordId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"DuplicatedWordRequestItems"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RequestorItems"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"year"}},{"kind":"Field","name":{"kind":"Name","value":"class"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"accountId"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DuplicatedWordRequestItems"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Word"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"pages"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"korDicResults"}},{"kind":"Field","name":{"kind":"Name","value":"naverDicResults"}},{"kind":"Field","name":{"kind":"Name","value":"examples"}},{"kind":"Field","name":{"kind":"Name","value":"requestors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"RequestorItems"}}]}}]}}]} as unknown as DocumentNode<GetWordQuery, GetWordQueryVariables>;
export const ApproveDuplicatedWordRequestDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ApproveDuplicatedWordRequest"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"approveDuplicatedWordRequestId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"approveDuplicatedWordRequest"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"approveDuplicatedWordRequestId"}}}]}]}}]} as unknown as DocumentNode<ApproveDuplicatedWordRequestMutation, ApproveDuplicatedWordRequestMutationVariables>;
export const BulkApproveWordRequestsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"BulkApproveWordRequests"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"ids"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bulkApproveWordRequests"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"ids"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ids"}}}]}]}}]} as unknown as DocumentNode<BulkApproveWordRequestsMutation, BulkApproveWordRequestsMutationVariables>;
export const BulkDenyWordRequestsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"BulkDenyWordRequests"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"ids"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bulkDenyWordRequests"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"ids"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ids"}}}]}]}}]} as unknown as DocumentNode<BulkDenyWordRequestsMutation, BulkDenyWordRequestsMutationVariables>;
export const BulkRecoverWordRequestsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"BulkRecoverWordRequests"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"ids"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bulkRecoverWordRequests"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"ids"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ids"}}}]}]}}]} as unknown as DocumentNode<BulkRecoverWordRequestsMutation, BulkRecoverWordRequestsMutationVariables>;
export const BulkDeleteWordRequestsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"BulkDeleteWordRequests"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"ids"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bulkDeleteWordRequests"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"ids"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ids"}}}]}]}}]} as unknown as DocumentNode<BulkDeleteWordRequestsMutation, BulkDeleteWordRequestsMutationVariables>;
export const ApproveWordRequestDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ApproveWordRequest"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"approveWordRequestId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"approveWordRequest"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"approveWordRequestId"}}}]}]}}]} as unknown as DocumentNode<ApproveWordRequestMutation, ApproveWordRequestMutationVariables>;
export const DenyWordRequestDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DenyWordRequest"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"denyWordRequestId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"deniedReason"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"denyWordRequest"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"denyWordRequestId"}}},{"kind":"Argument","name":{"kind":"Name","value":"deniedReason"},"value":{"kind":"Variable","name":{"kind":"Name","value":"deniedReason"}}}]}]}}]} as unknown as DocumentNode<DenyWordRequestMutation, DenyWordRequestMutationVariables>;
export const RecoverWordRequestDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RecoverWordRequest"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"recoverWordRequestId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"recoverWordRequest"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"recoverWordRequestId"}}}]}]}}]} as unknown as DocumentNode<RecoverWordRequestMutation, RecoverWordRequestMutationVariables>;
export const DeleteWordRequestDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteWordRequest"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"deleteWordRequestId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteWordRequest"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"deleteWordRequestId"}}}]}]}}]} as unknown as DocumentNode<DeleteWordRequestMutation, DeleteWordRequestMutationVariables>;
export const UpdateDeniedReasonDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateDeniedReason"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"updateDeniedReasonId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"deniedReason"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateDeniedReason"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"updateDeniedReasonId"}}},{"kind":"Argument","name":{"kind":"Name","value":"deniedReason"},"value":{"kind":"Variable","name":{"kind":"Name","value":"deniedReason"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"deniedReason"}}]}}]}}]} as unknown as DocumentNode<UpdateDeniedReasonMutation, UpdateDeniedReasonMutationVariables>;
export const BulkApproveUsersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"BulkApproveUsers"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"ids"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bulkApproveUsers"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"ids"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ids"}}}]}]}}]} as unknown as DocumentNode<BulkApproveUsersMutation, BulkApproveUsersMutationVariables>;
export const BulkDenyUsersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"BulkDenyUsers"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"ids"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bulkDenyUsers"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"ids"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ids"}}}]}]}}]} as unknown as DocumentNode<BulkDenyUsersMutation, BulkDenyUsersMutationVariables>;
export const BulkRecoverUsersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"BulkRecoverUsers"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"ids"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bulkRecoverUsers"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"ids"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ids"}}}]}]}}]} as unknown as DocumentNode<BulkRecoverUsersMutation, BulkRecoverUsersMutationVariables>;
export const BulkDeleteUsersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"BulkDeleteUsers"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"ids"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bulkDeleteUsers"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"ids"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ids"}}}]}]}}]} as unknown as DocumentNode<BulkDeleteUsersMutation, BulkDeleteUsersMutationVariables>;
export const ApproveUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ApproveUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"approveUserId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"approveUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"approveUserId"}}}]}]}}]} as unknown as DocumentNode<ApproveUserMutation, ApproveUserMutationVariables>;
export const DenyUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DenyUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"denyUserId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"denyUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"denyUserId"}}}]}]}}]} as unknown as DocumentNode<DenyUserMutation, DenyUserMutationVariables>;
export const RecoverUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RecoverUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"recoverUserId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"recoverUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"recoverUserId"}}}]}]}}]} as unknown as DocumentNode<RecoverUserMutation, RecoverUserMutationVariables>;
export const DeleteUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"deleteUserId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"deleteUserId"}}}]}]}}]} as unknown as DocumentNode<DeleteUserMutation, DeleteUserMutationVariables>;
export const CreateUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UserInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<CreateUserMutation, CreateUserMutationVariables>;
export const AccountIdCheckDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AccountIdCheck"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"accountId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accountIdCheck"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"accountId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"accountId"}}}]}]}}]} as unknown as DocumentNode<AccountIdCheckQuery, AccountIdCheckQueryVariables>;
export const GetUserRequestsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetUserRequests"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"paginationOptions"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"OffsetPaginationOptions"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filterOptions"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"WordFilterOptions"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getWords"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"paginationOptions"},"value":{"kind":"Variable","name":{"kind":"Name","value":"paginationOptions"}}},{"kind":"Argument","name":{"kind":"Name","value":"filterOptions"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filterOptions"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"records"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserRequestItems"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalRowCount"}},{"kind":"Field","name":{"kind":"Name","value":"pageCount"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserRequestItems"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Word"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"korDicResults"}},{"kind":"Field","name":{"kind":"Name","value":"naverDicResults"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"pages"}},{"kind":"Field","name":{"kind":"Name","value":"examples"}},{"kind":"Field","name":{"kind":"Name","value":"deniedReason"}},{"kind":"Field","name":{"kind":"Name","value":"wordId"}}]}}]} as unknown as DocumentNode<GetUserRequestsQuery, GetUserRequestsQueryVariables>;
export const UpdateUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"updateUserId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UserInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"updateUserId"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<UpdateUserMutation, UpdateUserMutationVariables>;
export const AddMyVocabularyDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AddMyVocabulary"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MyVocabularyInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addMyVocabulary"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<AddMyVocabularyMutation, AddMyVocabularyMutationVariables>;
export const RemoveMyVocabularyDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RemoveMyVocabulary"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MyVocabularyInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeMyVocabulary"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<RemoveMyVocabularyMutation, RemoveMyVocabularyMutationVariables>;
export const GetUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"getUserId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"getUserId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sessionVersion"}}]}}]}}]} as unknown as DocumentNode<GetUserQuery, GetUserQueryVariables>;
export const GetMyWordRequestDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMyWordRequest"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"getWordId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getWord"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"getWordId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MyWordRequestItems"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"requestors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MyWordRequestItems"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Word"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"pages"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"korDicResults"}},{"kind":"Field","name":{"kind":"Name","value":"naverDicResults"}},{"kind":"Field","name":{"kind":"Name","value":"examples"}},{"kind":"Field","name":{"kind":"Name","value":"originalWord"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"pages"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"korDicResults"}},{"kind":"Field","name":{"kind":"Name","value":"naverDicResults"}},{"kind":"Field","name":{"kind":"Name","value":"examples"}}]}}]}}]} as unknown as DocumentNode<GetMyWordRequestQuery, GetMyWordRequestQueryVariables>;
export const GetMyRequestsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMyRequests"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"paginationOptions"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"OffsetPaginationOptions"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filterOptions"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"WordFilterOptions"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getMyRequests"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"paginationOptions"},"value":{"kind":"Variable","name":{"kind":"Name","value":"paginationOptions"}}},{"kind":"Argument","name":{"kind":"Name","value":"filterOptions"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filterOptions"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"records"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MyRequestItems"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalRowCount"}},{"kind":"Field","name":{"kind":"Name","value":"pageCount"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MyRequestItems"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Word"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"korDicResults"}},{"kind":"Field","name":{"kind":"Name","value":"naverDicResults"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"pages"}},{"kind":"Field","name":{"kind":"Name","value":"examples"}},{"kind":"Field","name":{"kind":"Name","value":"deniedReason"}},{"kind":"Field","name":{"kind":"Name","value":"wordId"}}]}}]} as unknown as DocumentNode<GetMyRequestsQuery, GetMyRequestsQueryVariables>;
export const GetMyVocabulariesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMyVocabularies"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"paginationOptions"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"OffsetPaginationOptions"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filterOptions"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MyVocabularyFilterOptions"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getMyVocabularies"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"paginationOptions"},"value":{"kind":"Variable","name":{"kind":"Name","value":"paginationOptions"}}},{"kind":"Argument","name":{"kind":"Name","value":"filterOptions"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filterOptions"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"records"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"word"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MyVocabularyItems"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pageCount"}},{"kind":"Field","name":{"kind":"Name","value":"totalRowCount"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MyVocabularyItems"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Word"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"pages"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"korDicResults"}},{"kind":"Field","name":{"kind":"Name","value":"naverDicResults"}},{"kind":"Field","name":{"kind":"Name","value":"examples"}}]}}]} as unknown as DocumentNode<GetMyVocabulariesQuery, GetMyVocabulariesQueryVariables>;
export const GetMyPasswordDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMyPassword"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getCurrentUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"password"}}]}}]}}]} as unknown as DocumentNode<GetMyPasswordQuery, GetMyPasswordQueryVariables>;
export const FindMyPasswordDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FindMyPassword"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"accountId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"findPassword"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"accountId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"accountId"}}}]}]}}]} as unknown as DocumentNode<FindMyPasswordQuery, FindMyPasswordQueryVariables>;
export const GetPasswordResetRequestsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPasswordResetRequests"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"paginationOptions"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"OffsetPaginationOptions"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filterOptions"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PasswordResetRequestFilterOptions"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getPasswordResetRequests"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"paginationOptions"},"value":{"kind":"Variable","name":{"kind":"Name","value":"paginationOptions"}}},{"kind":"Argument","name":{"kind":"Name","value":"filterOptions"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filterOptions"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"records"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PasswordResetRequestItems"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pageCount"}},{"kind":"Field","name":{"kind":"Name","value":"totalRowCount"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PasswordResetRequestorItems"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"year"}},{"kind":"Field","name":{"kind":"Name","value":"class"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"accountId"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PasswordResetRequestItems"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PasswordResetRequest"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"requestor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PasswordResetRequestorItems"}}]}}]}}]} as unknown as DocumentNode<GetPasswordResetRequestsQuery, GetPasswordResetRequestsQueryVariables>;
export const GetMyProfileDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMyProfile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getCurrentUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"MyProfileItems"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MyProfileItems"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accountId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"year"}},{"kind":"Field","name":{"kind":"Name","value":"class"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]} as unknown as DocumentNode<GetMyProfileQuery, GetMyProfileQueryVariables>;
export const GetWordRequestsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetWordRequests"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"paginationOptions"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"OffsetPaginationOptions"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filterOptions"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"WordFilterOptions"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getWords"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"paginationOptions"},"value":{"kind":"Variable","name":{"kind":"Name","value":"paginationOptions"}}},{"kind":"Argument","name":{"kind":"Name","value":"filterOptions"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filterOptions"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"records"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"WordRequestItems"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalRowCount"}},{"kind":"Field","name":{"kind":"Name","value":"pageCount"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RequestorItems"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"year"}},{"kind":"Field","name":{"kind":"Name","value":"class"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"accountId"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"WordRequestItems"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Word"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"requestors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"RequestorItems"}}]}},{"kind":"Field","name":{"kind":"Name","value":"korDicResults"}},{"kind":"Field","name":{"kind":"Name","value":"naverDicResults"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"pages"}},{"kind":"Field","name":{"kind":"Name","value":"examples"}},{"kind":"Field","name":{"kind":"Name","value":"deniedReason"}},{"kind":"Field","name":{"kind":"Name","value":"wordId"}}]}}]} as unknown as DocumentNode<GetWordRequestsQuery, GetWordRequestsQueryVariables>;
export const GetStudentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetStudent"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"getUserId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"getUserId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SingleStudentItems"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SingleStudentItems"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accountId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"year"}},{"kind":"Field","name":{"kind":"Name","value":"class"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]} as unknown as DocumentNode<GetStudentQuery, GetStudentQueryVariables>;
export const GetStudentsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetStudents"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"paginationOptions"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"OffsetPaginationOptions"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filterOptions"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UserFilterOptions"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getUsers"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"paginationOptions"},"value":{"kind":"Variable","name":{"kind":"Name","value":"paginationOptions"}}},{"kind":"Argument","name":{"kind":"Name","value":"filterOptions"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filterOptions"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"records"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"StudentItems"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalRowCount"}},{"kind":"Field","name":{"kind":"Name","value":"pageCount"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StudentItems"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"year"}},{"kind":"Field","name":{"kind":"Name","value":"class"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"accountId"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]} as unknown as DocumentNode<GetStudentsQuery, GetStudentsQueryVariables>;
export const GetTeacherDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetTeacher"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"getUserId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"getUserId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SingleTeacherItems"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SingleTeacherItems"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accountId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"year"}},{"kind":"Field","name":{"kind":"Name","value":"class"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]} as unknown as DocumentNode<GetTeacherQuery, GetTeacherQueryVariables>;
export const GetTeachersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetTeachers"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"paginationOptions"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"OffsetPaginationOptions"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filterOptions"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UserFilterOptions"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getUsers"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"paginationOptions"},"value":{"kind":"Variable","name":{"kind":"Name","value":"paginationOptions"}}},{"kind":"Argument","name":{"kind":"Name","value":"filterOptions"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filterOptions"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"records"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TeacherItems"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalRowCount"}},{"kind":"Field","name":{"kind":"Name","value":"pageCount"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TeacherItems"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"year"}},{"kind":"Field","name":{"kind":"Name","value":"class"}},{"kind":"Field","name":{"kind":"Name","value":"accountId"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]} as unknown as DocumentNode<GetTeachersQuery, GetTeachersQueryVariables>;
export const GetUserStatsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetUserStats"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"paginationOptions"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"OffsetPaginationOptions"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filterOptions"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UserFilterOptions"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getUsers"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"paginationOptions"},"value":{"kind":"Variable","name":{"kind":"Name","value":"paginationOptions"}}},{"kind":"Argument","name":{"kind":"Name","value":"filterOptions"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filterOptions"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"records"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserStatItems"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pageCount"}},{"kind":"Field","name":{"kind":"Name","value":"totalRowCount"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserStatItems"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"year"}},{"kind":"Field","name":{"kind":"Name","value":"class"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"approvedCount"}},{"kind":"Field","name":{"kind":"Name","value":"myVocabCount"}}]}}]} as unknown as DocumentNode<GetUserStatsQuery, GetUserStatsQueryVariables>;
export const GetVocabulariesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetVocabularies"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"paginationOptions"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"OffsetPaginationOptions"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filterOptions"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"WordFilterOptions"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getWords"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"paginationOptions"},"value":{"kind":"Variable","name":{"kind":"Name","value":"paginationOptions"}}},{"kind":"Argument","name":{"kind":"Name","value":"filterOptions"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filterOptions"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"records"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"VocabularyItems"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalRowCount"}},{"kind":"Field","name":{"kind":"Name","value":"pageCount"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"VocabularyItems"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Word"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isMyVocabulary"}},{"kind":"Field","name":{"kind":"Name","value":"korDicResults"}},{"kind":"Field","name":{"kind":"Name","value":"naverDicResults"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"pages"}},{"kind":"Field","name":{"kind":"Name","value":"examples"}}]}}]} as unknown as DocumentNode<GetVocabulariesQuery, GetVocabulariesQueryVariables>;