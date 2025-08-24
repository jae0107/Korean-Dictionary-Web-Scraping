import { OffsetPaginationOptions, SortOptions, WordFilterOptions } from "../../generated/gql/graphql";
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
    const { status, word, requestorId, year, class: className, pageFrom, pageTo, titleSort, pageSort } = this.filterOptions;

    let query: QueryBuilder = queryBuilder('words');

    query = query
      .select('words.*')
      .where(function() {
        this.whereExists(function() {
          this.select(1)
            .from('users')
            .leftJoin(
              knex.raw(
                `LATERAL (
                  SELECT jsonb_array_elements_text(to_jsonb(words."requestorIds")) AS "requestorId"
                  WHERE words."requestorIds" IS NOT NULL 
                    AND jsonb_array_length(to_jsonb(words."requestorIds")) > 0
                ) AS expanded_requestor ON true`
              )
            )
            .whereRaw('users.id = expanded_requestor."requestorId"::uuid');
        })
        .orWhere('words.requestorIds', null)
        .orWhereRaw('jsonb_array_length(to_jsonb(words."requestorIds")) = 0');
      });

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

    if (isPresent(pageFrom) && isPresent(pageTo)) {
      query = query.whereRaw(
        'words.pages && ARRAY(SELECT generate_series(?, ?))',
        [pageFrom, pageTo]
      );
    }

    if (!isPresent(pageNum) || pageNum < 0) {
      throw new Error('Page number must be positive');
    }

    if (!isPresent(limit) || limit <= 0) {
      throw new Error('Limit must be greater than 0');
    }

    const countQuery = query.clone();

    const [results] = (await sequelize.query(countQuery.clearSelect().select(knex.raw('count(*)')).toString())) as [
      [{ count: string }],
      unknown,
    ];

    const totalRowCount = parseInt(results[0].count, 10);

    const pageCount = Math.ceil(totalRowCount / limit);

    if (isPresent(titleSort) && titleSort) {
      if (titleSort === SortOptions.Asc) {
        query = query.orderBy('words.title', 'asc').orderBy('words.createdAt', 'asc');
      } else if (titleSort === SortOptions.Desc) {
        query = query.orderBy('words.title', 'desc').orderBy('words.createdAt', 'asc');
      }
    } else if (isPresent(pageSort) && pageSort) {
      if (pageSort === SortOptions.Asc) {
        query = query.orderByRaw('(SELECT MIN(p) FROM unnest(words.pages) AS p) ASC').orderBy('words.createdAt', 'asc');
      } else if (pageSort === SortOptions.Desc) {
        query = query.orderByRaw('(SELECT MIN(p) FROM unnest(words.pages) AS p) DESC').orderBy('words.createdAt', 'asc');
      }
    } else {
      query = query.orderBy([
        { column: 'words.createdAt', order: 'desc' },
        { column: 'words.title', order: 'asc' }
      ]);
    }

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