"use client"

import { Box } from "@mui/material";
import { getWordRequestsQuery } from "./query";
import { useQuery } from "@apollo/client";
import usePaginationModel from "../hooks/usePaginationModel";
import { useState } from "react";
import { SortOptions, WordStatus } from "../generated/gql/graphql";
import { useSnackbar } from "../hooks/useSnackbar";
import RequestManagementTable from "../components/request-management/RequestManagementTable/RequestManagementTable";
import RequestManagementFilter from "../components/request-management/RequestManagementFilter/RequestManagementFilter";
import { useSearchParams } from "next/navigation";
import AccessDenied from "../components/shared/AccessDenied";
import { useDebounce } from "../hooks/useDebounce";
import { useCheckSessionVersion } from "../hooks/useCheckSessionVersion";
import { useSession } from "next-auth/react";

const RequestManagement = () => {
  useCheckSessionVersion();
  const { data: session } = useSession();

  const { paginationModel, setPaginationModel } = usePaginationModel();
  const { dispatchCurrentSnackBar } = useSnackbar();
  const searchParams = useSearchParams();
  
  const [wordRequestStatus, setWordRequestStatus] = useState<WordStatus>(searchParams.get('status') as WordStatus || WordStatus.Approved);
  const [wordKeyword, setWordKeyword] = useState<string>('');
  const [getRequestorId, setRequestorId] = useState<string>('');
  const [getYear, setYear] = useState<string>('');
  const [getClass, setClass] = useState<string>('');
  const [selectedRequests, setSelectedRequests] = useState<string[]>([]);
  const [getTitleSort, setTitleSort] = useState<SortOptions | null>(null);

  const debouncedWordKeyWord = useDebounce(wordKeyword, 500);
  
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
          word: debouncedWordKeyWord,
          requestorId: getRequestorId,
          year: parseInt(getYear),
          class: getClass.toString(),
          titleSort: getTitleSort,
        },
      },
      skip: session?.user.role === "STUDENT",
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
    
  if (session?.user.role === 'STUDENT') {
    return <AccessDenied/>;
  }

  return (
    <Box width={'100%'} display={'flex'} justifyContent={'center'} flexDirection={'column'}>
      <Box display={'flex'} justifyContent={'center'}>
        <RequestManagementFilter
          wordRequestStatus={wordRequestStatus}
          setWordRequestStatus={setWordRequestStatus}
          wordKeyword={wordKeyword}
          setWordKeyword={setWordKeyword}
          setRequestorId={setRequestorId}
          getYear={getYear}
          setYear={setYear}
          getClass={getClass}
          setClass={setClass}
          setSelectedRequests={setSelectedRequests}
        />
      </Box>
      <Box display={'flex'} alignItems={'center'} flexDirection={'column'} width={'100%'} mb={2}>
        <RequestManagementTable
          loading={loading}
          words={data?.getWords.records ?? []}
          pageCount={data?.getWords.pageInfo.pageCount ?? 0}
          page={paginationModel.page}
          paginationModel={paginationModel}
          setPaginationModel={setPaginationModel}
          wordRequestStatus={wordRequestStatus}
          refetch={refetch}
          selectedRequests={selectedRequests}
          setSelectedRequests={setSelectedRequests}
          setTitleSort={setTitleSort}
        />
      </Box>
    </Box>
  );
}

export default RequestManagement;