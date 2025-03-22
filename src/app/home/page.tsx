"use client";

import { Backdrop, Box, CircularProgress, IconButton, InputAdornment, Skeleton, Stack, TextField } from '@mui/material';
import { Cancel, Search } from '@mui/icons-material';
import { useState } from 'react';
import { SearchResult } from '@/app/types/types';
import { SubmitHandler, useForm } from 'react-hook-form';
import SearchResults from '../components/home/SearchResults/SearchResults';
import logo from "../../assets/images/logo.png";
import { useSearch } from '../hooks/useSearch';
import './style.scss';
import { useCheckSessionVersion } from '../hooks/useCheckSessionVersion';
import { useLazyQuery } from '@apollo/client';
import { getWordByTitleQuery } from '../components/home/SearchResults/query';
import { useSnackbar } from '../hooks/useSnackbar';
import ExistingWordPopup from '../components/home/ExistingWordPopup/ExistingWordPopup';
import { WordByTitleItemsFragment } from '../generated/gql/graphql';

const Home = () => {
  useCheckSessionVersion(true);
  
  const { dispatchCurrentSnackBar } = useSnackbar();
  const { searchResults, setSearchResults } = useSearch();

  const [isLoading, setIsLoading] = useState(false);
  const [openExistingWordPopup, setOpenExistingWordPopup] = useState(false);
  const [getExistingWord, setExistingWord] = useState<WordByTitleItemsFragment | null>(null);

  const [getWordByTitle, { data, loading, refetch }] = useLazyQuery(getWordByTitleQuery);
  
  const form = useForm({
    defaultValues: {
      kWord: '',
    },
  });
  
  const { setValue, register, handleSubmit, watch } = form;

  const checkDuplicate: SubmitHandler<{ kWord: string }> = async (value) => {
    getWordByTitle({
      variables: {
        title: value.kWord,
      },
      onCompleted(res) {
        if (res) {
          setOpenExistingWordPopup(true);
        }
      },
      onError: (error) => {
        setExistingWord(null);
        if (error.message === '단어를 찾을 수 없습니다.') {
          onSubmit(value.kWord);
        } else {
          dispatchCurrentSnackBar({
            payload: {
              open: true,
              type: 'error',
              message: error.message,
            },
          });
        }
      },
    });
  };
  
  const onSubmit = async (kWord: string) => {
    setIsLoading(true);
    const searchPrompt = kWord;
  
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

  const handleClose = (edit: boolean) => {
    if (!edit) {
      setOpenExistingWordPopup(false);
      setExistingWord(null);
    } else {
      setOpenExistingWordPopup(false);
      data && setExistingWord(data?.getWordByTitle);
      onSubmit(data?.getWordByTitle.title || '');
    }
  };
  
  return (
    <Box width={'100%'} display={'flex'} flexDirection={'column'} alignItems={'center'}>
      <Backdrop
        sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
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
          onSubmit={handleSubmit(checkDuplicate)}
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
        {!isLoading && searchResults && <SearchResults searchResults={searchResults} getExistingWord={getExistingWord} setExistingWord={setExistingWord} originalOldData={data?.getWordByTitle}/>}
      </Stack>
      {
        data?.getWordByTitle && 
        <ExistingWordPopup
          openExistingWordPopup={openExistingWordPopup}
          getWordRequest={data?.getWordByTitle}
          handleClose={handleClose}
        />
      }
    </Box>
  );
}

export default Home;