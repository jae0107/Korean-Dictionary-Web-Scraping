import { useState } from 'react';

const usePaginationModel = (initialPage = 0, initialPageSize = 20) => {
  const [paginationModel, setPaginationModel] = useState<{
    page: number;
    pageSize: number;
  }>({
    page: initialPage,
    pageSize: initialPageSize,
  });

  return { paginationModel, setPaginationModel };
};

export default usePaginationModel;
