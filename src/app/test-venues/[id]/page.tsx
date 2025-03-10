'use client'

import DummyTestCard from "@/app/components/mini-test/DummyTestCard/DummyTestCard";
import TestCard from "@/app/components/mini-test/TestCard/TestCard";
import { ExamIcon } from "@/app/components/shared/icons/ExamIcon";
import { useCheckSessionVersion } from "@/app/hooks/useCheckSessionVersion";
import { useSnackbar } from "@/app/hooks/useSnackbar";
import { getMiniTestsQuery } from "@/app/mock-test/query";
import { useLazyQuery, useQuery } from "@apollo/client";
import { Box, Divider, Stack, Typography } from "@mui/material";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { getSingleTestVenueQuery } from "./query";
import { TestVenueStatus } from "@/app/generated/gql/graphql";

const TestVenue = () => {
  useCheckSessionVersion();
  const { data: session, update } = useSession();

  const params = useParams();
  const { dispatchCurrentSnackBar } = useSnackbar();

  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const [getMiniTests, { data, loading }] = useLazyQuery(getMiniTestsQuery);

  const createMockTest = (pageFrom: number | null, pageTo: number | null) => {
    getMiniTests({
      variables: {
        filterOptions: {
          pageFrom: pageFrom,
          pageTo: pageTo,
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
  }

  const { data: testVenueData, loading: testVenueLoading } =
    useQuery(getSingleTestVenueQuery, {
      fetchPolicy: 'network-only',
      variables: {
        getTestVenueId: id,
      },
      onCompleted: async (res) => {
        if (res.getTestVenue.status === TestVenueStatus.Open) {
          createMockTest(res.getTestVenue.pageFrom || null, res.getTestVenue.pageTo || null);
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

  if (loading || testVenueLoading) {
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
  } else if (!testVenueData?.getTestVenue.year || !testVenueData?.getTestVenue.class) {
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
  } else if (session.user.role === 'STUDENT' && (session.user.year !== Number(testVenueData?.getTestVenue.year) || session.user.class !== testVenueData?.getTestVenue.class)) {
    return (
      <Box display={'flex'} justifyContent={'center'} alignItems={'center'} height={'calc(100vh - 200px)'}>
        학년과 반 정보가 일치하지 않습니다.
      </Box>
    );
  } else if (testVenueData.getTestVenue.status !== TestVenueStatus.Open) {
    return (
      <Box display={'flex'} justifyContent={'center'} alignItems={'center'} height={'calc(100vh - 200px)'}>
        테스트가 열리지 않았습니다.
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