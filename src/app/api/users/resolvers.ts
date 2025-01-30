// import { PrismaClient } from "@prisma/client";
import { User, Word } from "../models";
import { transaction } from "../utils/transaction-helpers";
import { ApolloResponseError } from "../utils/error-handler";
import { OffsetPaginationOptions, RequestorFilterOptions, UserFilterOptions } from "../../generated/gql/graphql";
import { OffsetPaginationResponse } from "../utils/shared-types";
import { UserSearch } from "./user-search";
import { createDataLoaders } from "../dataloaders";
import { Context } from "../graphql/route";
import { RequestorSearch } from "./requestor-search";

// const prisma = new PrismaClient();

export const userResolvers = {
  Query: {
    getCurrentUser,
    getUsers,
    getUser,
    getRequestors,
  },
  // Mutation: {
  //   createUser: (_, { name }) => {
  //     return { id: 2, name };
  //   },
  // },
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
  }: { paginationOptions: OffsetPaginationOptions; filterOptions: UserFilterOptions }
): Promise<OffsetPaginationResponse<User>> {
  return await transaction(async (t) => {
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
  }: { paginationOptions: OffsetPaginationOptions; filterOptions: RequestorFilterOptions }
): Promise<OffsetPaginationResponse<User>> {
  return await transaction(async (t) => {
    const searcher = new RequestorSearch({ ...paginationOptions }, { ...filterOptions });
    const offsetUsersResponse: OffsetPaginationResponse<User> = await searcher.process();
    return offsetUsersResponse;
  }).catch((e) => {
    throw new ApolloResponseError(e);
  });
}

async function getUser(_: any, { id }: { id: string }): Promise<User> {
  return await transaction(async (t) => {
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