'use client'

import { useSearchParams } from "next/navigation";
import usePaginationModel from "../hooks/usePaginationModel";
import { useSnackbar } from "../hooks/useSnackbar";
import { useState } from "react";
import { UserRole, UserStatus } from "../generated/gql/graphql";
import { Box } from "@mui/material";
import { useQuery } from "@apollo/client";
import { getAdminsQuery } from "./query";
import AdminFilter from "../components/users/admins/AdminFilter/AdminFilter";
import AdminTable from "../components/users/admins/AdminTable/AdminTable";
import { useCurrentUser } from "../hooks/useCurrentUser";
import AccessDenied from "../components/shared/AccessDenied";

const AdminManagement = () => {
  const { paginationModel, setPaginationModel } = usePaginationModel();
  const { dispatchCurrentSnackBar } = useSnackbar();
  const searchParams = useSearchParams();
  const { myRole } = useCurrentUser();

  const [userNameKeyword, setUserNameKeyword] = useState<string>('');
  const [adminStatus, setAdminStatus] = useState<UserStatus>(searchParams.get('status') as UserStatus || UserStatus.Approved);
  const [selectedAdmins, setSelectedAdmins] = useState<string[]>([]);

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
          userName: userNameKeyword,
        },
      },
      skip: myRole === "STUDENT" || myRole === "TEACHER",
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

  if (myRole === 'STUDENT' || myRole === 'TEACHER') {
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
      <Box display={'flex'} alignItems={'center'} flexDirection={'column'} width={'100%'}>
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
          myRole={myRole}
        />
      </Box>
    </Box>
  );
}

export default AdminManagement;