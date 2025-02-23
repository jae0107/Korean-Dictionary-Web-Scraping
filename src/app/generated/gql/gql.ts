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
    "\n  fragment SingleAdminItems on User {\n    accountId\n    name\n    year\n    class\n    role\n  }\n": types.SingleAdminItemsFragmentDoc,
    "\n  query GetAdmin($getUserId: ID!) {\n    getUser(id: $getUserId) {\n      ...SingleAdminItems\n    }\n  }\n": types.GetAdminDocument,
    "\n  fragment AdminItems on User {\n    id\n    name\n    year\n    class\n    accountId\n    status\n    role\n  }\n": types.AdminItemsFragmentDoc,
    "\n  query GetAdmins($paginationOptions: OffsetPaginationOptions!, $filterOptions: UserFilterOptions!) {\n    getUsers(paginationOptions: $paginationOptions, filterOptions: $filterOptions) {\n      records {\n        ...AdminItems\n      }\n      pageInfo {\n        totalRowCount\n        pageCount\n      }\n    }\n  }\n": types.GetAdminsDocument,
    "\n  query GetMyRole {\n    getCurrentUser {\n      id\n      role\n    }\n  }\n": types.GetMyRoleDocument,
    "\n  mutation CreateWordRequest($input: WordInput!) {\n    createWordRequest(input: $input) {\n      id\n    }\n  }\n": types.CreateWordRequestDocument,
    "\n  mutation ChangeCurrentPassword($changeCurrentPasswordId: ID!, $input: FindPasswordInput!) {\n    changeCurrentPassword(id: $changeCurrentPasswordId, input: $input) {\n      id\n    }\n  }\n": types.ChangeCurrentPasswordDocument,
    "\n  mutation PasswordReset($input: PasswordResetInput!) {\n    passwordReset(input: $input) {\n      id\n    }\n  }\n": types.PasswordResetDocument,
    "\n  fragment RequestorDropDownItems on User {\n    id\n    name\n  }\n": types.RequestorDropDownItemsFragmentDoc,
    "\n  query GetRequestorsDropDown($paginationOptions: OffsetPaginationOptions!, $filterOptions: RequestorFilterOptions!) {\n    getRequestors(paginationOptions: $paginationOptions, filterOptions: $filterOptions) {\n      records {\n        ...RequestorDropDownItems\n      }\n      pageInfo {\n        totalRowCount\n        pageCount\n      }\n    }\n  }\n": types.GetRequestorsDropDownDocument,
    "\n  mutation BulkApproveWordRequests($ids: [ID!]!) {\n    bulkApproveWordRequests(ids: $ids)\n  }\n": types.BulkApproveWordRequestsDocument,
    "\n  mutation BulkDenyWordRequests($ids: [ID!]!) {\n    bulkDenyWordRequests(ids: $ids)\n  }\n": types.BulkDenyWordRequestsDocument,
    "\n  mutation BulkRecoverWordRequests($ids: [ID!]!) {\n    bulkRecoverWordRequests(ids: $ids)\n  }\n": types.BulkRecoverWordRequestsDocument,
    "\n  mutation BulkDeleteWordRequests($ids: [ID!]!) {\n    bulkDeleteWordRequests(ids: $ids)\n  }\n": types.BulkDeleteWordRequestsDocument,
    "\n  mutation ApproveWordRequest($approveWordRequestId: ID!) {\n    approveWordRequest(id: $approveWordRequestId)\n  }\n": types.ApproveWordRequestDocument,
    "\n  mutation DenyWordRequest($denyWordRequestId: ID!, $deniedReason: String) {\n    denyWordRequest(id: $denyWordRequestId, deniedReason: $deniedReason)\n  }\n": types.DenyWordRequestDocument,
    "\n  mutation RecoverWordRequest($recoverWordRequestId: ID!) {\n    recoverWordRequest(id: $recoverWordRequestId)\n  }\n": types.RecoverWordRequestDocument,
    "\n  mutation DeleteWordRequest($deleteWordRequestId: ID!) {\n    deleteWordRequest(id: $deleteWordRequestId)\n  }\n": types.DeleteWordRequestDocument,
    "\n  mutation UpdateDeniedReason($updateDeniedReasonId: ID!, $deniedReason: String) {\n    updateDeniedReason(id: $updateDeniedReasonId, deniedReason: $deniedReason) {\n      id\n      deniedReason\n    }\n  }\n": types.UpdateDeniedReasonDocument,
    "\n  mutation BulkApproveUsers($ids: [ID!]!) {\n    bulkApproveUsers(ids: $ids)\n  }\n": types.BulkApproveUsersDocument,
    "\n  mutation BulkDenyUsers($ids: [ID!]!) {\n    bulkDenyUsers(ids: $ids)\n  }\n": types.BulkDenyUsersDocument,
    "\n  mutation BulkRecoverUsers($ids: [ID!]!) {\n    bulkRecoverUsers(ids: $ids)\n  }\n": types.BulkRecoverUsersDocument,
    "\n  mutation BulkDeleteUsers($ids: [ID!]!) {\n    bulkDeleteUsers(ids: $ids)\n  }\n": types.BulkDeleteUsersDocument,
    "\n  mutation ApproveUser($approveUserId: ID!) {\n    approveUser(id: $approveUserId)\n  }\n": types.ApproveUserDocument,
    "\n  mutation DenyUser($denyUserId: ID!) {\n    denyUser(id: $denyUserId)\n  }\n": types.DenyUserDocument,
    "\n  mutation RecoverUser($recoverUserId: ID!) {\n    recoverUser(id: $recoverUserId)\n  }\n": types.RecoverUserDocument,
    "\n  mutation DeleteUser($deleteUserId: ID!) {\n    deleteUser(id: $deleteUserId)\n  }\n": types.DeleteUserDocument,
    "\n  mutation CreateUser($input: UserInput!) {\n    createUser(input: $input) {\n      id\n    }\n  }\n": types.CreateUserDocument,
    "\n  query AccountIdCheck($accountId: String!) {\n    accountIdCheck(accountId: $accountId)\n  }\n": types.AccountIdCheckDocument,
    "\n  fragment UserRequestItems on Word {\n    id\n    korDicResults\n    naverDicResults\n    status\n    title\n    page\n    example\n    deniedReason\n  }\n": types.UserRequestItemsFragmentDoc,
    "\n  query GetUserRequests($paginationOptions: OffsetPaginationOptions!, $filterOptions: WordFilterOptions!) {\n    getWords(paginationOptions: $paginationOptions, filterOptions: $filterOptions) {\n      records {\n        ...UserRequestItems\n      }\n      pageInfo {\n        totalRowCount\n        pageCount\n      }\n    }\n  }\n": types.GetUserRequestsDocument,
    "\n  mutation UpdateUser($updateUserId: ID!, $input: UserInput!) {\n    updateUser(id: $updateUserId, input: $input) {\n      id\n    }\n  }\n": types.UpdateUserDocument,
    "\n  fragment MyRequestItems on Word {\n    id\n    korDicResults\n    naverDicResults\n    title\n    page\n    example\n    deniedReason\n  }\n": types.MyRequestItemsFragmentDoc,
    "\n  query GetMyRequests($paginationOptions: OffsetPaginationOptions!, $filterOptions: WordFilterOptions!) {\n    getMyRequests(paginationOptions: $paginationOptions, filterOptions: $filterOptions) {\n      records {\n        ...MyRequestItems\n      }\n      pageInfo {\n        totalRowCount\n        pageCount\n      }\n    }\n  }\n": types.GetMyRequestsDocument,
    "\n  query GetMyPassword {\n    getCurrentUser {\n      id\n      password\n    }\n  }\n": types.GetMyPasswordDocument,
    "\n  query FindMyPassword($accountId: String!) {\n    findPassword(accountId: $accountId)\n  }\n": types.FindMyPasswordDocument,
    "\n  fragment MyProfileItems on User {\n    accountId\n    name\n    year\n    class\n    number\n    role\n  }\n": types.MyProfileItemsFragmentDoc,
    "\n  query GetMyProfile {\n    getCurrentUser {\n      id\n      ...MyProfileItems\n    }\n  }\n": types.GetMyProfileDocument,
    "\n  fragment RequestorItems on User {\n    id\n    name\n    role\n    year\n    class\n    number\n    accountId\n  }\n": types.RequestorItemsFragmentDoc,
    "\n  fragment WordRequestItems on Word {\n    id\n    requestor {\n      ...RequestorItems\n    }\n    korDicResults\n    naverDicResults\n    status\n    title\n    page\n    example\n    deniedReason\n  }\n": types.WordRequestItemsFragmentDoc,
    "\n  query GetWordRequests($paginationOptions: OffsetPaginationOptions!, $filterOptions: WordFilterOptions!) {\n    getWords(paginationOptions: $paginationOptions, filterOptions: $filterOptions) {\n      records {\n        ...WordRequestItems\n      }\n      pageInfo {\n        totalRowCount\n        pageCount\n      }\n    }\n  }\n": types.GetWordRequestsDocument,
    "\n  fragment SingleStudentItems on User {\n    accountId\n    name\n    year\n    class\n    number\n    role\n  }\n": types.SingleStudentItemsFragmentDoc,
    "\n  query GetStudent($getUserId: ID!) {\n    getUser(id: $getUserId) {\n      ...SingleStudentItems\n    }\n  }\n": types.GetStudentDocument,
    "\n  fragment StudentItems on User {\n    id\n    name\n    year\n    class\n    number\n    accountId\n    status\n    role\n    status\n  }\n": types.StudentItemsFragmentDoc,
    "\n  query GetStudents($paginationOptions: OffsetPaginationOptions!, $filterOptions: UserFilterOptions!) {\n    getUsers(paginationOptions: $paginationOptions, filterOptions: $filterOptions) {\n      records {\n        ...StudentItems\n      }\n      pageInfo {\n        totalRowCount\n        pageCount\n      }\n    }\n  }\n": types.GetStudentsDocument,
    "\n  fragment SingleTeacherItems on User {\n    accountId\n    name\n    year\n    class\n    role\n  }\n": types.SingleTeacherItemsFragmentDoc,
    "\n  query GetTeacher($getUserId: ID!) {\n    getUser(id: $getUserId) {\n      ...SingleTeacherItems\n    }\n  }\n": types.GetTeacherDocument,
    "\n  fragment TeacherItems on User {\n    id\n    name\n    year\n    class\n    accountId\n    status\n    role\n    status\n  }\n": types.TeacherItemsFragmentDoc,
    "\n  query GetTeachers($paginationOptions: OffsetPaginationOptions!, $filterOptions: UserFilterOptions!) {\n    getUsers(paginationOptions: $paginationOptions, filterOptions: $filterOptions) {\n      records {\n        ...TeacherItems\n      }\n      pageInfo {\n        totalRowCount\n        pageCount\n      }\n    }\n  }\n": types.GetTeachersDocument,
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
export function gql(source: "\n  fragment SingleAdminItems on User {\n    accountId\n    name\n    year\n    class\n    role\n  }\n"): (typeof documents)["\n  fragment SingleAdminItems on User {\n    accountId\n    name\n    year\n    class\n    role\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetAdmin($getUserId: ID!) {\n    getUser(id: $getUserId) {\n      ...SingleAdminItems\n    }\n  }\n"): (typeof documents)["\n  query GetAdmin($getUserId: ID!) {\n    getUser(id: $getUserId) {\n      ...SingleAdminItems\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  fragment AdminItems on User {\n    id\n    name\n    year\n    class\n    accountId\n    status\n    role\n  }\n"): (typeof documents)["\n  fragment AdminItems on User {\n    id\n    name\n    year\n    class\n    accountId\n    status\n    role\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetAdmins($paginationOptions: OffsetPaginationOptions!, $filterOptions: UserFilterOptions!) {\n    getUsers(paginationOptions: $paginationOptions, filterOptions: $filterOptions) {\n      records {\n        ...AdminItems\n      }\n      pageInfo {\n        totalRowCount\n        pageCount\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetAdmins($paginationOptions: OffsetPaginationOptions!, $filterOptions: UserFilterOptions!) {\n    getUsers(paginationOptions: $paginationOptions, filterOptions: $filterOptions) {\n      records {\n        ...AdminItems\n      }\n      pageInfo {\n        totalRowCount\n        pageCount\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetMyRole {\n    getCurrentUser {\n      id\n      role\n    }\n  }\n"): (typeof documents)["\n  query GetMyRole {\n    getCurrentUser {\n      id\n      role\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation CreateWordRequest($input: WordInput!) {\n    createWordRequest(input: $input) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation CreateWordRequest($input: WordInput!) {\n    createWordRequest(input: $input) {\n      id\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation ChangeCurrentPassword($changeCurrentPasswordId: ID!, $input: FindPasswordInput!) {\n    changeCurrentPassword(id: $changeCurrentPasswordId, input: $input) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation ChangeCurrentPassword($changeCurrentPasswordId: ID!, $input: FindPasswordInput!) {\n    changeCurrentPassword(id: $changeCurrentPasswordId, input: $input) {\n      id\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation PasswordReset($input: PasswordResetInput!) {\n    passwordReset(input: $input) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation PasswordReset($input: PasswordResetInput!) {\n    passwordReset(input: $input) {\n      id\n    }\n  }\n"];
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
export function gql(source: "\n  mutation BulkApproveWordRequests($ids: [ID!]!) {\n    bulkApproveWordRequests(ids: $ids)\n  }\n"): (typeof documents)["\n  mutation BulkApproveWordRequests($ids: [ID!]!) {\n    bulkApproveWordRequests(ids: $ids)\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation BulkDenyWordRequests($ids: [ID!]!) {\n    bulkDenyWordRequests(ids: $ids)\n  }\n"): (typeof documents)["\n  mutation BulkDenyWordRequests($ids: [ID!]!) {\n    bulkDenyWordRequests(ids: $ids)\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation BulkRecoverWordRequests($ids: [ID!]!) {\n    bulkRecoverWordRequests(ids: $ids)\n  }\n"): (typeof documents)["\n  mutation BulkRecoverWordRequests($ids: [ID!]!) {\n    bulkRecoverWordRequests(ids: $ids)\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation BulkDeleteWordRequests($ids: [ID!]!) {\n    bulkDeleteWordRequests(ids: $ids)\n  }\n"): (typeof documents)["\n  mutation BulkDeleteWordRequests($ids: [ID!]!) {\n    bulkDeleteWordRequests(ids: $ids)\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation ApproveWordRequest($approveWordRequestId: ID!) {\n    approveWordRequest(id: $approveWordRequestId)\n  }\n"): (typeof documents)["\n  mutation ApproveWordRequest($approveWordRequestId: ID!) {\n    approveWordRequest(id: $approveWordRequestId)\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation DenyWordRequest($denyWordRequestId: ID!, $deniedReason: String) {\n    denyWordRequest(id: $denyWordRequestId, deniedReason: $deniedReason)\n  }\n"): (typeof documents)["\n  mutation DenyWordRequest($denyWordRequestId: ID!, $deniedReason: String) {\n    denyWordRequest(id: $denyWordRequestId, deniedReason: $deniedReason)\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation RecoverWordRequest($recoverWordRequestId: ID!) {\n    recoverWordRequest(id: $recoverWordRequestId)\n  }\n"): (typeof documents)["\n  mutation RecoverWordRequest($recoverWordRequestId: ID!) {\n    recoverWordRequest(id: $recoverWordRequestId)\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation DeleteWordRequest($deleteWordRequestId: ID!) {\n    deleteWordRequest(id: $deleteWordRequestId)\n  }\n"): (typeof documents)["\n  mutation DeleteWordRequest($deleteWordRequestId: ID!) {\n    deleteWordRequest(id: $deleteWordRequestId)\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation UpdateDeniedReason($updateDeniedReasonId: ID!, $deniedReason: String) {\n    updateDeniedReason(id: $updateDeniedReasonId, deniedReason: $deniedReason) {\n      id\n      deniedReason\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateDeniedReason($updateDeniedReasonId: ID!, $deniedReason: String) {\n    updateDeniedReason(id: $updateDeniedReasonId, deniedReason: $deniedReason) {\n      id\n      deniedReason\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation BulkApproveUsers($ids: [ID!]!) {\n    bulkApproveUsers(ids: $ids)\n  }\n"): (typeof documents)["\n  mutation BulkApproveUsers($ids: [ID!]!) {\n    bulkApproveUsers(ids: $ids)\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation BulkDenyUsers($ids: [ID!]!) {\n    bulkDenyUsers(ids: $ids)\n  }\n"): (typeof documents)["\n  mutation BulkDenyUsers($ids: [ID!]!) {\n    bulkDenyUsers(ids: $ids)\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation BulkRecoverUsers($ids: [ID!]!) {\n    bulkRecoverUsers(ids: $ids)\n  }\n"): (typeof documents)["\n  mutation BulkRecoverUsers($ids: [ID!]!) {\n    bulkRecoverUsers(ids: $ids)\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation BulkDeleteUsers($ids: [ID!]!) {\n    bulkDeleteUsers(ids: $ids)\n  }\n"): (typeof documents)["\n  mutation BulkDeleteUsers($ids: [ID!]!) {\n    bulkDeleteUsers(ids: $ids)\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation ApproveUser($approveUserId: ID!) {\n    approveUser(id: $approveUserId)\n  }\n"): (typeof documents)["\n  mutation ApproveUser($approveUserId: ID!) {\n    approveUser(id: $approveUserId)\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation DenyUser($denyUserId: ID!) {\n    denyUser(id: $denyUserId)\n  }\n"): (typeof documents)["\n  mutation DenyUser($denyUserId: ID!) {\n    denyUser(id: $denyUserId)\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation RecoverUser($recoverUserId: ID!) {\n    recoverUser(id: $recoverUserId)\n  }\n"): (typeof documents)["\n  mutation RecoverUser($recoverUserId: ID!) {\n    recoverUser(id: $recoverUserId)\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation DeleteUser($deleteUserId: ID!) {\n    deleteUser(id: $deleteUserId)\n  }\n"): (typeof documents)["\n  mutation DeleteUser($deleteUserId: ID!) {\n    deleteUser(id: $deleteUserId)\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation CreateUser($input: UserInput!) {\n    createUser(input: $input) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation CreateUser($input: UserInput!) {\n    createUser(input: $input) {\n      id\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query AccountIdCheck($accountId: String!) {\n    accountIdCheck(accountId: $accountId)\n  }\n"): (typeof documents)["\n  query AccountIdCheck($accountId: String!) {\n    accountIdCheck(accountId: $accountId)\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  fragment UserRequestItems on Word {\n    id\n    korDicResults\n    naverDicResults\n    status\n    title\n    page\n    example\n    deniedReason\n  }\n"): (typeof documents)["\n  fragment UserRequestItems on Word {\n    id\n    korDicResults\n    naverDicResults\n    status\n    title\n    page\n    example\n    deniedReason\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetUserRequests($paginationOptions: OffsetPaginationOptions!, $filterOptions: WordFilterOptions!) {\n    getWords(paginationOptions: $paginationOptions, filterOptions: $filterOptions) {\n      records {\n        ...UserRequestItems\n      }\n      pageInfo {\n        totalRowCount\n        pageCount\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetUserRequests($paginationOptions: OffsetPaginationOptions!, $filterOptions: WordFilterOptions!) {\n    getWords(paginationOptions: $paginationOptions, filterOptions: $filterOptions) {\n      records {\n        ...UserRequestItems\n      }\n      pageInfo {\n        totalRowCount\n        pageCount\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation UpdateUser($updateUserId: ID!, $input: UserInput!) {\n    updateUser(id: $updateUserId, input: $input) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateUser($updateUserId: ID!, $input: UserInput!) {\n    updateUser(id: $updateUserId, input: $input) {\n      id\n    }\n  }\n"];
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
export function gql(source: "\n  query GetMyPassword {\n    getCurrentUser {\n      id\n      password\n    }\n  }\n"): (typeof documents)["\n  query GetMyPassword {\n    getCurrentUser {\n      id\n      password\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query FindMyPassword($accountId: String!) {\n    findPassword(accountId: $accountId)\n  }\n"): (typeof documents)["\n  query FindMyPassword($accountId: String!) {\n    findPassword(accountId: $accountId)\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  fragment MyProfileItems on User {\n    accountId\n    name\n    year\n    class\n    number\n    role\n  }\n"): (typeof documents)["\n  fragment MyProfileItems on User {\n    accountId\n    name\n    year\n    class\n    number\n    role\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetMyProfile {\n    getCurrentUser {\n      id\n      ...MyProfileItems\n    }\n  }\n"): (typeof documents)["\n  query GetMyProfile {\n    getCurrentUser {\n      id\n      ...MyProfileItems\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  fragment RequestorItems on User {\n    id\n    name\n    role\n    year\n    class\n    number\n    accountId\n  }\n"): (typeof documents)["\n  fragment RequestorItems on User {\n    id\n    name\n    role\n    year\n    class\n    number\n    accountId\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  fragment WordRequestItems on Word {\n    id\n    requestor {\n      ...RequestorItems\n    }\n    korDicResults\n    naverDicResults\n    status\n    title\n    page\n    example\n    deniedReason\n  }\n"): (typeof documents)["\n  fragment WordRequestItems on Word {\n    id\n    requestor {\n      ...RequestorItems\n    }\n    korDicResults\n    naverDicResults\n    status\n    title\n    page\n    example\n    deniedReason\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetWordRequests($paginationOptions: OffsetPaginationOptions!, $filterOptions: WordFilterOptions!) {\n    getWords(paginationOptions: $paginationOptions, filterOptions: $filterOptions) {\n      records {\n        ...WordRequestItems\n      }\n      pageInfo {\n        totalRowCount\n        pageCount\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetWordRequests($paginationOptions: OffsetPaginationOptions!, $filterOptions: WordFilterOptions!) {\n    getWords(paginationOptions: $paginationOptions, filterOptions: $filterOptions) {\n      records {\n        ...WordRequestItems\n      }\n      pageInfo {\n        totalRowCount\n        pageCount\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  fragment SingleStudentItems on User {\n    accountId\n    name\n    year\n    class\n    number\n    role\n  }\n"): (typeof documents)["\n  fragment SingleStudentItems on User {\n    accountId\n    name\n    year\n    class\n    number\n    role\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetStudent($getUserId: ID!) {\n    getUser(id: $getUserId) {\n      ...SingleStudentItems\n    }\n  }\n"): (typeof documents)["\n  query GetStudent($getUserId: ID!) {\n    getUser(id: $getUserId) {\n      ...SingleStudentItems\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  fragment StudentItems on User {\n    id\n    name\n    year\n    class\n    number\n    accountId\n    status\n    role\n    status\n  }\n"): (typeof documents)["\n  fragment StudentItems on User {\n    id\n    name\n    year\n    class\n    number\n    accountId\n    status\n    role\n    status\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetStudents($paginationOptions: OffsetPaginationOptions!, $filterOptions: UserFilterOptions!) {\n    getUsers(paginationOptions: $paginationOptions, filterOptions: $filterOptions) {\n      records {\n        ...StudentItems\n      }\n      pageInfo {\n        totalRowCount\n        pageCount\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetStudents($paginationOptions: OffsetPaginationOptions!, $filterOptions: UserFilterOptions!) {\n    getUsers(paginationOptions: $paginationOptions, filterOptions: $filterOptions) {\n      records {\n        ...StudentItems\n      }\n      pageInfo {\n        totalRowCount\n        pageCount\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  fragment SingleTeacherItems on User {\n    accountId\n    name\n    year\n    class\n    role\n  }\n"): (typeof documents)["\n  fragment SingleTeacherItems on User {\n    accountId\n    name\n    year\n    class\n    role\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetTeacher($getUserId: ID!) {\n    getUser(id: $getUserId) {\n      ...SingleTeacherItems\n    }\n  }\n"): (typeof documents)["\n  query GetTeacher($getUserId: ID!) {\n    getUser(id: $getUserId) {\n      ...SingleTeacherItems\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  fragment TeacherItems on User {\n    id\n    name\n    year\n    class\n    accountId\n    status\n    role\n    status\n  }\n"): (typeof documents)["\n  fragment TeacherItems on User {\n    id\n    name\n    year\n    class\n    accountId\n    status\n    role\n    status\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetTeachers($paginationOptions: OffsetPaginationOptions!, $filterOptions: UserFilterOptions!) {\n    getUsers(paginationOptions: $paginationOptions, filterOptions: $filterOptions) {\n      records {\n        ...TeacherItems\n      }\n      pageInfo {\n        totalRowCount\n        pageCount\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetTeachers($paginationOptions: OffsetPaginationOptions!, $filterOptions: UserFilterOptions!) {\n    getUsers(paginationOptions: $paginationOptions, filterOptions: $filterOptions) {\n      records {\n        ...TeacherItems\n      }\n      pageInfo {\n        totalRowCount\n        pageCount\n      }\n    }\n  }\n"];
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