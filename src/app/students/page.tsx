'use client'

import { useQuery } from "@apollo/client";
import { getStudentsQuery } from "./query";
import usePaginationModel from "../hooks/usePaginationModel";
import { useSnackbar } from "../hooks/useSnackbar";
import { UserImportedStatus, UserRole, UserStatus } from "../generated/gql/graphql";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Box } from "@mui/material";
import StudentFilter from "../components/users/students/StudentFilter/StudentFilter";
import StudentTable from "../components/users/students/StudentTable/StudentTable";
import AccessDenied from "../components/shared/AccessDenied";
import { useDebounce } from "../hooks/useDebounce";
import { useCheckSessionVersion } from "../hooks/useCheckSessionVersion";
import { useSession } from "next-auth/react";

const StudentManagement = () => {
  useCheckSessionVersion();
  const { data: session } = useSession();

  const { paginationModel, setPaginationModel } = usePaginationModel();
  const { dispatchCurrentSnackBar } = useSnackbar();
  const searchParams = useSearchParams();

  const [userNameKeyword, setUserNameKeyword] = useState<string>('');
  const [studentStatus, setStudentStatus] = useState<UserStatus>(searchParams.get('status') as UserStatus || UserStatus.Approved);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [studentImportedStatus, setStudentImportedStatus] = useState<UserImportedStatus | null>(null);

  const debouncedUserNameKeyWord = useDebounce(userNameKeyword, 500);

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
          statuses: [studentStatus],
          userName: debouncedUserNameKeyWord,
          importedStatus: studentImportedStatus,
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
      <Box display={'flex'} justifyContent={'center'}>
        <StudentFilter
          userNameKeyword={userNameKeyword}
          setUserNameKeyword={setUserNameKeyword}
          studentStatus={studentStatus}
          setStudentStatus={setStudentStatus}
          setSelectedStudents={setSelectedStudents}
          studentImportedStatus={studentImportedStatus}
          setStudentImportedStatus={setStudentImportedStatus}
        />
      </Box>
      <Box display={'flex'} alignItems={'center'} flexDirection={'column'} width={'100%'} mb={2}>
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