import { OffsetPaginationOptions, MyVocabularyFilterOptions, SortOptions } from "../../generated/gql/graphql";
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
    const { word, userId, page, titleSort, pageSort } = this.filterOptions;

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
      query = query.whereRaw('? = ANY(words.pages)', [page]);
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

    // query = query.orderBy('myVocabularies.createdAt', 'desc');

    if (isPresent(titleSort) && titleSort) {
      if (titleSort === SortOptions.Asc) {
        query = query.orderBy('words.title', 'asc').orderBy('myVocabularies.createdAt', 'asc');
      } else if (titleSort === SortOptions.Desc) {
        query = query.orderBy('words.title', 'desc').orderBy('myVocabularies.createdAt', 'asc');
      }
    } else if (isPresent(pageSort) && pageSort) {
      if (pageSort === SortOptions.Asc) {
        query = query.orderByRaw('(SELECT MIN(p) FROM unnest(words.pages) AS p) ASC').orderBy('myVocabularies.createdAt', 'asc');
      } else if (pageSort === SortOptions.Desc) {
        query = query.orderByRaw('(SELECT MIN(p) FROM unnest(words.pages) AS p) DESC').orderBy('myVocabularies.createdAt', 'asc');
      }
    } else {
      query = query.orderBy([
        { column: 'myVocabularies.createdAt', order: 'desc' },
        { column: 'words.title', order: 'asc' }
      ]);
    }

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