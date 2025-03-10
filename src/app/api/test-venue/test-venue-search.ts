import { OffsetPaginationOptions, TestVenueFilterOptions } from "../../generated/gql/graphql";
import { TestVenue } from "../models";
import { OffsetPaginationResponse } from "../utils/shared-types";
import { QueryBuilder, queryBuilder, sequelize } from "../initialisers";
import { isPresent } from "../utils/object-helpers";

export class TestVenueSearch {
  private paginationOptions: OffsetPaginationOptions;
  private filterOptions: TestVenueFilterOptions;

  constructor(
    paginationOptions: OffsetPaginationOptions,
    filterOptions: TestVenueFilterOptions,
  ) {
    this.paginationOptions = paginationOptions;
    this.filterOptions = filterOptions;
  }

  async process(): Promise<OffsetPaginationResponse<TestVenue>> {
    const { limit, pageNum } = this.paginationOptions;
    const { year, class: className, status } = this.filterOptions;

    let query: QueryBuilder = queryBuilder('testVenues');

    query = query
      .select('testVenues.*')

    if (isPresent(year) && year) {
      query = query.andWhere('testVenues.year', '=', year);
    }

    if (isPresent(className) && className) {
      query = query.andWhere('testVenues.class', '=', className
      );
    }

    if (isPresent(status) && status) {
      query = query.andWhere('testVenues.status', '=', status);
    }

    if (!isPresent(pageNum) || pageNum < 0) {
      throw new Error('Page number must be positive');
    }

    if (!isPresent(limit) || limit <= 0) {
      throw new Error('Limit must be greater than 0');
    }

    const countQuery = query.clone();
    const [results] = (await sequelize.query(countQuery.clearSelect().count('testVenues.id').toString())) as [
      [{ count: string }],
      unknown,
    ];
    const totalRowCount = parseInt(results[0].count, 10);

    const pageCount = Math.ceil(totalRowCount / limit);

    query = query.orderBy('testVenues.createdAt', 'desc');

    query = query.limit(limit).offset(pageNum * limit);

    const testVenues: TestVenue[] = (await sequelize.query(query.toString(), {
      model: TestVenue,
    })) as unknown as TestVenue[];

    return {
      records: testVenues,
      pageInfo: {
        totalRowCount: totalRowCount,
        pageCount: pageCount,
      },
    };
  }
}