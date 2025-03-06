import DataLoader from "dataloader";
import { Word } from "../models";
import { Op, QueryTypes } from "sequelize";
import { knex, queryBuilder, QueryBuilder, sequelize } from "../initialisers";

export const createWordLoaderById = () => {
  return new DataLoader(async (keys: readonly string[]) => {
    const words = await Word.findAll({
      where: { id: { [Op.in]: keys } },
    });
    
    const wordMap = new Map(
      words.map((word) => [word.get('id'), word]),
    );
    return keys.map((key) => wordMap.get(key));
  });
}

export const createApprovedCountLoaderByRequestor = () => {
  return new DataLoader(async (keys: readonly string[]) => {
    let query: QueryBuilder = queryBuilder('words');

    query = query
      .select('requestorId')
      .count('* as count')
      .from(knex.raw(`unnest(ARRAY[${keys.map((key) => `'${key}'`)}]) AS "requestorId"`))
      .leftJoin('words', knex.raw('"requestorId" = ANY(words."requestorIds")'))
      .where('words.status', '=', 'APPROVED')
      .groupBy('requestorId');

    const results = await sequelize.query(query.toString(), { type: QueryTypes.SELECT }) as { requestorId: string, count: number }[];

    const resultMap = new Map(results.map((result) => [result.requestorId, result.count]));
    return keys.map((key) => resultMap.get(key) || 0);
  });
}