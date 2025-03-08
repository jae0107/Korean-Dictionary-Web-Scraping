'use client'

import { Box } from "@mui/material";
import AccessDenied from "../components/shared/AccessDenied";
import PasswordResetRequestManagementTable from "../components/password-reset-request-management/PasswordResetRequestManagementTable/PasswordResetRequestManagementTable";
import { useQuery } from "@apollo/client";
import { getPasswordRequestsQuery } from "./query";
import { UserRole } from "../generated/gql/graphql";
import usePaginationModel from "../hooks/usePaginationModel";
import { useSnackbar } from "../hooks/useSnackbar";
import { useCheckSessionVersion } from "../hooks/useCheckSessionVersion";
import { useSession } from "next-auth/react";

const PasswordResetRequestManagement = () => {
  useCheckSessionVersion();
  const { data: session } = useSession();

  const { paginationModel, setPaginationModel } = usePaginationModel();
  const { dispatchCurrentSnackBar } = useSnackbar();

  const { data, loading, refetch } =
    useQuery(getPasswordRequestsQuery, {
      fetchPolicy: 'network-only',
      variables: {
        paginationOptions: {
          limit: paginationModel.pageSize,
          pageNum: paginationModel.page,
        },
        filterOptions: {
          roles: [UserRole.Student]
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
      <Box display={'flex'} alignItems={'center'} flexDirection={'column'} width={'100%'} mt={2} mb={2}>
        <PasswordResetRequestManagementTable
          loading={loading}
          passwordResetRequests={data?.getPasswordResetRequests.records ?? []}
          pageCount={data?.getPasswordResetRequests.pageInfo.pageCount ?? 0}
          page={paginationModel.page}
          paginationModel={paginationModel}
          setPaginationModel={setPaginationModel}
          refetch={refetch}
        />
      </Box>
    </Box>
  );
}

export default PasswordResetRequestManagement;