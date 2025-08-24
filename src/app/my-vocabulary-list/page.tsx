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
import { useCheckSessionVersion } from "../hooks/useCheckSessionVersion";
import { SortOptions } from "../generated/gql/graphql";

const MyVocabularyList = () => {
  useCheckSessionVersion(true);
  
  const { paginationModel, setPaginationModel } = usePaginationModel();
  const { dispatchCurrentSnackBar } = useSnackbar();

  const [wordKeyword, setWordKeyword] = useState<string>('');
  const [getPageFrom, setPageFrom] = useState<number | null>(null);
  const [getPageTo, setPageTo] = useState<number | null>(null);
  const [getTitleSort, setTitleSort] = useState<SortOptions | null>(null);
  const [getPageSort, setPageSort] = useState<SortOptions | null>(null);

  const debouncedWordKeyWord = useDebounce(wordKeyword, 500);
  const debouncedPageFrom = useDebounce(getPageFrom, 500);
  const debouncedPageTo = useDebounce(getPageTo, 500);
  
  const skipPageFilter = (!debouncedPageFrom && !!debouncedPageTo) || (!!debouncedPageFrom && !debouncedPageTo);

  const { data, loading } =
    useQuery(getMyVocabulariesQuery, {
      fetchPolicy: 'network-only',
      variables: {
        paginationOptions: {
          limit: paginationModel.pageSize,
          pageNum: paginationModel.page,
        },
        filterOptions: {
          word: debouncedWordKeyWord,
          titleSort: getTitleSort,
          pageSort: getPageSort,
          pageFrom: skipPageFilter ? null : debouncedPageFrom,
          pageTo: skipPageFilter ? null : debouncedPageTo,
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
            getPageFrom={getPageFrom}
            setPageFrom={setPageFrom}
            getPageTo={getPageTo}
            setPageTo={setPageTo}
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
            setTitleSort={setTitleSort}
            setPageSort={setPageSort}
          />
        </Box>
      </Stack>
    </Box>
  );
}

export default MyVocabularyList;