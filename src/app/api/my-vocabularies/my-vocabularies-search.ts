import { OffsetPaginationOptions, MyVocabularyFilterOptions } from "../../generated/gql/graphql";
import { MyVocabulary } from "../models";
import { OffsetPaginationResponse } from "../utils/shared-types";
import { QueryBuilder, queryBuilder, sequelize } from "../initialisers";
import { isPresent } from "../utils/object-helpers";

export class MyVocabularySearch {
  private paginationOptions: OffsetPaginationOptions;
  private filterOptions: MyVocabularyFilterOptions;

  constructor(
    paginationOptions: OffsetPaginationOptions,
    filterOptions: MyVocabularyFilterOptions,
  ) {
    this.paginationOptions = paginationOptions;
    this.filterOptions = filterOptions;
  }

  async process(): Promise<OffsetPaginationResponse<MyVocabulary>> {
    const { limit, pageNum } = this.paginationOptions;
    const { word, userId, page } = this.filterOptions;

    let query: QueryBuilder = queryBuilder('myVocabularies');

    query = query
      .select('myVocabularies.*')
      .leftJoin('users', 'myVocabularies.userId', 'users.id')
      .leftJoin('words', 'myVocabularies.wordId', 'words.id')
      .where('users.status', '=', 'APPROVED')
      .andWhere('words.status', '=', 'APPROVED');

    if (isPresent(userId) && userId) {
      query = query.andWhere('myVocabularies.userId', '=', userId);
    }

    if (isPresent(word)) {
      query = query
        .select('words.*')
        .where('words.title', 'ilike', `%${word}%`);
    }

    if (isPresent(page) && page) {
      query = query.where('words.page', '=', page);
    }

    if (!isPresent(pageNum) || pageNum < 0) {
      throw new Error('Page number must be positive');
    }

    if (!isPresent(limit) || limit <= 0) {
      throw new Error('Limit must be greater than 0');
    }

    const countQuery = query.clone();
    const [results] = (await sequelize.query(countQuery.clearSelect().count('myVocabularies.id').toString())) as [
      [{ count: string }],
      unknown,
    ];
    const totalRowCount = parseInt(results[0].count, 10);

    const pageCount = Math.ceil(totalRowCount / limit);

    query = query.orderBy('createdAt', 'desc');

    query = query.orderBy('myVocabularies.createdAt', 'asc');

    query = query.limit(limit).offset(pageNum * limit);

    const myVocabularies: MyVocabulary[] = (await sequelize.query(query.toString(), {
      model: MyVocabulary,
    })) as unknown as MyVocabulary[];

    return {
      records: myVocabularies,
      pageInfo: {
        totalRowCount: totalRowCount,
        pageCount: pageCount,
      },
    };
  }
}