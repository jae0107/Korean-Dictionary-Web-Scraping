'use client'

import { SortOptions, UserInput, UserRole, WordStatus } from '@/app/generated/gql/graphql';
import { useSnackbar } from '@/app/hooks/useSnackbar';
import { useQuery } from '@apollo/client';
import { useParams, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { getAdminQuery } from './query';
import { Box } from '@mui/material';
import { getUserRequestsQuery } from '@/app/components/users/user/UserContainer/query';
import usePaginationModel from '@/app/hooks/usePaginationModel';
import UserContainer from '@/app/components/users/user/UserContainer/UserContainer';
import DummyUserForm from '@/app/components/users/user/UserFormContainer/DummyUserForm/DummyUserForm';
import UserFormContainer from '@/app/components/users/user/UserFormContainer/UserFormContainer';
import AccessDenied from '@/app/components/shared/AccessDenied';
import { useCheckSessionVersion } from '@/app/hooks/useCheckSessionVersion';
import { useSession } from 'next-auth/react';

const SingleAdmin = () => {
  useCheckSessionVersion();
  const { data: session } = useSession();

  const params = useParams();
  const { dispatchCurrentSnackBar } = useSnackbar();
  const { paginationModel, setPaginationModel } = usePaginationModel();
  const searchParams = useSearchParams();

  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const [wordRequestStatus, setWordRequestStatus] = useState<WordStatus>(searchParams.get('status') as WordStatus || WordStatus.Approved);
  const [getTitleSort, setTitleSort] = useState<SortOptions | null>(null);
  const [getPageSort, setPageSort] = useState<SortOptions | null>(null);

  const { data, loading, refetch } = useQuery(getAdminQuery, {
    fetchPolicy: 'network-only',
    variables: {
      getUserId: id,
    },
    skip: session?.user.role === "STUDENT" || session?.user.role === "TEACHER",
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
    accountId: data?.getUser.accountId || '',
    year: data?.getUser.year || 0,
    class: data?.getUser.class || '0',
    role: data?.getUser.role || UserRole.Admin,
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
          titleSort: getTitleSort,
          pageSort: getPageSort,
        },
      },
      skip: (session?.user.role === 'STUDENT' || session?.user.role === 'TEACHER') || (data && data.getUser.role === UserRole.Superadmin && session?.user.role === 'ADMIN'),
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
  
  if ((session?.user.role === 'STUDENT' || session?.user.role === 'TEACHER') || (data && data.getUser.role === UserRole.Superadmin && session?.user.role === 'ADMIN')) {
    return <AccessDenied/>;
  }
  
  return (
    <Box width={'100%'} display={'flex'} justifyContent={'center'} flexDirection={'column'}>
      {
        loading && 
        <DummyUserForm
          userType={'관리자'}
          loading={loading}
          role={UserRole.Admin}
        />
      }
      {
        data && 
        <UserFormContainer
          id={id}
          defaultValues={defaultValues}
          userType={'관리자'}
          refetch={refetch}
        />
      }
      <UserContainer
        wordRequestStatus={wordRequestStatus}
        setWordRequestStatus={setWordRequestStatus}
        paginationModel={paginationModel}
        setPaginationModel={setPaginationModel}
        refetch={userRequestRefetch}
        userRequests={userRequestData ? userRequestData.getWords.records : []}
        pageInfo={userRequestData ? userRequestData.getWords.pageInfo : { totalRowCount:0, pageCount: 0 }}
        loading={userRequestLoading}
        setTitleSort={setTitleSort}
        setPageSort={setPageSort}
      />
    </Box>
  );
}

export default SingleAdmin;