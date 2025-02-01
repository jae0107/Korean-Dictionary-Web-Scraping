"use client"

import { Box } from "@mui/material";
import { getWordRequestsQuery } from "./query";
import { useQuery } from "@apollo/client";
import usePaginationModel from "../hooks/usePaginationModel";
import { useState } from "react";
import { WordStatus } from "../generated/gql/graphql";
import { useSnackbar } from "../hooks/useSnackbar";
import RequestManagementTable from "../components/request-management/RequestManagementTable/RequestManagementTable";
import RequestManagementFilter from "../components/request-management/RequestManagementFilter/RequestManagementFilter";
import { useSearchParams } from "next/navigation";

const RequestManagement = () => {
  const { paginationModel, setPaginationModel } = usePaginationModel();
  const { dispatchCurrentSnackBar } = useSnackbar();
  const searchParams = useSearchParams();
  
  const [wordRequestStatus, setWordRequestStatus] = useState<WordStatus>(searchParams.get('status') as WordStatus || WordStatus.Approved);
  const [wordKeyword, setWordKeyword] = useState<string>('');
  const [getRequestorId, setRequestorId] = useState<string>('');
  const [getYear, setYear] = useState<string>('');
  const [getClass, setClass] = useState<string>('');
  
  const { data, loading, refetch } =
    useQuery(getWordRequestsQuery, {
      fetchPolicy: 'network-only',
      variables: {
        paginationOptions: {
          limit: paginationModel.pageSize,
          pageNum: paginationModel.page,
        },
        filterOptions: {
          status: wordRequestStatus,
          word: wordKeyword,
          requestorId: getRequestorId,
          year: parseInt(getYear),
          class: getClass.toString(),
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
        <RequestManagementFilter
          wordRequestStatus={wordRequestStatus}
          setWordRequestStatus={setWordRequestStatus}
          wordKeyword={wordKeyword}
          setWordKeyword={setWordKeyword}
          getRequestorId={getRequestorId}
          setRequestorId={setRequestorId}
          getYear={getYear}
          setYear={setYear}
          getClass={getClass}
          setClass={setClass}
        />
      </Box>
      <Box display={'flex'} alignItems={'center'} flexDirection={'column'} width={'100%'}>
        <RequestManagementTable
          loading={loading}
          words={data?.getWords.records ?? []}
          pageCount={data?.getWords.pageInfo.pageCount ?? 0}
          page={paginationModel.page}
          paginationModel={paginationModel}
          setPaginationModel={setPaginationModel}
          wordRequestStatus={wordRequestStatus}
          refetch={refetch}
        />
      </Box>
    </Box>
  );
}

export default RequestManagement;