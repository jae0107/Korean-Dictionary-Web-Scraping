import { OffsetPaginationOptions, PasswordResetEmailInput, PasswordResetRequestFilterOptions, PasswordResetRequestInput, UserRole, UserStatus } from "@/app/generated/gql/graphql";
import { Context } from "../graphql/route";
import { PasswordResetRequest, User } from "../models";
import { transaction } from "../utils/transaction-helpers";
import { ApolloResponseError } from "../utils/error-handler";
import { OffsetPaginationResponse } from "../utils/shared-types";
import { PasswordResetRequestSearch } from "./password-reset-request-search";
import { isPresent } from "../utils/object-helpers";
import crypto from "crypto";
import { TransactionalEmailsApi, TransactionalEmailsApiApiKeys } from "@sendinblue/client";

const brevo = new TransactionalEmailsApi();
brevo.setApiKey(TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY!);

export const passwordResetRequestResolvers = {
  Query: {
    getPasswordResetRequests,
  },
  Mutation: {
    createPasswordResetRequest,
    sendPasswordResetEmail,
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

    if (user.status === UserStatus.Denied) {
      throw new Error('거절된 사용자는 비밀번호 재설정을 요청할 수 없습니다.');
    }

    const newPasswordRequest: PasswordResetRequest = await PasswordResetRequest.create({ requestorId: user.id });

    return newPasswordRequest;
  }).catch((e) => {
    if (e.errors && e.errors[0].message === 'requestorId must be unique') {
      throw new Error('이미 비밀번호 재설정 요청을 하셨습니다.');
    }
    throw new ApolloResponseError(e);
  });
}

async function sendPasswordResetEmail(
  root: any,
  { input }: { input: PasswordResetEmailInput },
): Promise<boolean> {
  return await transaction(async (t) => {
    if (!isPresent(input.email) || input.email === '' || !input.email) {
      throw new Error('이메일 주소를 입력해주세요.');
    }

    const user = await User.findOne({
      where: {
        name: input.name,
        accountId: input.accountId,
        email: input.email,
        role: input.role,
      }
    });

    if (!user) throw new Error('입력한 정보와 일치하는 사용자를 찾을 수 없습니다.');

    const newPassword = crypto.randomBytes(12).toString("base64").replace(/[^a-zA-Z0-9]/g, "").slice(0, 12);

    await user.update({ password: newPassword, status: UserStatus.Pending, previousStatus: user.status }, { validate: false });
    const emailData = {
      sender: { email: "devjaenoreply@gmail.com", name: "시스템 괸리자" },
      to: [{ email: input.email }],
      subject: "[중요] 새 비밀번호가 발급되었습니다.",
      htmlContent: `
        <p>안녕하세요, <strong>${user.name}</strong>님.</p>
        <p>요청하신 새 비밀번호가 생성되었습니다.</p>
        <div style="padding: 10px; background-color: #f4f4f4; border-radius: 5px; display: inline-block;">
          <strong>새 비밀번호: </strong> <span style="color: #d9534f;">${newPassword}</span>
        </div>
        <p>보안을 위해 로그인 후 반드시 비밀번호를 변경해 주세요.</p>
        <p>감사합니다.</p>
      `,
    };

    await brevo.sendTransacEmail(emailData);
    
    return true;
  }).catch((e) => {
    throw new ApolloResponseError(e);
  });
}