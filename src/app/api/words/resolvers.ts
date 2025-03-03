import { Word } from "../models";
import { transaction } from "../utils/transaction-helpers";
import { ApolloResponseError } from "../utils/error-handler";
import { OffsetPaginationOptions, WordFilterOptions, WordInput, WordStatus } from "../../generated/gql/graphql";
import { OffsetPaginationResponse } from "../utils/shared-types";
import { Context } from "../graphql/route";
import { WordSearch } from "./word-search";
import { Op } from "sequelize";
import { sequelize } from "../initialisers";

export const wordResolvers = {
  Query: {
    getWord,
    getWordByTitle,
    getWords,
    getMyRequests,
  },
  Mutation: {
    createWordRequest,
    duplicateWordRequest,
    updateWordRequest,
    approveWordRequest,
    denyWordRequest,
    recoverWordRequest,
    deleteWordRequest,
    bulkApproveWordRequests,
    bulkRecoverWordRequests,
    bulkDenyWordRequests,
    bulkDeleteWordRequests,
    updateDeniedReason,
  },
  Word: {
    async requestors(word: Word, _args: unknown, { dataloaders }: Context) {
      return word.requestorIds ? await dataloaders.user.loadMany(word.requestorIds) : [];
    },
    async isMyVocabulary(word: Word, _args: unknown, { currentUser, dataloaders }: Context) {
      return word.requestorIds && currentUser ? !!await dataloaders.myVocabulary.load({ userId: currentUser.id, wordId: word.id }) : false;
    },
  },
};

async function getWord(_: any, { id }: { id: string }, { currentUser }: Context): Promise<Word> {
  return await transaction(async (t) => {
    if (!currentUser) throw new Error('No Current User Found');
    if (!id) throw new Error('ID is required');
    const word = await Word.findByPk(id);
    if (!word) throw new Error('단어를 찾을 수 없습니다.');
    return word;
  }).catch((e) => {
    throw new ApolloResponseError(e);
  });
}

async function getWordByTitle(_: any, { title }: { title: string }, { currentUser }: Context): Promise<Word> {
  return await transaction(async (t) => {
    const word = await Word.findOne({
      where: {
        title: title, 
        status: WordStatus.Approved,
      }
    });

    if (!word) throw new Error('단어를 찾을 수 없습니다.');
    return word;
  }).catch((e) => {
    throw new ApolloResponseError(e);
  });
}

async function getWords(
  _: any,
  {
    paginationOptions,
    filterOptions,
  }: { paginationOptions: OffsetPaginationOptions; filterOptions: WordFilterOptions },
  { currentUser }: Context
): Promise<OffsetPaginationResponse<Word>> {
  return await transaction(async (t) => {
    if (!currentUser) throw new Error('No Current User Found');

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

    if (input.title) {
      const existingWord = await Word.findOne({
        where: {
          title: input.title, 
          status: WordStatus.Approved,
        }
      });

      if (existingWord) {
        throw new Error('이미 등록된 단어입니다.');
      }
    }

    const newInput = {
      ...input,
      requestorIds: [currentUser.id],
      korDicResults: input.korDicResults ?? [],
      naverDicResults: input.naverDicResults ?? [],
      pages: input.pages ?? [], 
      example: input.example ?? undefined, 
      deniedReason: input.deniedReason ?? undefined, 
      title: input.title ?? "",
      status: WordStatus.Pending,
      isDuplicated: false,
      wordId: undefined,
    };

    const newWord: Word = await Word.create(newInput);

    return newWord;
  }).catch((e) => {
    throw new ApolloResponseError(e);
  });
}

async function duplicateWordRequest(
  root: any,
  { input }: { input: WordInput },
  { currentUser }: Context,
): Promise<Word> {
  return await transaction(async (t) => {
    if (!currentUser) throw new Error('No Current User Found');

    const newInput = {
      ...input,
      requestorIds: [currentUser.id],
      korDicResults: input.korDicResults ?? [],
      naverDicResults: input.naverDicResults ?? [],
      pages: input.pages ?? [], 
      example: input.example ?? undefined, 
      deniedReason: input.deniedReason ?? undefined, 
      title: input.title ?? "",
      status: WordStatus.Pending,
      isDuplicated: true,
      wordId: input.wordId ?? undefined,
    };

    const newWord: Word = await Word.create(newInput);

    return newWord;
  }).catch((e) => {
    throw new ApolloResponseError(e);
  });
}

async function updateWordRequest(
  root: any,
  { input }: { input: WordInput },
  { currentUser }: Context,
): Promise<Word> {
  return await transaction(async (t) => {
    if (!currentUser) throw new Error('No Current User Found');
    if (!input.title) throw new Error('단어를 입력해주세요.');

    const existingWord = await Word.findOne({
      where: {
        title: input.title, 
      }
    });

    if (!existingWord) throw new Error('단어가 존재하지 않습니다.');

    const newInput = {
      ...input,
      requestorIds: existingWord.requestorIds && existingWord.requestorIds.length > 0 ? [...existingWord.requestorIds, currentUser.id] : [currentUser.id],
      korDicResults: input.korDicResults ?? [],
      naverDicResults: input.naverDicResults ?? [],
      pages: input.pages ?? [],
      example: input.example ?? undefined, 
      deniedReason: input.deniedReason ?? undefined, 
      title: input.title ?? "",
      status: WordStatus.Pending,
      isDuplicated: false,
      wordId: undefined,
    };

    const updatedWord: Word = await existingWord.update(newInput);

    return updatedWord;
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
      await word.update({ status: WordStatus.Approved, previousStatus: word.status });
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
    await sequelize.query(
      `
      UPDATE words
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

async function denyWordRequest(
  root: any,
  { id, deniedReason }: { id: string; deniedReason: string; },
  { currentUser }: Context,
): Promise<boolean> {
  return await transaction(async (t) => {
    if (!currentUser) throw new Error('No Current User Found');

    const word = await Word.findByPk(id);

    if (word) {
      await word.update({ status: WordStatus.Denied, previousStatus: word.status, deniedReason: deniedReason });
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

    await sequelize.query(
      `
      UPDATE words
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

async function recoverWordRequest(
  root: any,
  { id }: { id: string },
  { currentUser }: Context,
): Promise<boolean> {
  return await transaction(async (t) => {
    if (!currentUser) throw new Error('No Current User Found');

    const word = await Word.findByPk(id);

    if (word) {
      await word.update({ status: word.previousStatus || WordStatus.Pending, previousStatus: word.status });
    } else {
      throw new Error('No Word Found');
    }

    return true;
  }).catch((e) => {
    throw new ApolloResponseError(e);
  });
}

async function bulkRecoverWordRequests(
  root: any,
  { ids }: { ids: string[] },
  { currentUser }: Context,
): Promise<boolean> {
  return await transaction(async (t) => {
    if (!currentUser) throw new Error('No Current User Found');

    await sequelize.query(
      `
      UPDATE words
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

async function updateDeniedReason(
  root: any,
  { id, deniedReason }: { id: string; deniedReason: string; },
  { currentUser }: Context,
): Promise<Word> {
  return await transaction(async (t) => {
    if (!currentUser) throw new Error('No Current User Found');

    let word = await Word.findByPk(id);

    if (word) {
      word = await word.update({ deniedReason: deniedReason });
    } else {
      throw new Error('No Word Found');
    }

    return word;
  }).catch((e) => {
    throw new ApolloResponseError(e);
  });
}