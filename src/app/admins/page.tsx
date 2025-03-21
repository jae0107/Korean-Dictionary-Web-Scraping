'use client'

import { useSearchParams } from "next/navigation";
import usePaginationModel from "../hooks/usePaginationModel";
import { useSnackbar } from "../hooks/useSnackbar";
import { useState } from "react";
import { SortOptions, UserRole, UserStatus } from "../generated/gql/graphql";
import { Box } from "@mui/material";
import { useQuery } from "@apollo/client";
import { getAdminsQuery } from "./query";
import AdminFilter from "../components/users/admins/AdminFilter/AdminFilter";
import AdminTable from "../components/users/admins/AdminTable/AdminTable";
import AccessDenied from "../components/shared/AccessDenied";
import { useDebounce } from "../hooks/useDebounce";
import { useSession } from "next-auth/react";
import { useCheckSessionVersion } from "../hooks/useCheckSessionVersion";

const AdminManagement = () => {
  useCheckSessionVersion();
  const { data: session } = useSession();

  const { paginationModel, setPaginationModel } = usePaginationModel();
  const { dispatchCurrentSnackBar } = useSnackbar();
  const searchParams = useSearchParams();

  const [userNameKeyword, setUserNameKeyword] = useState<string>('');
  const [adminStatus, setAdminStatus] = useState<UserStatus>(searchParams.get('status') as UserStatus || UserStatus.Approved);
  const [selectedAdmins, setSelectedAdmins] = useState<string[]>([]);
  const [getNameSort, setNameSort] = useState<SortOptions | null>(null);

  const debouncedUserNameKeyWord = useDebounce(userNameKeyword, 500);

  const { data, loading, refetch } =
    useQuery(getAdminsQuery, {
      fetchPolicy: 'network-only',
      variables: {
        paginationOptions: {
          limit: paginationModel.pageSize,
          pageNum: paginationModel.page,
        },
        filterOptions: {
          roles: [UserRole.Admin, UserRole.Superadmin],
          statuses: [adminStatus],
          userName: debouncedUserNameKeyWord,
          nameSort: getNameSort,
        },
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

  if (session?.user.role === 'STUDENT' || session?.user.role === 'TEACHER') {
    return <AccessDenied/>;
  }

  return (
    <Box width={'100%'} display={'flex'} justifyContent={'center'} flexDirection={'column'}>
      <Box display={'flex'} justifyContent={'center'}>
        <AdminFilter
          userNameKeyword={userNameKeyword}
          setUserNameKeyword={setUserNameKeyword}
          adminStatus={adminStatus}
          setAdminStatus={setAdminStatus}
          setSelectedAdmins={setSelectedAdmins}
        />
      </Box>
      <Box display={'flex'} alignItems={'center'} flexDirection={'column'} width={'100%'} mb={2}>
        <AdminTable
          loading={loading}
          admins={data?.getUsers.records || []}
          pageCount={data?.getUsers.pageInfo.pageCount || 0}
          page={paginationModel.page}
          paginationModel={paginationModel}
          setPaginationModel={setPaginationModel}
          adminStatus={adminStatus}
          refetch={refetch}
          selectedAdmins={selectedAdmins}
          setSelectedAdmins={setSelectedAdmins}
          myRole={session?.user.role}
          setNameSort={setNameSort}
        />
      </Box>
    </Box>
  );
}

export default AdminManagement;