'use client'

import { Box } from '@mui/material';
import { useQuery } from '@apollo/client';
import { getMyProfileQuery } from './query';
import { useSnackbar } from '../hooks/useSnackbar';
import { UserInput, UserRole } from '../generated/gql/graphql';
import DummyUserForm from '../components/users/user/UserFormContainer/DummyUserForm/DummyUserForm';
import UserFormContainer from '../components/users/user/UserFormContainer/UserFormContainer';
import { useSession } from 'next-auth/react';

const Profile = () => {
  const { dispatchCurrentSnackBar } = useSnackbar();
  const { data: myData } = useSession();

  const { data, loading, refetch } = useQuery(getMyProfileQuery, {
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
      {
        loading && 
        <DummyUserForm
          userType={'나의'}
          loading={loading}
          role={myData?.user.role as UserRole || UserRole.Student}
        />
      }
      {
        data && 
        <UserFormContainer
          id={data.getCurrentUser.id}
          defaultValues={defaultValues}
          userType={'나의'}
          refetch={refetch}
        />
      }
    </Box>
  );
}

export default Profile;