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

    let query: QueryBuilder = queryBuilder('words');

    query = query
      .select('users.*')
      .distinct()
      .leftJoin(
        knex.raw('LATERAL jsonb_array_elements_text(to_jsonb(words."requestorIds")) AS "requestorId" ON true')
      )
      .leftJoin('users', 'users.id', knex.raw('"requestorId"::uuid'))
      .where('users.name', 'is not', null);

    if (isPresent(userName)) {
      query = query
        .select('users.*')
        .where('users.name', 'ilike', `%${userName}%`);
    }

    assert(!isPresent(limit) || limit > 0, 'Limit must be greater than 0');
    assert(!isPresent(pageNum) || pageNum >= 0, 'Page number must be positive');

    const countQuery = query.clone();
    const [results] = (await sequelize.query(countQuery.clearSelect().countDistinct('users.id').toString())) as [
      [{ count: string }],
      unknown,
    ];
    const totalRowCount = parseInt(results[0].count, 10);

    const pageCount = Math.ceil(totalRowCount / limit);

    query = query.orderBy('users.name', 'asc');

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