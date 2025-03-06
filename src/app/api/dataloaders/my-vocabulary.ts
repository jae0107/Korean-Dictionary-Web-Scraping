import DataLoader from "dataloader";
import { MyVocabulary } from "../models";
import { Op, QueryTypes } from "sequelize";
import { knex, queryBuilder, QueryBuilder, sequelize } from "../initialisers";

export const createMyVocabularyLoader = () => {
  return new DataLoader(async (keys: readonly { userId: string, wordId: string }[]) => {
    const userIds = keys.map((key) => key.userId);
    const wordIds = keys.map((key) => key.wordId);

    const myVocabularies = await MyVocabulary.findAll({
      where: { 
        userId: { [Op.in]: userIds },
        wordId: { [Op.in]: wordIds }
      },
    });
    
    const userMap = new Map(
      myVocabularies.map((myVocabulary) => [myVocabulary.get('wordId'), myVocabulary]),
    );
    return keys.map((key) => userMap.get(key.wordId));
  });
}

export const createMyVocabCountLoaderByRequestor = () => {
  return new DataLoader(async (keys: readonly string[]) => {
    let query: QueryBuilder = queryBuilder('myVocabularies');

    query = query
      .select('requestorId')
      .count('myVocabularies.id')
      .from(knex.raw(`unnest(ARRAY[${keys.map((key) => `'${key}'`)}]::uuid[]) AS "requestorId"`))  // unnest the keys array
      .leftJoin('myVocabularies', 'requestorId', 'myVocabularies.userId')
      .leftJoin('words', 'myVocabularies.wordId', 'words.id')
      .where('words.status', '=', 'APPROVED')
      .groupBy('requestorId');

    const results = await sequelize.query(query.toString(), { type: QueryTypes.SELECT }) as { requestorId: string, count: number }[];

    const resultMap = new Map(results.map((result) => [result.requestorId, result.count]));
    return keys.map((key) => resultMap.get(key) || 0);
  });
}