'use client'

import { useQuery } from "@apollo/client";
import { getMyRequestsQuery } from "./query";
import usePaginationModel from "../hooks/usePaginationModel";
import { useSnackbar } from "../hooks/useSnackbar";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { WordStatus } from "../generated/gql/graphql";
import { Box } from "@mui/material";
import MyRequestFilter from "../components/my-requests/MyRequestFilter/MyRequestFilter";
import MyRequestTable from "../components/my-requests/MyRequestTable/MyRequestTable";
import { useDebounce } from "../hooks/useDebounce";

const MyRequests = () => {
  const { paginationModel, setPaginationModel } = usePaginationModel();
  const { dispatchCurrentSnackBar } = useSnackbar();
  const searchParams = useSearchParams();

  const [wordRequestStatus, setWordRequestStatus] = useState<WordStatus>(searchParams.get('status') as WordStatus || WordStatus.Approved);
  const [wordKeyword, setWordKeyword] = useState<string>('');
  const [selectedRequests, setSelectedRequests] = useState<string[]>([]);

  const debouncedWordKeyWord = useDebounce(wordKeyword, 500);

  const { data, loading, refetch } =
      useQuery(getMyRequestsQuery, {
        fetchPolicy: 'network-only',
        variables: {
          paginationOptions: {
            limit: paginationModel.pageSize,
            pageNum: paginationModel.page,
          },
          filterOptions: {
            status: wordRequestStatus,
            word: debouncedWordKeyWord,
          },
        },
        onError: (error) => {
          dispatchCurrentSnackBar({
            payload: {
              open: true,
              type: 'error',
              message: error.message,
            },
          });
        },
      });
      
  return (
    <Box width={'100%'} display={'flex'} justifyContent={'center'} flexDirection={'column'}>
      <Box display={'flex'} justifyContent={'center'}>
        <MyRequestFilter
          wordRequestStatus={wordRequestStatus}
          setWordRequestStatus={setWordRequestStatus}
          wordKeyword={wordKeyword}
          setWordKeyword={setWordKeyword}
          setSelectedRequests={setSelectedRequests}
        />
      </Box>
      <Box display={'flex'} alignItems={'center'} flexDirection={'column'} width={'100%'} height={'100%'}>
        <MyRequestTable
          loading={loading}
          words={data?.getMyRequests.records ?? []}
          pageCount={data?.getMyRequests.pageInfo.pageCount ?? 0}
          page={paginationModel.page}
          paginationModel={paginationModel}
          setPaginationModel={setPaginationModel}
          wordRequestStatus={wordRequestStatus}
          refetch={refetch}
          selectedRequests={selectedRequests}
          setSelectedRequests={setSelectedRequests}
        />
      </Box>
    </Box>
  );
}

export default MyRequests;