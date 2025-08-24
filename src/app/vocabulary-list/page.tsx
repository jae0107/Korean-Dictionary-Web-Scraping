"use client";

import { useQuery } from "@apollo/client";
import { getVocabulariesQuery } from "./query";
import usePaginationModel from "../hooks/usePaginationModel";
import { useSnackbar } from "../hooks/useSnackbar";
import { SortOptions, WordStatus } from "../generated/gql/graphql";
import { useState } from "react";
import { Box, Stack } from "@mui/material";
import VocabFilter from "../components/vocabulary-list/VocabFilter/VocabFilter";
import VocabTable from "../components/vocabulary-list/VocabTable/VocabTable";
import { useDebounce } from "../hooks/useDebounce";
import { useCheckSessionVersion } from "../hooks/useCheckSessionVersion";

const VocabularyList = () => {
  useCheckSessionVersion(true);
  
  const { paginationModel, setPaginationModel } = usePaginationModel();
  const { dispatchCurrentSnackBar } = useSnackbar();

  const [wordKeyword, setWordKeyword] = useState<string>('');
  const [getYear, setYear] = useState<string>('');
  const [getClass, setClass] = useState<string>('');
  const [getPageFrom, setPageFrom] = useState<number | null>(null);
  const [getPageTo, setPageTo] = useState<number | null>(null);
  const [getTitleSort, setTitleSort] = useState<SortOptions | null>(null);
  const [getPageSort, setPageSort] = useState<SortOptions | null>(null);

  const debouncedWordKeyWord = useDebounce(wordKeyword, 500);
  const debouncedPageFrom = useDebounce(getPageFrom, 500);
  const debouncedPageTo = useDebounce(getPageTo, 500);

  const skipPageFilter = (!debouncedPageFrom && !!debouncedPageTo) || (!!debouncedPageFrom && !debouncedPageTo);

  const { data, loading, refetch } =
    useQuery(getVocabulariesQuery, {
      fetchPolicy: 'network-only',
      variables: {
        paginationOptions: {
          limit: paginationModel.pageSize,
          pageNum: paginationModel.page,
        },
        filterOptions: {
          status: WordStatus.Approved,
          word: debouncedWordKeyWord,
          year: parseInt(getYear),
          class: getClass.toString(),
          pageFrom: skipPageFilter ? null : debouncedPageFrom,
          pageTo: skipPageFilter ? null : debouncedPageTo,
          titleSort: getTitleSort,
          pageSort: getPageSort,
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
            getPageFrom={getPageFrom}
            setPageFrom={setPageFrom}
            getPageTo={getPageTo}
            setPageTo={setPageTo}
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
            refetch={refetch}
            setTitleSort={setTitleSort}
            setPageSort={setPageSort}
          />
        </Box>
      </Stack>
    </Box>
  );
}

export default VocabularyList;