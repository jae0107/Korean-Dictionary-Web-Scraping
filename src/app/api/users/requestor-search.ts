import { OffsetPaginationOptions, RequestorFilterOptions } from "../../generated/gql/graphql";
import { User } from "../models";
import { OffsetPaginationResponse } from "../utils/shared-types";
import { knex, QueryBuilder, queryBuilder, sequelize } from "../initialisers";
import { isPresent } from "../utils/object-helpers";
import assert from "node:assert";

export class RequestorSearch {
  private paginationOptions: OffsetPaginationOptions;
  private filterOptions: RequestorFilterOptions;

  constructor(
    paginationOptions: OffsetPaginationOptions,
    filterOptions: RequestorFilterOptions,
  ) {
    this.paginationOptions = paginationOptions;
    this.filterOptions = filterOptions;
  }

  async process(): Promise<OffsetPaginationResponse<User>> {
    const { limit, pageNum } = this.paginationOptions;
    const { userName } = this.filterOptions;

    let query: QueryBuilder = queryBuilder('users');

    query = query
      .select('users.*')
      .whereExists(function () {
        this.select(1)
          .from('words')
          .crossJoin(
            knex.raw('LATERAL jsonb_array_elements_text(to_jsonb(words."requestorIds")) AS "requestorId"')
          )
          .whereRaw('"users".id = "requestorId"::uuid')
          .andWhere('users.name', 'is not', null);
      });

    if (isPresent(userName)) {
      query = query
        .select('users.*')
        .where('users.name', 'ilike', `%${userName}%`);
    }

    if (isPresent(limit)) {
      assert(limit > 0, 'Limit must be greater than 0');
    }

    if (isPresent(pageNum)) {
      assert(pageNum >= 0, 'Page number must be positive');
    }

    let totalRowCount = 0;
    let pageCount = 0;

    if (isPresent(limit)) {
      const countQuery = query.clone();

      const [results] = (await sequelize.query(countQuery.clearSelect().count('* as count').toString())) as [
        [{ count: string }],
        unknown,
      ];

      totalRowCount = parseInt(results[0].count, 10);
      pageCount = Math.ceil(totalRowCount / limit);

      query = query.limit(limit);
    }

    if (isPresent(pageNum)) {
      query = query.offset(pageNum * limit);
    }

    query = query.limit(limit).offset(pageNum * limit);

    const users: User[] = (await sequelize.query(query.toString(), {
      model: User,
    })) as unknown as User[];

    return {
      records: users,
      pageInfo: {
        totalRowCount: totalRowCount,
        pageCount: pageCount,
      },
    };
  }
}