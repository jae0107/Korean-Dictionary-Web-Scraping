import { useEffect, useState } from 'react';

export interface PagePaginationInfo {
  pageCount: number;
  totalRowCount: number;
}

const usePageInfo = (initialPageInfo?: PagePaginationInfo) => {
  const [rowCountState, setRowCountState] = useState(
    initialPageInfo?.totalRowCount || 0
  );

  useEffect(() => {
    setRowCountState((prevRowCountState) =>
      initialPageInfo?.totalRowCount !== undefined
        ? initialPageInfo.totalRowCount
        : prevRowCountState
    );
  }, [initialPageInfo?.totalRowCount, setRowCountState]);

  const [pageCountState, setPageCountState] = useState(
    initialPageInfo?.pageCount || 0
  );

  useEffect(() => {
    setPageCountState((prevPageCountState) =>
      initialPageInfo?.pageCount !== undefined
        ? initialPageInfo.pageCount
        : prevPageCountState
    );
  }, [initialPageInfo?.pageCount, setPageCountState]);

  return { rowCountState, pageCountState };
};

export default usePageInfo;
