"use client";

import { Box, IconButton, InputAdornment, Skeleton, Stack, TextField } from '@mui/material';
import { Search } from '@mui/icons-material';
import { useState } from 'react';
import { SearchResult } from '@/app/types/types';
import { SubmitHandler, useForm } from 'react-hook-form';
import SignInButton from '../components/SignInButton/SignInButton';
import SearchResults from '../components/home/SearchResults/SearchResults';
import VocabFilter from '../components/vocabulary-list/VocabFilter/VocabFilter';
import VocabTable from '../components/vocabulary-list/VocabTable/VocabTable';
import usePaginationModel from '../hooks/usePaginationModel';
import { useSnackbar } from '../hooks/useSnackbar';
import { useQuery } from '@apollo/client';
import { getVocabulariesQuery } from '../vocabulary-list/query';
import { WordStatus } from '../generated/gql/graphql';

const Home = () => {
  const { paginationModel, setPaginationModel } = usePaginationModel();
  const { dispatchCurrentSnackBar } = useSnackbar();
  
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [wordKeyword, setWordKeyword] = useState<string>('');
  const [getYear, setYear] = useState<string>('');
  const [getClass, setClass] = useState<string>('');
  
  const form = useForm({
    defaultValues: {
      kWord: '',
    },
  });
  
  const { setValue, register, handleSubmit, watch } = form;
      
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
  
  const onSubmit: SubmitHandler<{ kWord: string }> = async (values) => {
    setIsLoading(true);
    const searchPrompt = values.kWord;
  
    const res = await fetch("/api/searchAPI", {
      method: "POST",
      body: JSON.stringify({ searchPrompt }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const result: SearchResult = await res.json();
  
    console.log("result: ", result);
    res.ok ? setSearchResults(result) : setSearchResults(null);
    setValue('kWord', '');
    setIsLoading(false);
  };
    
  return (
    <Stack spacing={4} mt={4}>
      {/* <SignInButton /> */}
      <form
        onSubmit={handleSubmit(onSubmit)}
      >
        <Box display={'flex'} flexDirection={'row'} justifyContent={'center'}> 
          <TextField
            placeholder="검색어를 입력하세요."
            {...register('kWord')}
            sx={{ flex: 1, maxWidth: '700px' }}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <span
                      style={{
                        cursor:
                          watch('kWord') === '' ? 'not-allowed' : 'default',
                      }}
                    >
                      <IconButton loading={isLoading} disabled={watch('kWord') === ''} type="submit">
                        <Search />
                      </IconButton>
                    </span>
                  </InputAdornment>
                ),
              },
            }}
            variant="outlined" 
          />
        </Box>
      </form>
      {
        isLoading && 
        <Box display={'flex'} alignItems={'center'} justifyContent={'center'} width={'100%'}>
          <Stack spacing={4} maxWidth={'700px'}>
            <Skeleton variant="rounded" width={110} height={32} sx={{ ml: '75px !important' }}/>
            <Box display={'flex'} flexDirection={'row'}>
              <Skeleton variant="circular" width={55} height={55} sx={{ mr: '20px !important' }}/>
              <Stack spacing={2}>
                <Skeleton variant="rounded" width={400} height={40} />
                <Skeleton variant="rounded" width={400} height={40} />
                <Skeleton variant="rounded" width={400} height={40} />
              </Stack>
            </Box>
            <Box display={'flex'} flexDirection={'row'}>
              <Skeleton variant="circular" width={55} height={55} sx={{ mr: '20px !important' }}/>
              <Stack spacing={2}>
                <Skeleton variant="rounded" width={400} height={40} />
                <Skeleton variant="rounded" width={400} height={40} />
                <Skeleton variant="rounded" width={400} height={40} />
              </Stack>
            </Box>
          </Stack>
        </Box>
      }
      <SearchResults searchResults={searchResults}/>
      <Box width={'100%'} display={'flex'} justifyContent={'center'} flexDirection={'column'} mb={'32px !important'}>
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
    </Stack>
  );
}

export default Home;