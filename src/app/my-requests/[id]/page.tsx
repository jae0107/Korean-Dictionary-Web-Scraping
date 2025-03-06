'use client'

import { useSnackbar } from '@/app/hooks/useSnackbar';
import { useQuery } from '@apollo/client';
import { useParams } from 'next/navigation';
import { getMyWordRequestQuery } from './query';
import { Box, Divider, Skeleton, Stack, Typography } from '@mui/material';
import MyRequestForm from '@/app/components/my-requests/MyRequestForm/MyRequestForm';
import { MyWordRequestItemsFragment, WordInput, WordStatus } from '@/app/generated/gql/graphql';
import { useSession } from 'next-auth/react';

const SingleMyRequest = () => {
  const params = useParams();
  const { dispatchCurrentSnackBar } = useSnackbar();
  const {data: session} = useSession();

  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const { data, loading, refetch } = useQuery(getMyWordRequestQuery, {
    fetchPolicy: 'network-only',
    variables: {
      getWordId: id,
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
      <Box width={'100%'} display={'flex'} justifyContent={'center'}>
        <Stack spacing={2} mt={2} mb={2} maxWidth={'700px'}>
          <Typography variant="h5" display={'flex'} justifyContent={'center'}>
            나의 요청
          </Typography>
          <Divider/>
          <Skeleton variant="rounded" width={130} height={24}/>
          <Divider/>
          <Stack spacing={1}>
            <Stack spacing={1} direction={'row'} alignItems={'center'}>
              <Skeleton variant="circular" width={'2rem'} height={'2rem'}/>
              <Skeleton variant="rounded" width={70} height={24}/>
            </Stack>
            <Stack spacing={1} display={'flex'} flexDirection={'column'} width={'100%'}>
              <Skeleton variant="rounded" width={300} height={24}/>
              <Skeleton variant="rounded" width={300} height={24}/>
              <Skeleton variant="rounded" width={300} height={24}/>
            </Stack>
          </Stack>
          <Stack spacing={1}>
            <Stack spacing={1} direction={'row'} alignItems={'center'}>
              <Skeleton variant="circular" width={'2rem'} height={'2rem'}/>
              <Skeleton variant="rounded" width={70} height={24}/>
            </Stack>
            <Stack spacing={1} display={'flex'} flexDirection={'column'} width={'100%'}>
              <Skeleton variant="rounded" width={300} height={24}/>
              <Skeleton variant="rounded" width={300} height={24}/>
              <Skeleton variant="rounded" width={300} height={24}/>
            </Stack>
          </Stack>
          <Divider/>
          <Stack spacing={2}>
            <Skeleton variant="rounded" width={300} height={56}/>
            <Skeleton variant="rounded" width={300} height={36.5}/>
          </Stack>
          <Divider/>
          <Skeleton variant="rounded" width={300} height={125}/>
          <Divider/>
          <Box display={'flex'} justifyContent={'center'} sx={{ m: 1, position: 'relative' }}>
            <Skeleton variant="rounded" width={82} height={36.5}/>
          </Box>
        </Stack>
      </Box>
    );
  }
  
  if (data?.getWord.requestors?.length === 0 || (session && !data?.getWord?.requestors?.some(requestor => requestor.id === session.user.id))) {
    return (
      <Box display={'flex'} justifyContent={'center'} alignItems={'center'} height={'calc(100vh - 86.5px)'}>
        본인이 요청한 단어가 아닙니다.
      </Box>
    );
  }

  if (data?.getWord.status === WordStatus.Approved) {
    return (
      <Box display={'flex'} justifyContent={'center'} alignItems={'center'} height={'calc(100vh - 86.5px)'}>
        이미 승인된 단어는 수정할 수 없습니다.
      </Box>
    );
  }

  const originalWord: MyWordRequestItemsFragment | null = data?.getWord?.originalWord || null;

  const newKorDicResults = (data?.getWord.korDicResults || []).filter((item, index) => {
    return !(originalWord ? originalWord.korDicResults || [] : []).some((existingItem, existingIndex) => 
      existingItem === item && existingIndex === index
    );
  });
  
  const newNaverDicResults = (data?.getWord.naverDicResults || []).filter((item, index) => {
    return !(originalWord ? originalWord.naverDicResults || [] : []).some((existingItem, existingIndex) => 
      existingItem === item && existingIndex === index
    );
  });

  const newPages = (data?.getWord.pages || []).filter((item, index) => {
    return !(originalWord ? originalWord.pages || [] : []).some((existingItem, existingIndex) =>
      existingItem === item && existingIndex === index
    );
  });

  const newExamples = (data?.getWord.examples || []).filter(example => !(originalWord?.examples || []).includes(example));

  const defaultValues: WordInput = {
    title: data?.getWord.title || '',
    pages: (newPages || []).filter((page): page is number => page !== null),
    korDicResults: newKorDicResults || [],
    naverDicResults: newNaverDicResults || [],
    examples: newExamples || [],
    wordId: data?.getWord?.originalWord?.id || '',
  };

  return (
    <Box 
      width={'100%'} 
      display={'flex'} 
      justifyContent={'center'}
      sx={{
        '@media (max-width:730px)': {
          marginTop: 0,
          width: '95% !important',
          justifySelf: 'center',
        }
      }}
    >
      {!loading && <MyRequestForm defaultValues={defaultValues} originalWord={originalWord} refetch={refetch}/>}
    </Box>
  );
}

export default SingleMyRequest;