import { User, Word } from "../models";
import { transaction } from "../utils/transaction-helpers";
import { ApolloResponseError } from "../utils/error-handler";
import { OffsetPaginationOptions, RequestorFilterOptions, UserFilterOptions, UserStatus } from "../../generated/gql/graphql";
import { OffsetPaginationResponse } from "../utils/shared-types";
import { UserSearch } from "./user-search";
import { Context } from "../graphql/route";
import { RequestorSearch } from "./requestor-search";
import { sequelize } from "../initialisers";
import { Op } from "sequelize";

export const userResolvers = {
  Query: {
    getCurrentUser,
    getUsers,
    getUser,
    getRequestors,
  },
  Mutation: {
    approveUser,
    bulkApproveUsers,
    denyUser,
    bulkDenyUsers,
    recoverUser,
    bulkRecoverUsers,
    deleteUser,
    bulkDeleteUsers,
  },
  User: {
    async words(user: User, _args: unknown, { dataloaders }: Context): Promise<Word[]> {
      return await dataloaders.word.load(user.id);
    },
  },
};

async function getUsers(
  _: any,
  {
    paginationOptions,
    filterOptions,
  }: { paginationOptions: OffsetPaginationOptions; filterOptions: UserFilterOptions },
  { currentUser }: Context
): Promise<OffsetPaginationResponse<User>> {
  return await transaction(async (t) => {
    if (!currentUser) throw new Error('No Current User Found');

    const searcher = new UserSearch({ ...paginationOptions }, { ...filterOptions });
    const offsetUsersResponse: OffsetPaginationResponse<User> = await searcher.process();
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
    if (!currentUser) throw new Error('No Current User Found');

    const searcher = new RequestorSearch({ ...paginationOptions }, { ...filterOptions });
    const offsetUsersResponse: OffsetPaginationResponse<User> = await searcher.process();
    return offsetUsersResponse;
  }).catch((e) => {
    throw new ApolloResponseError(e);
  });
}

async function getUser(_: any, { id }: { id: string }, { currentUser }: Context): Promise<User> {
  return await transaction(async (t) => {
    if (!currentUser) throw new Error('No Current User Found');
    if (!id) throw new Error('ID is required');
    const user = await User.findByPk(id);
    if (!user) throw new Error('No Procedure Template Found');
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

async function approveUser(
  root: any,
  { id }: { id: string },
  { currentUser }: Context,
): Promise<boolean> {
  return await transaction(async (t) => {
    if (!currentUser) throw new Error('No Current User Found');

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
    if (!currentUser) throw new Error('No Current User Found');
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
    if (!currentUser) throw new Error('No Current User Found');

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
    if (!currentUser) throw new Error('No Current User Found');

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
    if (!currentUser) throw new Error('No Current User Found');

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
    if (!currentUser) throw new Error('No Current User Found');

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
    if (!currentUser) throw new Error('No Current User Found');

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
    if (!currentUser) throw new Error('No Current User Found');

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