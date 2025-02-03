'use client'

import { UserInput, UserRole, WordStatus } from '@/app/generated/gql/graphql';
import { useSnackbar } from '@/app/hooks/useSnackbar';
import { useQuery } from '@apollo/client';
import { useParams, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { getTeacherQuery } from './query';
import { Box, Button, Skeleton, Stack, Typography } from '@mui/material';
import { AccountBox } from '@mui/icons-material';
import UserForm from '@/app/components/user/UserForm/UserForm';
import usePaginationModel from '@/app/hooks/usePaginationModel';
import UserContainer from '@/app/components/user/UserContainer/UserContainer';
import { getUserRequestsQuery } from '@/app/components/user/UserContainer/query';

const SingleTeacher = () => {
  const params = useParams();
  const { dispatchCurrentSnackBar } = useSnackbar();
  const { paginationModel, setPaginationModel } = usePaginationModel();
  const searchParams = useSearchParams();

  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const [wordRequestStatus, setWordRequestStatus] = useState<WordStatus>(searchParams.get('status') as WordStatus || WordStatus.Approved);
  const [editMode, setEditMode] = useState(false);

  const { data, loading } = useQuery(getTeacherQuery, {
    fetchPolicy: 'network-only',
    variables: {
      getUserId: id,
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

  const defaultValues: UserInput = {
    name: data?.getUser.name || '',
    email: data?.getUser.email || '',
    year: data?.getUser.year || 0,
    class: data?.getUser.class || '0',
    role: data?.getUser.role || UserRole.Teacher,
  }

  const { data: userRequestData, loading: userRequestLoading, refetch: userRequestRefetch } =
    useQuery(getUserRequestsQuery, {
      fetchPolicy: 'network-only',
      variables: {
        paginationOptions: {
          limit: paginationModel.pageSize,
          pageNum: paginationModel.page,
        },
        filterOptions: {
          status: wordRequestStatus,
          requestorId: id,
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
      <Stack spacing={4} width={'300px'} mt={2} alignSelf={'center'}>  
        <Box display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'}>
          <Box display={'flex'} flexDirection={'row'} alignItems={'center'}>
            <AccountBox color='info' sx={{ mr: 1, width: '40px', height: '40px' }}/>
            <Typography variant="h5">선생님 프로필</Typography>
          </Box>
          <Button 
            variant='outlined' 
            onClick={() => {
              setEditMode(!editMode);
            }}>
            {editMode ? '저장' : '수정'}
          </Button>
        </Box>
        {loading && 
          <Stack spacing={2}>
            <Skeleton variant="rounded" height={56} />
            <Skeleton variant="rounded" height={56} />
            <Skeleton variant="rounded" height={56} />
            <Skeleton variant="rounded" height={56} />
            <Skeleton variant="rounded" height={56} />
          </Stack>
        }
        {data && <UserForm defaultValues={defaultValues} editMode={editMode}/>}
      </Stack>
      <UserContainer
        wordRequestStatus={wordRequestStatus}
        setWordRequestStatus={setWordRequestStatus}
        paginationModel={paginationModel}
        setPaginationModel={setPaginationModel}
        refetch={userRequestRefetch}
        userRequests={userRequestData ? userRequestData.getWords.records : []}
        pageInfo={userRequestData ? userRequestData.getWords.pageInfo : { totalRowCount:0, pageCount: 0 }}
        loading={userRequestLoading}
      />
    </Box>
  );
}

export default SingleTeacher;