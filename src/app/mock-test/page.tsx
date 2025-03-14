'use client'

import { useLazyQuery } from "@apollo/client";
import { getMiniTestsQuery } from "./query";
import { useSnackbar } from "../hooks/useSnackbar";
import { useState } from "react";
import { Box, Button, Divider, IconButton, InputAdornment, Stack, TextField, Typography } from "@mui/material";
import TestCard from "../components/mini-test/TestCard/TestCard";
import { Cancel, Quiz } from "@mui/icons-material";
import DummyTestCard from "../components/mini-test/DummyTestCard/DummyTestCard";
import { useSession } from "next-auth/react";

const MockTest = () => {
  const { data: session, update } = useSession();
  const { dispatchCurrentSnackBar } = useSnackbar();
  
  const [pageFrom, setPageFrom] = useState<number | string>('');
  const [pageTo, setPageTo] = useState<number | string>('');
  const [getYear, setYear] = useState<string>('');
  const [getClass, setClass] = useState<string>('');

  const [getMiniTests, { data, loading }] = useLazyQuery(getMiniTestsQuery);
  
  const createMockTest = () => {
    if (((!pageFrom && pageTo) || (!pageTo && pageFrom)) && pageFrom !== 0 && pageTo !== 0) {
      dispatchCurrentSnackBar({
        payload: {
          open: true,
          type: 'error',
          message: '시작 페이지과 끝을 모두 입력하거나 모두 입력하지 않아야 합니다.',
        },
      });
      return;
    }

    getMiniTests({
      variables: {
        filterOptions: {
          pageFrom: Number(pageFrom),
          pageTo: Number(pageTo),
        },
      },
      onCompleted: async (res) => {
        if (res.getMiniTests.length > 0) {
          await update({ user: { ...session?.user, isInTestMode: true } });
        }
      },
      onError: (error) => {
        dispatchCurrentSnackBar({
          payload: {
            open: true,
            type: 'error',
            message: error.message,
          },
        });
      }
    });
  };

  return (
    <Stack
      spacing={2}
      width={'100%'} 
      display={'flex'} 
      justifyContent={'center'}
      alignItems={'center'}
      sx={{
        '@media (max-width:730px)': {
          marginTop: 0,
          justifySelf: 'center',
        }
      }}
    >
      <Stack spacing={1} display={'flex'} direction={'row'} alignItems={'center'}>
        <Quiz color='info' sx={{ width: '40px', height: '40px' }}/>
        <Typography 
          variant={'h5'}
          sx={{
            '@media (max-width:730px)': {
              fontSize: '1.5rem !important',
            }
          }}
        >
          모의 테스트
        </Typography>
      </Stack>
      <Divider sx={{ width: '100%' }}/>
      {loading && <DummyTestCard/>}
      {
        !loading && !data?.getMiniTests &&
        <>
          <Stack 
            width={'95%'}
            spacing={2} 
            direction="row"
            maxWidth={780}
            sx={{
              '@media (max-width:760px)': {
                flexDirection: 'column',
                '& > :not(style) + :not(style)': {
                  ml: '0px !important',
                  mt: '8px !important',
                },
              }
            }}
          >
            <Stack
              spacing={2}
              direction="row"
              flex={2}
              sx={{
                '@media (max-width:800px)': {
                  '& > :not(style) + :not(style)': {
                    ml: '8px !important',
                  }
                },
                '@media (max-width:545px)': {
                  '& > :not(style) + :not(style)': {
                    ml: '4px !important',
                  }
                }
              }}
            >
              <TextField
                label="시작 페이지"
                placeholder="시작 페이지을 입력하세요."
                type='number'
                fullWidth
                onChange={(e) => setPageFrom(Number(e.target.value))}
                value={pageFrom}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setPageFrom('')}>
                          <Cancel sx={{ width: '15px', height: '15px' }}/>
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
              <TextField
                label="끝 페이지"
                placeholder="끝 페이지을 입력하세요."
                type='number'
                fullWidth
                onChange={(e) => setPageTo(Number(e.target.value))}
                value={pageTo}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setPageTo('')}>
                          <Cancel sx={{ width: '15px', height: '15px' }}/>
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Stack>
            <Button variant="contained" sx={{ height: '56px' }} onClick={createMockTest} loading={loading}>
              모의 테스트 시작
            </Button>
          </Stack>
          <Box 
            display={'flex'} 
            justifyContent={'center'} 
            alignItems={'center'} 
            height={'calc(100vh - 300px)'}
          >
            진행 중인 모의 테스트가 없습니다.
          </Box>
        </>
      }
      {data?.getMiniTests && <TestCard tests={data.getMiniTests} session={session} update={update} isReal={false}/>}
    </Stack>
  );
}

export default MockTest;