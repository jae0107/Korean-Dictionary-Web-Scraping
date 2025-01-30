import { Word } from "../models";
import { transaction } from "../utils/transaction-helpers";
import { ApolloResponseError } from "../utils/error-handler";
import { OffsetPaginationOptions, WordFilterOptions } from "../../generated/gql/graphql";
import { OffsetPaginationResponse } from "../utils/shared-types";
import { Context } from "../graphql/route";
import { WordSearch } from "./word-search";

export const wordResolvers = {
  Query: {
    getWords,
    getMyRequests,
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