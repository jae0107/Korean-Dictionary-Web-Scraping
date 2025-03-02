'use client'

import { useState } from "react";
import usePaginationModel from "../hooks/usePaginationModel";
import { useSnackbar } from "../hooks/useSnackbar";
import { useQuery } from "@apollo/client";
import { getMyVocabulariesQuery } from "./query";
import { useDebounce } from "../hooks/useDebounce";
import { Box, Stack } from "@mui/material";
import MyVocabFilter from "../components/my-vocabulary-list/MyVocabFilter/MyVocabFilter";
import MyVocabTable from "../components/my-vocabulary-list/MyVocabTable/MyVocabTable";

const MyVocabularyList = () => {
  const { paginationModel, setPaginationModel } = usePaginationModel();
  const { dispatchCurrentSnackBar } = useSnackbar();

  const [wordKeyword, setWordKeyword] = useState<string>('');
  const [getPage, setPage] = useState<number | null>(null);

  const debouncedWordKeyWord = useDebounce(wordKeyword, 500);
  const debouncedPage = useDebounce(getPage, 500);

  const { data, loading } =
    useQuery(getMyVocabulariesQuery, {
      fetchPolicy: 'network-only',
      variables: {
        paginationOptions: {
          limit: paginationModel.pageSize,
          pageNum: paginationModel.page,
        },
        filterOptions: {
          page: debouncedPage,
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
      <Stack spacing={2}>
        <Box display={'flex'} justifyContent={'center'} width={'100%'}>
          <MyVocabFilter
            wordKeyword={wordKeyword}
            setWordKeyword={setWordKeyword}
            getPage={getPage}
            setPage={setPage}
          />
        </Box>
        <Box display={'flex'} alignItems={'center'} flexDirection={'column'} width={'100%'}>
          <MyVocabTable
            loading={loading}
            words={data?.getMyVocabularies.records.map((record) => record.word) ?? []}
            pageCount={data?.getMyVocabularies.pageInfo.pageCount ?? 0}
            page={paginationModel.page}
            paginationModel={paginationModel}
            setPaginationModel={setPaginationModel}
          />
        </Box>
      </Stack>
    </Box>
  );
}

export default MyVocabularyList;