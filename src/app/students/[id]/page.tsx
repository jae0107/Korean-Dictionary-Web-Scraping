'use client'

import { SortOptions, UserInput, UserRole, WordStatus } from '@/app/generated/gql/graphql';
import { useSnackbar } from '@/app/hooks/useSnackbar';
import { useQuery } from '@apollo/client';
import { useParams, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { getStudentQuery } from './query';
import { Box } from '@mui/material';
import usePaginationModel from '@/app/hooks/usePaginationModel';
import UserContainer from '@/app/components/users/user/UserContainer/UserContainer';
import { getUserRequestsQuery } from '@/app/components/users/user/UserContainer/query';
import UserFormContainer from '@/app/components/users/user/UserFormContainer/UserFormContainer';
import DummyUserForm from '@/app/components/users/user/UserFormContainer/DummyUserForm/DummyUserForm';
import AccessDenied from '@/app/components/shared/AccessDenied';
import { useCheckSessionVersion } from '@/app/hooks/useCheckSessionVersion';
import { useSession } from 'next-auth/react';

const SingleStudent = () => {
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

  const { data, loading, refetch } = useQuery(getStudentQuery, {
    fetchPolicy: 'network-only',
    variables: {
      getUserId: id,
    },
    skip: session?.user.role === "STUDENT",
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
    number: data?.getUser.number || 0,
    role: data?.getUser.role || UserRole.Student,
  };

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
      skip: session?.user.role === "STUDENT",
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
  
  if (session?.user.role === 'STUDENT') {
    return <AccessDenied/>;
  }
  
  return (
    <Box width={'100%'} display={'flex'} justifyContent={'center'} flexDirection={'column'}>
      {
        loading && 
        <DummyUserForm
          userType={'학생'}
          loading={loading}
          role={UserRole.Student}
        />
      }
      {
        data && 
        <UserFormContainer
          id={id}
          defaultValues={defaultValues}
          userType={'학생'}
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

export default SingleStudent;