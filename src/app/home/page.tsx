"use client";

import { Box, IconButton, InputAdornment, Skeleton, Stack, TextField } from '@mui/material';
import { Cancel, Search } from '@mui/icons-material';
import { useState } from 'react';
import { SearchResult } from '@/app/types/types';
import { SubmitHandler, useForm } from 'react-hook-form';
import SearchResults from '../components/home/SearchResults/SearchResults';
import logo from "../../assets/images/logo.png";

const Home = () => {
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm({
    defaultValues: {
      kWord: '',
    },
  });
  
  const { setValue, register, handleSubmit, watch } = form;
  
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
    <Box>
      <Stack spacing={4} mb={4} mt={4}>
        {
          searchResults === null &&
          <Box display={'flex'} justifyContent={'center'}>
            <img src={logo.src} style={{ width: '300px', height: '300px' }}/>
          </Box>
        }
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
                      <IconButton loading={isLoading} onClick={() => setValue('kWord', '')} sx={{ mr: 1 }}>
                        <Cancel sx={{ width: '15px', height: '15px' }}/>
                      </IconButton>
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
        {!isLoading && searchResults && <SearchResults searchResults={searchResults}/>}
      </Stack>
    </Box>
  );
}

export default Home;