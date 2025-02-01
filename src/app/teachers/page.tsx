'use client'

import { useSearchParams } from "next/navigation";
import usePaginationModel from "../hooks/usePaginationModel";
import { useSnackbar } from "../hooks/useSnackbar";
import { useState } from "react";
import { UserRole, UserStatus } from "../generated/gql/graphql";
import { useQuery } from "@apollo/client";
import { getTeachersQuery } from "./query";
import { Box } from "@mui/material";
import TeacherFilter from "../components/teachers/TeacherFilter/TeacherFilter";
import TeacherTable from "../components/teachers/TeacherTable/TeacherTable";

const TeacherManagement = () => {
  const { paginationModel, setPaginationModel } = usePaginationModel();
  const { dispatchCurrentSnackBar } = useSnackbar();
  const searchParams = useSearchParams();

  const [userNameKeyword, setUserNameKeyword] = useState<string>('');
  const [teacherStatus, setTeacherStatus] = useState<UserStatus>(searchParams.get('status') as UserStatus || UserStatus.Approved);
  
  const { data, loading } =
    useQuery(getTeachersQuery, {
      fetchPolicy: 'network-only',
      variables: {
        paginationOptions: {
          limit: paginationModel.pageSize,
          pageNum: paginationModel.page,
        },
        filterOptions: {
          roles: [UserRole.Teacher],
          status: teacherStatus,
          userName: userNameKeyword,
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
      <Box display={'flex'} justifyContent={'center'}>
        <TeacherFilter
          userNameKeyword={userNameKeyword}
          setUserNameKeyword={setUserNameKeyword}
          teacherStatus={teacherStatus}
          setTeacherStatus={setTeacherStatus}
        />
      </Box>
      <Box display={'flex'} alignItems={'center'} flexDirection={'column'} width={'100%'}>
        <TeacherTable
          loading={loading}
          teachers={data?.getUsers.records || []}
          pageCount={data?.getUsers.pageInfo.pageCount || 0}
          page={paginationModel.page}
          paginationModel={paginationModel}
          setPaginationModel={setPaginationModel}
          teacherStatus={teacherStatus}
        />
      </Box>
    </Box>
  );
}

export default TeacherManagement;