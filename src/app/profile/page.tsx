'use client'

import { Box, Button, Skeleton, Stack, Typography } from '@mui/material';
import UserContainer from '../components/user/UserContainer/UserContainer';
import { useQuery } from '@apollo/client';
import { getMyProfileQuery } from './query';
import { useSnackbar } from '../hooks/useSnackbar';
import { UserInput, UserRole } from '../generated/gql/graphql';
import { AccountBox } from '@mui/icons-material';
import { useState } from 'react';

const Profile = () => {
  const { dispatchCurrentSnackBar } = useSnackbar();
  const [editMode, setEditMode] = useState(false);

  const { data, loading } = useQuery(getMyProfileQuery, {
    fetchPolicy: 'network-only',
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
    name: data?.getCurrentUser.name || '',
    email: data?.getCurrentUser.email || '',
    year: data?.getCurrentUser.year || 0,
    class: data?.getCurrentUser.class || '0',
    number: data?.getCurrentUser.number || 0,
    role: data?.getCurrentUser.role || UserRole.Student,
  }
  
  return (
    <Box width={'100%'} display={'flex'} justifyContent={'center'}>
      <Stack spacing={4} width={'300px'} mt={2}>  
        <Box display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'}>
          <Box display={'flex'} flexDirection={'row'} alignItems={'center'}>
            <AccountBox color='info' sx={{ mr: 1, width: '50px', height: '50px' }}/>
            <Typography variant="h4">프로필</Typography>
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
    </Box>
  );
}

export default Profile;