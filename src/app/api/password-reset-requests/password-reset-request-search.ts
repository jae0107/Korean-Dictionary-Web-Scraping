import { OffsetPaginationOptions, PasswordResetRequestFilterOptions } from "../../generated/gql/graphql";
import { PasswordResetRequest } from "../models";
import { OffsetPaginationResponse } from "../utils/shared-types";
import { QueryBuilder, queryBuilder, sequelize } from "../initialisers";
import { isPresent } from "../utils/object-helpers";

export class PasswordResetRequestSearch {
  private paginationOptions: OffsetPaginationOptions;
  private filterOptions: PasswordResetRequestFilterOptions;

  constructor(
    paginationOptions: OffsetPaginationOptions,
    filterOptions: PasswordResetRequestFilterOptions,
  ) {
    this.paginationOptions = paginationOptions;
    this.filterOptions = filterOptions;
  }

  async process(): Promise<OffsetPaginationResponse<PasswordResetRequest>> {
    const { limit, pageNum } = this.paginationOptions;
    const { roles } = this.filterOptions;

    let query: QueryBuilder = queryBuilder('passwordResetRequests');

    query = query
      .select('passwordResetRequests.*')
      .leftJoin('users', 'passwordResetRequests.requestorId', 'users.id')
      .where('users.status', '=', 'APPROVED');

    if (isPresent(roles)) {
      query = query.andWhere('users.role', 'in', roles);
    }

    if (!isPresent(pageNum) || pageNum < 0) {
      throw new Error('Page number must be positive');
    }

    if (!isPresent(limit) || limit <= 0) {
      throw new Error('Limit must be greater than 0');
    }

    const countQuery = query.clone();
    const [results] = (await sequelize.query(countQuery.clearSelect().count('passwordResetRequests.id').toString())) as [
      [{ count: string }],
      unknown,
    ];
    const totalRowCount = parseInt(results[0].count, 10);

    const pageCount = Math.ceil(totalRowCount / limit);

    query = query.orderBy('createdAt', 'desc');

    query = query.orderBy('passwordResetRequests.createdAt', 'asc');

    query = query.limit(limit).offset(pageNum * limit);

    const passwordResetRequests: PasswordResetRequest[] = (await sequelize.query(query.toString(), {
      model: PasswordResetRequest,
    })) as unknown as PasswordResetRequest[];

    return {
      records: passwordResetRequests,
      pageInfo: {
        totalRowCount: totalRowCount,
        pageCount: pageCount,
      },
    };
  }
}