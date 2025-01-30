import { OffsetPaginationOptions, UserFilterOptions } from "../../generated/gql/graphql";
import { User } from "../models";
import { OffsetPaginationResponse } from "../utils/shared-types";
import { knex, QueryBuilder, queryBuilder, sequelize } from "../initialisers";
import { isPresent } from "../utils/object-helpers";

export class UserSearch {
  private paginationOptions: OffsetPaginationOptions;
  private filterOptions: UserFilterOptions;

  constructor(
    paginationOptions: OffsetPaginationOptions,
    filterOptions: UserFilterOptions,
  ) {
    this.paginationOptions = paginationOptions;
    this.filterOptions = filterOptions;
  }

  async process(): Promise<OffsetPaginationResponse<User>> {
    const { limit, pageNum } = this.paginationOptions;
    const { status, role, userName } = this.filterOptions;

    let query: QueryBuilder = queryBuilder('users');

    query = query
      .select('users.*');

    if (isPresent(status)) {
      query = query.andWhere('users.status', '=', status);
    }

    if (isPresent(role)) {
      query = query.andWhere('users.role', '=', role);
    }

    if (isPresent(userName)) {
      query = query
        .select('users.*')
        .where('users.name', 'ilike', `%${userName}%`);
    }

    if (!isPresent(pageNum) || pageNum < 0) {
      throw new Error('Page number must be positive');
    }

    if (!isPresent(limit) || limit <= 0) {
      throw new Error('Limit must be greater than 0');
    }

    const countQuery = query.clone();
    const [results] = (await sequelize.query(countQuery.clearSelect().count('users.id').toString())) as [
      [{ count: string }],
      unknown,
    ];
    const totalRowCount = parseInt(results[0].count, 10);

    const pageCount = Math.ceil(totalRowCount / limit);

    query = query.orderBy('createdAt', 'desc');

    query = query.orderBy('users.createdAt', 'asc');

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