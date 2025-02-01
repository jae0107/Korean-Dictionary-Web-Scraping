import { Word } from "../models";
import { transaction } from "../utils/transaction-helpers";
import { ApolloResponseError } from "../utils/error-handler";
import { OffsetPaginationOptions, WordFilterOptions, WordInput, WordStatus } from "../../generated/gql/graphql";
import { OffsetPaginationResponse } from "../utils/shared-types";
import { Context } from "../graphql/route";
import { WordSearch } from "./word-search";
import { Op } from "sequelize";

export const wordResolvers = {
  Query: {
    getWords,
    getMyRequests,
  },
  Mutation: {
    createWordRequest,
    approveWordRequest,
    denyWordRequest,
    deleteWordRequest,
    bulkApproveWordRequests,
    bulkDenyWordRequests,
    bulkDeleteWordRequests,
  },
  Word: {
    async requestor(word: Word, _args: unknown, { dataloaders }: Context) {
      return await dataloaders.user.load(word.requestorId);
    },
  },
};

async function getWords(
  _: any,
  {
    paginationOptions,
    filterOptions,
  }: { paginationOptions: OffsetPaginationOptions; filterOptions: WordFilterOptions }
): Promise<OffsetPaginationResponse<Word>> {
  return await transaction(async (t) => {
    const searcher = new WordSearch({ ...paginationOptions }, { ...filterOptions });
    const offsetWordsResponse: OffsetPaginationResponse<Word> = await searcher.process();
    return offsetWordsResponse;
  }).catch((e) => {
    throw new ApolloResponseError(e);
  });
}

async function getMyRequests(
  _: any,
  {
    paginationOptions,
    filterOptions,
  }: { paginationOptions: OffsetPaginationOptions; filterOptions: WordFilterOptions },
  { currentUser }: Context
): Promise<OffsetPaginationResponse<Word>> {
  return await transaction(async (t) => {
    if (!currentUser) throw new Error('No Current User Found');

    const newFilterOptions: WordFilterOptions = {
      ...filterOptions,
      requestorId: currentUser.id,
    };

    const searcher = new WordSearch({ ...paginationOptions }, { ...newFilterOptions });
    const offsetMyRequestsResponse: OffsetPaginationResponse<Word> = await searcher.process();
    return offsetMyRequestsResponse;
  }).catch((e) => {
    throw new ApolloResponseError(e);
  });
}

async function createWordRequest(
  root: any,
  { input }: { input: WordInput },
  { currentUser }: Context,
): Promise<Word> {
  return await transaction(async (t) => {
    if (!currentUser) throw new Error('No Current User Found');

    const newInput = {
      ...input,
      requestorId: currentUser.id,
      korDicResults: input.korDicResults ?? [],
      naverDicResults: input.naverDicResults ?? [],
      page: input.page ?? undefined, 
      example: input.example ?? undefined, 
      deniedReason: input.deniedReason ?? undefined, 
      title: input.title ?? "",
      status: WordStatus.Pending,
    };

    const newWord: Word = await Word.create(newInput);

    return newWord;
  }).catch((e) => {
    throw new ApolloResponseError(e);
  });
}

async function approveWordRequest(
  root: any,
  { id }: { id: string },
  { currentUser }: Context,
): Promise<boolean> {
  return await transaction(async (t) => {
    if (!currentUser) throw new Error('No Current User Found');

    const word = await Word.findByPk(id);

    if (word) {
      await word.update({ status: WordStatus.Approved });
    } else {
      throw new Error('No Word Found');
    }

    return true;
  }).catch((e) => {
    throw new ApolloResponseError(e);
  });
}

async function bulkApproveWordRequests(
  root: any,
  { ids }: { ids: string[] },
  { currentUser }: Context,
): Promise<boolean> {
  return await transaction(async (t) => {
    if (!currentUser) throw new Error('No Current User Found');

    await Word.update(
      { status: WordStatus.Approved },
      {
        where: {
          id: {
            [Op.in]: ids,
          },
        },
      }
    );

    return true;
  }).catch((e) => {
    throw new ApolloResponseError(e);
  });
}

async function denyWordRequest(
  root: any,
  { id }: { id: string },
  { currentUser }: Context,
): Promise<boolean> {
  return await transaction(async (t) => {
    if (!currentUser) throw new Error('No Current User Found');

    const word = await Word.findByPk(id);

    if (word) {
      await word.update({ status: WordStatus.Denied });
    } else {
      throw new Error('No Word Found');
    }

    return true;
  }).catch((e) => {
    throw new ApolloResponseError(e);
  });
}

async function bulkDenyWordRequests(
  root: any,
  { ids }: { ids: string[] },
  { currentUser }: Context,
): Promise<boolean> {
  return await transaction(async (t) => {
    if (!currentUser) throw new Error('No Current User Found');

    await Word.update(
      { status: WordStatus.Denied },
      {
        where: {
          id: {
            [Op.in]: ids,
          },
        },
      }
    );

    return true;
  }).catch((e) => {
    throw new ApolloResponseError(e);
  });
}

async function deleteWordRequest(
  root: any,
  { id }: { id: string },
  { currentUser }: Context,
): Promise<boolean> {
  return await transaction(async (t) => {
    if (!currentUser) throw new Error('No Current User Found');

    const word = await Word.findByPk(id);

    if (word) {
      await word.destroy();
    } else {
      throw new Error('No Word Found');
    }

    return true;
  }).catch((e) => {
    throw new ApolloResponseError(e);
  });
}

async function bulkDeleteWordRequests(
  root: any,
  { ids }: { ids: string[] },
  { currentUser }: Context,
): Promise<boolean> {
  return await transaction(async (t) => {
    if (!currentUser) throw new Error('No Current User Found');

    await Word.destroy({
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