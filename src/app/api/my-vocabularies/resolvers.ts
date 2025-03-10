import { MyVocabularyFilterOptions, MyVocabularyInput, OffsetPaginationOptions } from "@/app/generated/gql/graphql";
import { Context } from "../graphql/route";
import { MyVocabulary } from "../models";
import { transaction } from "../utils/transaction-helpers";
import { ApolloResponseError } from "../utils/error-handler";
import { OffsetPaginationResponse } from "../utils/shared-types";
import { MyVocabularySearch } from "./my-vocabularies-search";
import { sequelize } from "../initialisers";

export const myVocabularyResolvers = {
  Query: {
    getMyVocabularies,
  },
  Mutation: {
    addMyVocabulary,
    bulkAddMyVocabulary,
    removeMyVocabulary,
  },
  MyVocabulary: {
    async word(myVocabulary: MyVocabulary, _args: unknown, { dataloaders }: Context) {
      return myVocabulary.wordId ? await dataloaders.wordById.load(myVocabulary.wordId) : null;
    }, 
  }
};

async function getMyVocabularies(
  _: any,
  {
    paginationOptions,
    filterOptions,
  }: { paginationOptions: OffsetPaginationOptions; filterOptions: MyVocabularyFilterOptions },
  { currentUser }: Context
): Promise<OffsetPaginationResponse<MyVocabulary>> {
  return await transaction(async (t) => {
    if (!currentUser) throw new Error('No Current User Found');

    const newFilterOptions: MyVocabularyFilterOptions = filterOptions.userId ? filterOptions : {
      ...filterOptions,
      userId: currentUser.id,
    };

    const searcher = new MyVocabularySearch({ ...paginationOptions }, { ...newFilterOptions });
    const offsetMyRequestsResponse: OffsetPaginationResponse<MyVocabulary> = await searcher.process();
    return offsetMyRequestsResponse;
  }).catch((e) => {
    throw new ApolloResponseError(e);
  });
}

async function addMyVocabulary(
  root: any,
  { input }: { input: MyVocabularyInput },
  { currentUser }: Context
): Promise<MyVocabulary> {
  return await transaction(async (t) => {
    if (!currentUser) throw new Error('No Current User Found');

    const newInput = {
      ...input,
      userId: currentUser.id,
    };

    const newWord = await MyVocabulary.create(newInput);

    return newWord;
  }).catch((e) => {
    throw new ApolloResponseError(e);
  });
}

async function bulkAddMyVocabulary(
  root: any,
  { wordIds }: { wordIds: string[] },
  { currentUser }: Context
): Promise<boolean> {
  return await transaction(async (t) => {
    if (!currentUser) throw new Error('No Current User Found');

    await sequelize.query(`
      INSERT INTO "myVocabularies" ("userId", "wordId", "createdAt", "updatedAt")
      VALUES ${wordIds
        .map(
          (wordId) =>
            `('${currentUser.id}', '${wordId}', NOW(), NOW())`
        )
        .join(', ')}
      ON CONFLICT ("userId", "wordId") DO NOTHING;
    `);

    return true;
  }).catch((e) => {
    throw new ApolloResponseError(e);
  });
}

async function removeMyVocabulary(
  root: any,
  { input }: { input: MyVocabularyInput },
  { currentUser }: Context
): Promise<boolean> {
  return await transaction(async (t) => {
    if (!currentUser) throw new Error('No Current User Found');

    await MyVocabulary.destroy({ 
      where: { 
        userId: currentUser.id,
        wordId: input.wordId,
      }
    });

    return true;
  }).catch((e) => {
    throw new ApolloResponseError(e);
  });
}