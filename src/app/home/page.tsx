"use client";

import { Box, IconButton, InputAdornment, Skeleton, Stack, TextField } from '@mui/material';
import { Cancel, Search } from '@mui/icons-material';
import { useState } from 'react';
import { SearchResult } from '@/app/types/types';
import { SubmitHandler, useForm } from 'react-hook-form';
import SearchResults from '../components/home/SearchResults/SearchResults';
import logo from "../../assets/images/logo.png";
import { useSearch } from '../hooks/useSearch';
import './style.scss';
import { useCheckSessionVersion } from '../hooks/useCheckSessionVersion';

const Home = () => {
  useCheckSessionVersion();
  const { searchResults, setSearchResults } = useSearch();

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
  
    res.ok ? setSearchResults(result) : setSearchResults(null);
    setValue('kWord', '');
    setIsLoading(false);
  };
    
  return (
    <Box width={'100%'} display={'flex'} flexDirection={'column'} alignItems={'center'}>
      <Stack 
        spacing={4}
        mb={4} 
        mt={4} 
        width={'100%'}
        sx={{
          '@media (max-width:730px)': {
            marginTop: 0,
            width: '95% !important',
          }
        }}
      >
        {
          searchResults === null && !isLoading &&
          <Box display={'flex'} justifyContent={'center'}>
            <img 
              className='logo'
              src={logo.src} 
            />
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
                      <IconButton 
                        loading={isLoading} 
                        onClick={() => setValue('kWord', '')} 
                        sx={{ 
                          mr: 1,
                          padding: '12px',
                          fontSize: '1.75rem',
                        }}
                      >
                        <Cancel sx={{ width: '15px', height: '15px' }}/>
                      </IconButton>
                      <span
                        style={{
                          cursor:
                            watch('kWord') === '' ? 'not-allowed' : 'default',
                        }}
                      >
                        <IconButton 
                          loading={isLoading} 
                          disabled={watch('kWord') === ''}
                          sx={{ 
                            padding: '12px',
                            fontSize: '1.75rem',
                          }}
                          type="submit"
                        >
                          <Search />
                        </IconButton>
                      </span>
                    </InputAdornment>
                  ),
                },
                htmlInput: { 
                  sx: {
                    '@media (max-width:500px)': {
                      fontSize: '0.8rem'
                    }
                  },
                },
              }}
              variant="outlined" 
            />
          </Box>
        </form>
        {
          isLoading && 
          <Box display={'flex'} alignItems={'center'} justifyContent={'center'} width={'100%'}>
            <Stack 
              spacing={4} 
              maxWidth={'700px'}
              sx={{
                '@media (max-width:500px)' : {
                  maxWidth: '100%',
                }
              }}
            >
              <Skeleton 
                variant="rounded" 
                width={110} 
                height={32} 
                sx={{ 
                  ml: '75px !important',
                  '@media (max-width:500px)': {
                    ml: 'calc(3rem + 10px) !important',
                  }
                }}
              />
              <Box display={'flex'} flexDirection={'row'}>
                <Skeleton 
                  variant="circular" 
                  width={55} 
                  height={55} 
                  sx={{ 
                    mr: '20px !important',
                    '@media (max-width:500px)': {
                      mr: '10px !important',
                      width: '3rem !important',
                      height: '3rem !important',
                    }
                  }}
                />
                <Stack spacing={2}>
                  <Skeleton 
                    variant="rounded" 
                    width={400} 
                    height={40} 
                    sx={{
                      '@media (max-width:500px)': {
                        width: 'calc(100vw * 0.95 - 3rem - 10px) !important',
                      }
                    }}
                  />
                  <Skeleton 
                    variant="rounded" 
                    width={400} 
                    height={40} 
                    sx={{
                      '@media (max-width:500px)': {
                        width: 'calc(100vw * 0.95 - 3rem - 10px) !important',
                      }
                    }}
                  />
                  <Skeleton 
                    variant="rounded" 
                    width={400} 
                    height={40} 
                    sx={{
                      '@media (max-width:500px)': {
                        width: 'calc(100vw * 0.95 - 3rem - 10px) !important',
                      }
                    }}
                  />
                </Stack>
              </Box>
              <Box display={'flex'} flexDirection={'row'}>
                <Skeleton 
                  variant="circular" 
                  width={55} 
                  height={55} 
                  sx={{ 
                    mr: '20px !important',
                    '@media (max-width:500px)': {
                      mr: '10px !important',
                      width: '3rem !important',
                      height: '3rem !important',
                    }
                  }}
                />
                <Stack spacing={2}>
                  <Skeleton 
                    variant="rounded" 
                    width={400} 
                    height={40} 
                    sx={{
                      '@media (max-width:500px)': {
                        width: 'calc(100vw * 0.95 - 3rem - 10px) !important',
                      }
                    }}
                  />
                  <Skeleton 
                    variant="rounded" 
                    width={400} 
                    height={40} 
                    sx={{
                      '@media (max-width:500px)': {
                        width: 'calc(100vw * 0.95 - 3rem - 10px) !important',
                      }
                    }}
                  />
                  <Skeleton 
                    variant="rounded" 
                    width={400} 
                    height={40} 
                    sx={{
                      '@media (max-width:500px)': {
                        width: 'calc(100vw * 0.95 - 3rem - 10px) !important',
                      }
                    }}
                  />
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