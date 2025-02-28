import { OffsetPaginationOptions, PasswordResetRequestFilterOptions, PasswordResetRequestInput, UserRole } from "@/app/generated/gql/graphql";
import { Context } from "../graphql/route";
import { PasswordResetRequest, User } from "../models";
import { transaction } from "../utils/transaction-helpers";
import { ApolloResponseError } from "../utils/error-handler";
import { OffsetPaginationResponse } from "../utils/shared-types";
import { PasswordResetRequestSearch } from "./password-reset-request-search";

export const passwordResetRequestResolvers = {
  Query: {
    getPasswordResetRequests,
  },
  Mutation: {
    createPasswordResetRequest,
  },
  PasswordResetRequest: {
    async requestor(passwordResetRequest: PasswordResetRequest, _args: unknown, { dataloaders }: Context) {
      return passwordResetRequest.requestorId ? await dataloaders.user.load(passwordResetRequest.requestorId) : null;
    },
  },
};

async function getPasswordResetRequests(
  _: any,
  {
    paginationOptions,
    filterOptions,
  }: { paginationOptions: OffsetPaginationOptions; filterOptions: PasswordResetRequestFilterOptions },
  { currentUser }: Context
): Promise<OffsetPaginationResponse<PasswordResetRequest>> {
  return await transaction(async (t) => {
    if (!currentUser) throw new Error('No Current User Found');

    const searcher = new PasswordResetRequestSearch({ ...paginationOptions }, { ...filterOptions });
    const offsetMyRequestsResponse: OffsetPaginationResponse<PasswordResetRequest> = await searcher.process();
    return offsetMyRequestsResponse;
  }).catch((e) => {
    throw new ApolloResponseError(e);
  });
}

async function createPasswordResetRequest(
  root: any,
  { input }: { input: PasswordResetRequestInput },
): Promise<PasswordResetRequest> {
  return await transaction(async (t) => {
    const user = await User.findOne({
      where: input.role === UserRole.Student ? {
        name: input.name,
        accountId: input.accountId,
        year: input.year ?? 0,
        class: input.class  ?? '',
        number: input.number ?? 0,
        role: input.role,
      } : {
        name: input.name,
        accountId: input.accountId,
        email: input.email ?? '',
        role: input.role,
      }
    });

    if (!user) throw new Error('입력한 정보와 일치하는 사용자를 찾을 수 없습니다.');

    if (input.role !== user.role) throw new Error('입력한 정보와 일치하는 사용자를 찾을 수 없습니다.');

    const newWord: PasswordResetRequest = await PasswordResetRequest.create({ requestorId: user.id });

    return newWord;
  }).catch((e) => {
    throw new ApolloResponseError(e);
  });
}