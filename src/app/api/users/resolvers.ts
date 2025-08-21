import { PasswordResetRequest, User, Word } from "../models";
import { transaction } from "../utils/transaction-helpers";
import { ApolloResponseError } from "../utils/error-handler";
import { FindMyIdInput, FindPasswordInput, OffsetPaginationOptions, PasswordResetInput, RequestorFilterOptions, UserFilterOptions, UserInput, UserRole, UserStatus } from "../../generated/gql/graphql";
import { OffsetPaginationResponse } from "../utils/shared-types";
import { UserSearch } from "./user-search";
import { Context } from "../graphql/route";
import { RequestorSearch } from "./requestor-search";
import { knex, queryBuilder, QueryBuilder, sequelize } from "../initialisers";
import { Op, QueryTypes } from "sequelize";
import * as bcrypt from 'bcrypt';

export const userResolvers = {
  Query: {
    getCurrentUser,
    getUsers,
    getUser,
    findPassword,
    getRequestors,
    accountIdCheck,
  },
  Mutation: {
    createUser,
    bulkCreateUsers,
    updateUser,
    changeCurrentPassword,
    passwordSetUp,
    passwordReset,
    bulkPasswordReset,
    approveUser,
    bulkApproveUsers,
    denyUser,
    bulkDenyUsers,
    recoverUser,
    bulkRecoverUsers,
    deleteUser,
    bulkDeleteUsers,
    findMyId,
  },
  User: {
    async approvedCount(user: User, _: any, { dataloaders }: Context) {
      return await dataloaders.approvedCountByRequestor.load(user.id);
    },
    async myVocabCount(user: User, _: any, { dataloaders }: Context) {
      return await dataloaders.myVocabCount.load(user.id);
    },
    async testResults(user: User, _: any, { dataloaders }: Context) {
      return await dataloaders.testResult.load(user.id);
    },
  }
};

async function getUsers(
  _: any,
  {
    paginationOptions,
    filterOptions,
    isUserStat,
  }: { paginationOptions: OffsetPaginationOptions; filterOptions: UserFilterOptions; isUserStat: boolean },
  { currentUser }: Context
): Promise<OffsetPaginationResponse<User>> {
  return await transaction(async (t) => {
    const searcher = new UserSearch({ ...paginationOptions }, { ...filterOptions });
    const offsetUsersResponse: OffsetPaginationResponse<User> = await searcher.process();

    if (isUserStat) {
      let query: QueryBuilder = queryBuilder('testVenues');
      query = query.select(knex.raw("NULLIF(regexp_replace(title, '[^0-9]', '', 'g'), '')::INT AS maxNumber"))
        .orderByRaw(knex.raw("maxNumber desc"))
        .limit(1);
      
      const results = await sequelize.query(query.toString(), { type: QueryTypes.SELECT }) as { maxnumber: number }[];
      
      return {
        ...offsetUsersResponse,
        maxNumTest: results[0].maxnumber,
      }
    }

    return offsetUsersResponse;
  }).catch((e) => {
    throw new ApolloResponseError(e);
  });
}

async function getRequestors(
  _: any,
  {
    paginationOptions,
    filterOptions,
  }: { paginationOptions: OffsetPaginationOptions; filterOptions: RequestorFilterOptions },
  { currentUser }: Context
): Promise<OffsetPaginationResponse<User>> {
  return await transaction(async (t) => {
    const searcher = new RequestorSearch({ ...paginationOptions }, { ...filterOptions });
    const offsetUsersResponse: OffsetPaginationResponse<User> = await searcher.process();
    return offsetUsersResponse;
  }).catch((e) => {
    throw new ApolloResponseError(e);
  });
}

async function getUser(_: any, { id }: { id: string }, { currentUser }: Context): Promise<User> {
  return await transaction(async (t) => {
    if (!id) throw new Error('ID is required');
    const user = await User.findByPk(id);
    if (!user) throw new Error('No User Found');
    return user;
  }).catch((e) => {
    throw new ApolloResponseError(e);
  });
}

async function getCurrentUser(_: any, { id }: { id: string }, { currentUser }: Context): Promise<User> {
  return await transaction(async (t) => {
    if (!currentUser) throw new Error('No Current User Found');
    return currentUser;
  }).catch((e) => {
    throw new ApolloResponseError(e);
  });
}

async function findPassword(_: any, { accountId }: { accountId: string }): Promise<string> {
  return await transaction(async (t) => {
    if (!accountId) throw new Error('ID is required');
    const user = await User.findOne({ where: { accountId: accountId } });
    if (!user) throw new Error('No User Found');
    return user.password;
  }).catch((e) => {
    throw new ApolloResponseError(e);
  });
}

async function createUser(
  root: any,
  { input }: { input: UserInput; },
): Promise<User> {
  return await transaction(async (t) => {
    const user = await User.create({
      name: input.name || '',
      accountId: input.accountId || '',
      year: input.year || undefined,
      class: input.class || '',
      number: input.number || undefined,
      role: input.role || '',
      password: input.password || '',
      status: UserStatus.Pending,
      email: input.email || undefined,
      importedStatus: 'NOT_IMPORTED',
    });

    return user;
  }).catch((e) => {
    throw new ApolloResponseError(e);
  });
}

async function bulkCreateUsers(
  root: any,
  { inputs }: { inputs: UserInput[] }
): Promise<User[]> {
  try {
    const batchSize = 100; // 한 번에 처리할 유저 수 (상황에 맞게 조정)
    const users: User[] = [];

    // 입력 데이터를 batch 단위로 나눠 처리
    for (let i = 0; i < inputs.length; i += batchSize) {
      const batch = inputs.slice(i, i + batchSize);

      const hashedBatch = await Promise.all(
        batch.map(async (user) => ({
          name: user.name || "",
          accountId: user.accountId || "",
          year: user.year || undefined,
          class: user.class || "",
          number: user.number || undefined,
          role: user.role || "",
          password: user.password?.startsWith("$2b$")
            ? user.password
            : await bcrypt.hash(user.password || "", 10),
          status: UserStatus.Pending,
          importedStatus: "IMPORTED",
        }))
      );

      // 각 batch 단위로 트랜잭션 실행
      const created = await transaction(async (t) => {
        return await User.bulkCreate(hashedBatch, {
          transaction: t,
          validate: false,       // 성능 최적화
          individualHooks: false // beforeBulkCreate 훅 비활성화
        });
      });

      users.push(...created);
    }

    return users;
  } catch (e: any) {
    if (e.errors && e.errors[0].message === "accountId must be unique") {
      e.message = "아이디가 중복되었습니다.";
    } else if (e.errors && e.errors[0].message === "email must be unique") {
      e.message = "이메일이 중복되었습니다.";
    }
    throw new ApolloResponseError(e);
  }
}

async function updateUser(
  root: any,
  { id, input }: { id: string; input: UserInput; },
  { currentUser }: Context,
): Promise<User> {
  return await transaction(async (t) => {
    let user = await User.findByPk(id);

    if (user) {
      user = await user.update({
        name: input.name || '',
        accountId: input.accountId || '',
        year: input.year || undefined,
        class: input.class || '',
        number: input.number || undefined,
        role: input.role || '',
      });
    } else {
      throw new Error('No User Found');
    }

    return user;
  }).catch((e) => {
    throw new ApolloResponseError(e);
  });
}

async function changeCurrentPassword(
  root: any,
  { id, input }: { id: string; input: FindPasswordInput; },
  { currentUser }: Context,
): Promise<User> {
  return await transaction(async (t) => {
    let user = await User.findByPk(id);

    if (user) {
      const isPasswordValid = await bcrypt.compare(input.currentPassword, user.password);
      if (isPasswordValid) {
        user = await user.update({ password: input.newPassword }, { validate: false });
      } else {
        throw new Error('입력한 현재 비밀번호가 일치하지 않습니다.');
      }
    } else {
      throw new Error('No User Found');
    }

    return user;
  }).catch((e) => {
    throw new ApolloResponseError(e);
  });
}

async function passwordSetUp(
  root: any,
  { id, password }: { id: string; password: string; },
  { currentUser }: Context,
): Promise<User> {
  return await transaction(async (t) => {
    let user = await User.findByPk(id);

    if (user) {
      user = await user.update({ password: password, status: UserStatus.Approved, previousStatus: user.status }, { validate: false });
    } else {
      throw new Error('No User Found');
    }

    return user;
  }).catch((e) => {
    throw new ApolloResponseError(e);
  });
}

async function passwordReset(
  root: any,
  { id, password }: { id: string; password?: string; },
  { currentUser }: Context,
): Promise<User> {
  return await transaction(async (t) => {
    let user = await User.findByPk(id);

    if (user) {
      const newPassword = password ? password : `${user.year}${String(user.class).padStart(2, '0')}${String(user.number).padStart(2, '0')}`;
      user = await user.update({ password: newPassword, status: UserStatus.Pending, previousStatus: user.status }, { validate: false });
      await PasswordResetRequest.destroy({ where: { requestorId: user.id } });
    } else {
      throw new Error('No User Found');
    }

    return user;
  }).catch((e) => {
    throw new ApolloResponseError(e);
  });
}

async function bulkPasswordReset(
  root: any,
  { ids }: { ids: string[]; },
  { currentUser }: Context,
): Promise<boolean> {
  return await transaction(async (t) => {
    let query: QueryBuilder = queryBuilder('passwordResetRequests');

    query = query
      .select('passwordResetRequests.requestorId')
      .andWhere('passwordResetRequests.id', 'in', ids);
    
    const results = (await sequelize.query(query.toString(), { type: QueryTypes.SELECT })) as { requestorId: string }[];
    const requestorIds = results.map((result) => result.requestorId)
    
    const users = await User.findAll({ 
      where: {
        id: { [Op.in]: requestorIds },
      },
    });

    if (users.length === 0 || !users) {
      throw new Error('No Users Found');
    }

    const updatedUsers = users.map((user) => {
      const newPassword = `${user.dataValues.year}${String(user.dataValues.class).padStart(2, '0')}${String(user.dataValues.number).padStart(2, '0')}`;
      
      return {
        ...user.dataValues,
        status: UserStatus.Pending,
        previousStatus: user.status,
        password: newPassword,
      };
    });
    
    await User.bulkCreate(updatedUsers, {
      updateOnDuplicate: ['password', 'status', 'previousStatus', 'sessionVersion'],
      fields: ['id', 'name', 'year', 'class', 'number', 'password', 'status', 'previousStatus', 'role', 'accountId', 'email', 'sessionVersion', 'createdAt', 'updatedAt'],
    });
    

    await PasswordResetRequest.destroy({
      where: { 
        requestorId: { [Op.in]: requestorIds }
      },
    });

    return true;
  }).catch((e) => {
    throw new ApolloResponseError(e);
  });
}

async function accountIdCheck(
  root: any,
  { accountId }: { accountId: string; },
  { currentUser }: Context,
): Promise<boolean> {
  return await transaction(async (t) => {
    let user = await User.findOne({ where: { accountId: accountId } });

    if (user) {
      return true;
    }

    return false;
  }).catch((e) => {
    throw new ApolloResponseError(e);
  });
}

async function approveUser(
  root: any,
  { id }: { id: string },
  { currentUser }: Context,
): Promise<boolean> {
  return await transaction(async (t) => {
    const user = await User.findByPk(id);

    if (user) {
      await user.update({ status: UserStatus.Approved, previousStatus: user.status });
    } else {
      throw new Error('No User Found');
    }

    return true;
  }).catch((e) => {
    throw new ApolloResponseError(e);
  });
}

async function bulkApproveUsers(
  root: any,
  { ids }: { ids: string[] },
  { currentUser }: Context,
): Promise<boolean> {
  return await transaction(async (t) => {
    await sequelize.query(
      `
      UPDATE users
      SET 
        "previousStatus" = status,
        status = 'APPROVED',
        "updatedAt" = NOW()
      WHERE id IN (:ids)
      `,
      {
        replacements: { ids },
      }
    );

    return true;
  }).catch((e) => {
    throw new ApolloResponseError(e);
  });
}

async function denyUser(
  root: any,
  { id }: { id: string; },
  { currentUser }: Context,
): Promise<boolean> {
  return await transaction(async (t) => {
    const user = await User.findByPk(id);

    if (user) {
      await user.update({ status: UserStatus.Denied, previousStatus: user.status });
    } else {
      throw new Error('No User Found');
    }

    return true;
  }).catch((e) => {
    throw new ApolloResponseError(e);
  });
}

async function bulkDenyUsers(
  root: any,
  { ids }: { ids: string[] },
  { currentUser }: Context,
): Promise<boolean> {
  return await transaction(async (t) => {
    await sequelize.query(
      `
      UPDATE users
      SET 
        "previousStatus" = status,
        status = 'DENIED',
        "updatedAt" = NOW()
      WHERE id IN (:ids)
      `,
      {
        replacements: { ids },
      }
    );

    return true;
  }).catch((e) => {
    throw new ApolloResponseError(e);
  });
}

async function recoverUser(
  root: any,
  { id }: { id: string },
  { currentUser }: Context,
): Promise<boolean> {
  return await transaction(async (t) => {
    const user = await User.findByPk(id);

    if (user) {
      await user.update({ status: user.previousStatus || UserStatus.Pending, previousStatus: user.status });
    } else {
      throw new Error('No User Found');
    }

    return true;
  }).catch((e) => {
    throw new ApolloResponseError(e);
  });
}

async function bulkRecoverUsers(
  root: any,
  { ids }: { ids: string[] },
  { currentUser }: Context,
): Promise<boolean> {
  return await transaction(async (t) => {
    await sequelize.query(
      `
      UPDATE users
      SET 
        "previousStatus" = status,
        status = "previousStatus",
        "updatedAt" = NOW()
      WHERE id IN (:ids)
      `,
      {
        replacements: { ids },
      }
    );

    return true;
  }).catch((e) => {
    throw new ApolloResponseError(e);
  });
}

async function deleteUser(
  root: any,
  { id }: { id: string },
  { currentUser }: Context,
): Promise<boolean> {
  return await transaction(async (t) => {
    const user = await User.findByPk(id);

    if (user) {
      await user.destroy();
    } else {
      throw new Error('No User Found');
    }

    return true;
  }).catch((e) => {
    throw new ApolloResponseError(e);
  });
}

async function bulkDeleteUsers(
  root: any,
  { ids }: { ids: string[] },
  { currentUser }: Context,
): Promise<boolean> {
  return await transaction(async (t) => {
    await User.destroy({
      where: {
        id: {
          [Op.in]: ids,
        },
      },
    });

    return true;
  }).catch((e) => {
    throw new ApolloResponseError(e);
  });
}

async function findMyId(
  root: any,
  { input }: { input: FindMyIdInput },
): Promise<string> {
  return await transaction(async (t) => {
    const user = await User.findOne({
      where: input.role === UserRole.Student ? {
        name: input.name,
        year: input.year ?? 0,
        class: input.class  ?? '',
        number: input.number ?? 0,
        role: input.role,
      } : {
        name: input.name,
        email: input.email ?? '',
        role: input.role,
      }
    });

    if (!user) throw new Error('입력한 정보와 일치하는 사용자를 찾을 수 없습니다.');

    if (input.role !== user.role) throw new Error('입력한 정보와 일치하는 사용자를 찾을 수 없습니다.');

    if (user.accountId.length <= 3) {
      return user.accountId;
    }

    return user.accountId.slice(0, 3) + '*'.repeat(user.accountId.length - 3);
  }).catch((e) => {
    throw new ApolloResponseError(e);
  });
}