'use client'

import DummyTestCard from "@/app/components/mini-test/DummyTestCard/DummyTestCard";
import TestCard from "@/app/components/mini-test/TestCard/TestCard";
import { ExamIcon } from "@/app/components/shared/icons/ExamIcon";
import { useCheckSessionVersion } from "@/app/hooks/useCheckSessionVersion";
import { useSnackbar } from "@/app/hooks/useSnackbar";
import { getMiniTestsQuery } from "@/app/mock-test/query";
import { useQuery } from "@apollo/client";
import { Box, Divider, Stack, Typography } from "@mui/material";
import { useSession } from "next-auth/react";
import { useParams, useSearchParams } from "next/navigation";

const TestVenue = () => {
  useCheckSessionVersion();
  const { data: session, update } = useSession();

  const params = useParams();
  const searchParams = useSearchParams();
  const { dispatchCurrentSnackBar } = useSnackbar();

  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const isSkip = () => {
    if (!searchParams.get('year') || !searchParams.get('class')) {
      return true;
    } if (session && session.user.role === 'STUDENT' && (session.user.year !== Number(searchParams.get('year')) || session.user.class !== searchParams.get('class'))) {
      return true;
    }
    return false;
  }

  const { data, loading } =
    useQuery(getMiniTestsQuery, {
      fetchPolicy: 'network-only',
      variables: {
        filterOptions: {
          pageFrom: searchParams.get('pageFrom') ? Number(searchParams.get('pageFrom')) : null,
          pageTo: searchParams.get('pageTo') ? Number(searchParams.get('pageTo')) : null,
        },
      },
      skip: isSkip(),
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
      },
    });

  if (loading) {
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
          <ExamIcon style={{ height: '40px', width: '40px' }}/>
          <Typography 
            variant={'h5'}
            sx={{
              '@media (max-width:730px)': {
                fontSize: '1.5rem !important',
              }
            }}
          >
            실전 테스트
          </Typography>
        </Stack>
        <Divider sx={{ width: '100%' }}/>
        <DummyTestCard/>
      </Stack>
    );
  } else if (!searchParams.get('year') || !searchParams.get('class')) {
    return (
      <Box display={'flex'} justifyContent={'center'} alignItems={'center'} height={'calc(100vh - 200px)'}>
        학년과 반 정보가 필요합니다.
      </Box>
    );
  } else if (!session) {
    return (
      <Box display={'flex'} justifyContent={'center'} alignItems={'center'} height={'calc(100vh - 200px)'}>
        로그인이 필요합니다.
      </Box>
    );
  } else if (session.user.role === 'STUDENT' && (session.user.year !== Number(searchParams.get('year')) || session.user.class !== searchParams.get('class'))) {
    return (
      <Box display={'flex'} justifyContent={'center'} alignItems={'center'} height={'calc(100vh - 200px)'}>
        학년과 반 정보가 일치하지 않습니다.
      </Box>
    );
  }
  
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
        <Box color={'primary.main'} display={'flex'} alignItems={'center'}>
          <ExamIcon style={{ height: '40px', width: '40px' }}/>
        </Box>
        <Typography 
          variant={'h5'}
          sx={{
            '@media (max-width:730px)': {
              fontSize: '1.5rem !important',
            }
          }}
        >
          실전 테스트
        </Typography>
      </Stack>
      <Divider sx={{ width: '100%' }}/>
      {
        !loading && !data?.getMiniTests &&
        <>
          <Box 
            display={'flex'} 
            justifyContent={'center'} 
            alignItems={'center'} 
            height={'calc(100vh - 300px)'}
          >
            진행 중인 미니 테스트가 없습니다.
          </Box>
        </>
      }
      {data?.getMiniTests && <TestCard tests={data.getMiniTests} session={session} update={update} isReal={true} testVenueId={id}/>}
    </Stack>
  );
}

export default TestVenue;