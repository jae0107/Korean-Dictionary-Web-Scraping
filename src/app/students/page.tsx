'use client'

import { useQuery } from "@apollo/client";
import { getStudentsQuery } from "./query";
import usePaginationModel from "../hooks/usePaginationModel";
import { useSnackbar } from "../hooks/useSnackbar";
import { UserRole, UserStatus } from "../generated/gql/graphql";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Box } from "@mui/material";
import StudentFilter from "../components/users/students/StudentFilter/StudentFilter";
import StudentTable from "../components/users/students/StudentTable/StudentTable";
import { useCurrentUser } from "../hooks/useCurrentUser";

const StudentManagement = () => {
  const { paginationModel, setPaginationModel } = usePaginationModel();
  const { dispatchCurrentSnackBar } = useSnackbar();
  const searchParams = useSearchParams();
  const { userRole } = useCurrentUser();

  const [userNameKeyword, setUserNameKeyword] = useState<string>('');
  const [studentStatus, setStudentStatus] = useState<UserStatus>(searchParams.get('status') as UserStatus || UserStatus.Approved);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);

  const { data, loading, refetch } =
    useQuery(getStudentsQuery, {
      fetchPolicy: 'network-only',
      variables: {
        paginationOptions: {
          limit: paginationModel.pageSize,
          pageNum: paginationModel.page,
        },
        filterOptions: {
          roles: [UserRole.Student],
          status: studentStatus,
          userName: userNameKeyword,
        },
      },
      skip: userRole === "STUDENT",
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

  if (userRole === 'STUDENT') {
    return (
      <Box display={'flex'} justifyContent={'center'} alignItems={'center'} height={'100vh'}>
        접근 권한이 없습니다.
      </Box>
    );
  }

  return (
    <Box width={'100%'} display={'flex'} justifyContent={'center'} flexDirection={'column'}>
      <Box display={'flex'} justifyContent={'center'}>
        <StudentFilter
          userNameKeyword={userNameKeyword}
          setUserNameKeyword={setUserNameKeyword}
          studentStatus={studentStatus}
          setStudentStatus={setStudentStatus}
          setSelectedStudents={setSelectedStudents}
        />
      </Box>
      <Box display={'flex'} alignItems={'center'} flexDirection={'column'} width={'100%'}>
        <StudentTable
          loading={loading}
          students={data?.getUsers.records || []}
          pageCount={data?.getUsers.pageInfo.pageCount || 0}
          page={paginationModel.page}
          paginationModel={paginationModel}
          setPaginationModel={setPaginationModel}
          studentStatus={studentStatus}
          refetch={refetch}
          selectedStudents={selectedStudents}
          setSelectedStudents={setSelectedStudents}
        />
      </Box>
    </Box>
  );
}

export default StudentManagement;