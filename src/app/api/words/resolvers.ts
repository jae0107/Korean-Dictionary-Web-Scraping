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
    bulkMigrationWords,
    duplicateWordRequest,
    updateWordRequest,
    approveWordRequest,
    approveDuplicatedWordRequest,
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
    async originalWord(word: Word, _args: unknown) {
      return word.wordId ? await Word.findByPk(word.wordId) : null;
    },
  },
};

async function getWord(_: any, { id }: { id: string }, { currentUser }: Context): Promise<Word> {
  return await transaction(async (t) => {
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
        title,
        status: { [Op.in]: [WordStatus.Approved, WordStatus.Pending, WordStatus.Duplicated] },
      },
      order: [
        [sequelize.literal(`
          CASE 
            WHEN status = '${WordStatus.Duplicated}' THEN 1
            WHEN status = '${WordStatus.Approved}' THEN 2
            WHEN status = '${WordStatus.Pending}' THEN 3
          END
        `), 'ASC'], // Duplicated > Approved > Pending 순으로 정렬
        ['createdAt', 'ASC'], // 같은 상태라면 먼저 신청한 것 우선
      ],
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
          status: {
            [Op.in]: [WordStatus.Approved, WordStatus.Pending],
          },
        }
      });

      if (existingWord) {
        throw new Error(existingWord.status === WordStatus.Approved ? '이미 등록된 단어입니다.' : '승인 대기중인 단어입니다.');
      }
    }

    const newInput = {
      ...input,
      requestorIds: [currentUser.id],
      korDicResults: input.korDicResults ?? [],
      naverDicResults: input.naverDicResults ?? [],
      pages: input.pages ?? [], 
      examples: input.examples ?? [], 
      deniedReason: input.deniedReason ?? undefined, 
      title: input.title ?? "",
      status: WordStatus.Pending,
      wordId: undefined,
    };

    const newWord: Word = await Word.create(newInput);

    return newWord;
  }).catch((e) => {
    throw new ApolloResponseError(e);
  });
}

async function bulkMigrationWords(
  root: any,
  { inputs }: { inputs: WordInput[]; },
): Promise<Word[]> {
  return await transaction(async (t) => {
    const words = await Word.bulkCreate(
      inputs.map((input) => ({
        ...input,
        requestorIds: [],
        korDicResults: input.korDicResults ?? [],
        naverDicResults: input.naverDicResults ?? [],
        pages: input.pages ?? [], 
        examples: input.examples ?? [], 
        deniedReason: input.deniedReason ?? undefined, 
        title: input.title ?? "",
        status: WordStatus.Approved,
        wordId: undefined,
      })),
      { individualHooks: true }
    );

    return words;
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
    if (!input.title) throw new Error('단어를 입력해주세요.');

    const existingWord = await Word.findOne({
      where: {
        title: input.title, 
        status: {
          [Op.in]: [WordStatus.Approved, WordStatus.Pending],
        },
      }
    });

    if (!existingWord) {
      throw new Error('단어가 존재하지 않습니다.');
    }

    const updatedRequestorIds = existingWord.requestorIds.includes(currentUser.id)
      ? existingWord.requestorIds
      : [...existingWord.requestorIds, currentUser.id];

    const newInput = {
      ...input,
      requestorIds: updatedRequestorIds,
      korDicResults: input.korDicResults ?? [],
      naverDicResults: input.naverDicResults ?? [],
      pages: input.pages ?? [], 
      examples: input.examples ?? [], 
      deniedReason: input.deniedReason ?? '', 
      title: input.title ?? "",
      status: WordStatus.Duplicated,
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
  { id, input }: { id: string; input: WordInput },
  { currentUser }: Context,
): Promise<Word> {
  return await transaction(async (t) => {
    if (!input.title) throw new Error('단어를 입력해주세요.');
    if (!currentUser) throw new Error('No Current User Found');

    const existingWord = await Word.findByPk(id);

    if (!existingWord) throw new Error('단어가 존재하지 않습니다.');

    const updatedRequestorIds = existingWord.requestorIds.includes(currentUser.id)
      ? existingWord.requestorIds
      : [...existingWord.requestorIds, currentUser.id];

    const newInput = {
      ...input,
      requestorIds: updatedRequestorIds,
      korDicResults: input.korDicResults ?? [],
      naverDicResults: input.naverDicResults ?? [],
      pages: input.pages ?? [],
      examples: input.examples ?? [], 
      deniedReason: input.deniedReason ?? '', 
      title: input.title ?? "",
      status: input.status || existingWord.status,
      wordId: input.wordId || existingWord.wordId,
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
    const word = await Word.findByPk(id);

    if (word) {
      await word.update({ status: WordStatus.Approved, previousStatus: word.status }, { validate: false });
    } else {
      throw new Error('No Word Found');
    }

    return true;
  }).catch((e) => {
    throw new ApolloResponseError(e);
  });
}

async function approveDuplicatedWordRequest(
  root: any,
  { id }: { id: string },
  { currentUser }: Context,
): Promise<Boolean> {
  return await transaction(async (t) => {
    const duplicatedWord = await Word.findByPk(id);
    if (!duplicatedWord) throw new Error('단어가 존재하지 않습니다.');

    if (!duplicatedWord.wordId) throw new Error('단어가 존재하지 않습니다.');

    const existingWord = await Word.findByPk(duplicatedWord.wordId);

    if (!existingWord) throw new Error('단어가 존재하지 않습니다.');

    const newInput = {
      requestorIds: duplicatedWord.requestorIds ?? existingWord.requestorIds,
      korDicResults: duplicatedWord.korDicResults ?? existingWord.korDicResults,
      naverDicResults: duplicatedWord.naverDicResults ?? existingWord.naverDicResults,
      pages: duplicatedWord.pages ?? existingWord.pages, 
      examples: duplicatedWord.examples ?? existingWord.examples, 
      deniedReason: duplicatedWord.deniedReason ?? existingWord.deniedReason, 
      title: duplicatedWord.title ?? existingWord.title,
      status: WordStatus.Approved,
      wordId: existingWord.wordId,
    };

    await existingWord.update(newInput);
    await duplicatedWord.destroy();

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
    const word = await Word.findByPk(id);

    if (word) {
      await word.update({ status: WordStatus.Denied, previousStatus: word.status, deniedReason: deniedReason }, { validate: false });
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
    const word = await Word.findByPk(id);

    if (word) {
      await word.update({ status: word.previousStatus || WordStatus.Pending, previousStatus: word.status }, { validate: false });
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