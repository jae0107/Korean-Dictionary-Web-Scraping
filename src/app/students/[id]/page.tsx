'use client'

import { UserInput, UserRole } from '@/app/generated/gql/graphql';
import { useSnackbar } from '@/app/hooks/useSnackbar';
import { useQuery } from '@apollo/client';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { getStudentQuery } from './query';
import { Box, Button, Skeleton, Stack, Typography } from '@mui/material';
import { AccountBox } from '@mui/icons-material';
import UserContainer from '@/app/components/user/UserContainer/UserContainer';
import StudentRequestTable from '@/app/components/students/single-student/StudentRequestTable/StudentRequestTable';

const SingleStudent = () => {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const { dispatchCurrentSnackBar } = useSnackbar();
  const [editMode, setEditMode] = useState(false);

  const { data, loading } = useQuery(getStudentQuery, {
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
    number: data?.getUser.number || 0,
    role: data?.getUser.role || UserRole.Student,
  }
  
  return (
    <Box width={'100%'} display={'flex'} justifyContent={'center'} flexDirection={'column'}>
      <Stack spacing={4} width={'300px'} mt={2} alignSelf={'center'}>  
        <Box display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'}>
          <Box display={'flex'} flexDirection={'row'} alignItems={'center'}>
            <AccountBox color='info' sx={{ mr: 1, width: '50px', height: '50px' }}/>
            <Typography variant="h4">학생 프로필</Typography>
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
            <Skeleton variant="rounded" height={56} />
          </Stack>
        }
        {data && <UserContainer defaultValues={defaultValues} editMode={editMode}/>}
      </Stack>
      <Box display={'flex'} alignItems={'center'} flexDirection={'column'} width={'100%'} mt={4}>
        <StudentRequestTable id={id}/>
      </Box>
    </Box>
  );
}

export default SingleStudent;