'use client'

import { UserInput, UserRole } from '@/app/generated/gql/graphql';
import { useSnackbar } from '@/app/hooks/useSnackbar';
import { useQuery } from '@apollo/client';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { getTeacherQuery } from './query';
import { Box, Button, Skeleton, Stack, Typography } from '@mui/material';
import { AccountBox } from '@mui/icons-material';
import UserContainer from '@/app/components/user/UserContainer/UserContainer';

const SingleTeacher = () => {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const { dispatchCurrentSnackBar } = useSnackbar();
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
        {data && <UserContainer defaultValues={defaultValues} editMode={editMode}/>}
      </Stack>
    </Box>
  );
}

export default SingleTeacher;