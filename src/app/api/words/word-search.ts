import { OffsetPaginationOptions, WordFilterOptions } from "../../generated/gql/graphql";
import { Word } from "../models";
import { OffsetPaginationResponse } from "../utils/shared-types";
import { knex, QueryBuilder, queryBuilder, sequelize } from "../initialisers";
import { isPresent } from "../utils/object-helpers";

export class WordSearch {
  private paginationOptions: OffsetPaginationOptions;
  private filterOptions: WordFilterOptions;

  constructor(
    paginationOptions: OffsetPaginationOptions,
    filterOptions: WordFilterOptions,
  ) {
    this.paginationOptions = paginationOptions;
    this.filterOptions = filterOptions;
  }

  async process(): Promise<OffsetPaginationResponse<Word>> {
    const { limit, pageNum } = this.paginationOptions;
    const { status, word, requestorId, year, class: className, page } = this.filterOptions;

    let query: QueryBuilder = queryBuilder('words');

    query = query
      .select('words.*')
      .distinct()
      .leftJoin(
        knex.raw(
          `LATERAL (
            SELECT jsonb_array_elements_text(to_jsonb(words."requestorIds")) AS "requestorId"
          ) AS expanded_requestor ON true`
        )
      )
      .leftJoin('users', 'users.id', knex.raw('expanded_requestor."requestorId"::uuid'));

    if (isPresent(status)) {
      query = query.andWhere('words.status', '=', status);
    }

    if (isPresent(requestorId) && requestorId) {
      query = query.whereRaw('? = ANY(words."requestorIds")', [requestorId]);
    }

    if (isPresent(year) && year) {
      query = query.andWhere('users.year', '=', year);
    }

    if (isPresent(className) && className) {
      query = query.andWhere('users.class', '=', className);
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
    const [results] = (await sequelize.query(countQuery.clearSelect().countDistinct('words.id').toString())) as [
      [{ count: string }],
      unknown,
    ];
    const totalRowCount = parseInt(results[0].count, 10);

    const pageCount = Math.ceil(totalRowCount / limit);

    query = query.orderBy('words.createdAt', 'desc');

    query = query.limit(limit).offset(pageNum * limit);

    const words: Word[] = (await sequelize.query(query.toString(), {
      model: Word,
    })) as unknown as Word[];

    return {
      records: words,
      pageInfo: {
        totalRowCount: totalRowCount,
        pageCount: pageCount,
      },
    };
  }
}