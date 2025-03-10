import { ID } from './model';

export type CursorPaginationOptions = { after?: ID; limit: number };
export type CursorPaginationResponse<T> = {
  edges: CursorPaginationEdge<T>[];
  pageInfo: CursorPaginationPageInfo;
};
export type CursorPaginationEdge<T> = { node: T };
export type CursorPaginationPageInfo = { endCursor: ID; hasNextPage: boolean };
export type OffsetPaginationOptions = { limit: number; pageNum: number };
export type OffsetPaginationResponse<T> = {
  records: T[];
  pageInfo: OffsetPaginationPageInfo;
  maxNumTest?: number;
};
export type OffsetPaginationPageInfo = {
  totalRowCount: number;
  pageCount: number;
};
export type SortOrder = 'ASC' | 'DESC';
export type SearchTimeRange = {
  from?: Date;
  to?: Date;
};

export type DocumentOffsetPaginationResponse<T> = {
  records: T[];
  pageInfo: DocumentOffsetPaginationPageInfo;
};
export type DocumentOffsetPaginationPageInfo = {
  pageCount: number;
  totalActiveRowCount: number;
  totalInternalRowCount: number;
  totalArchivedRowCount: number;
  totalDeleteRequestRowCount: number;
};

export type SiteResidentIntegrateOffsetPaginationResponse<T> = {
  records: T[];
  pageInfo: SiteResidentIntegrateOffsetPaginationPageInfo;
};
export type SiteResidentIntegrateOffsetPaginationPageInfo = {
  pageCount: number;
  pendingImportUserCount: number;
  importedUserCount: number;
};

export type LotResidentOffsetPaginationResponse<T> = {
  records: T[];
  pageInfo: LotResidentOffsetPaginationPageInfo;
};
export type LotResidentOffsetPaginationPageInfo = {
  pageCount: number;
  totalRowCount: number;
  pendingLotResidentCount: number;
};
