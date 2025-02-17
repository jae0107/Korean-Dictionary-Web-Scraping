"use client";

import { useQuery } from "@apollo/client";
import { getVocabulariesQuery } from "./query";
import usePaginationModel from "../hooks/usePaginationModel";
import { useSnackbar } from "../hooks/useSnackbar";
import { WordStatus } from "../generated/gql/graphql";
import { useState } from "react";
import { Box, Stack } from "@mui/material";
import VocabFilter from "../components/vocabulary-list/VocabFilter/VocabFilter";
import VocabTable from "../components/vocabulary-list/VocabTable/VocabTable";

const VocabularyList = () => {
  const { paginationModel, setPaginationModel } = usePaginationModel();
  const { dispatchCurrentSnackBar } = useSnackbar();

  const [wordKeyword, setWordKeyword] = useState<string>('');
  const [getYear, setYear] = useState<string>('');
  const [getClass, setClass] = useState<string>('');
  
  const { data, loading } =
    useQuery(getVocabulariesQuery, {
      fetchPolicy: 'network-only',
      variables: {
        paginationOptions: {
          limit: paginationModel.pageSize,
          pageNum: paginationModel.page,
        },
        filterOptions: {
          status: WordStatus.Approved,
          word: wordKeyword,
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
      <Stack spacing={2}>
        <Box display={'flex'} justifyContent={'center'}>
          <VocabFilter
            wordKeyword={wordKeyword}
            setWordKeyword={setWordKeyword}
            getYear={getYear}
            setYear={setYear}
            getClass={getClass}
            setClass={setClass}
          />
        </Box>
        <Box display={'flex'} alignItems={'center'} flexDirection={'column'} width={'100%'}>
          <VocabTable
            loading={loading}
            words={data?.getWords.records ?? []}
            pageCount={data?.getWords.pageInfo.pageCount ?? 0}
            page={paginationModel.page}
            paginationModel={paginationModel}
            setPaginationModel={setPaginationModel}
          />
        </Box>
      </Stack>
    </Box>
  );
}

export default VocabularyList;