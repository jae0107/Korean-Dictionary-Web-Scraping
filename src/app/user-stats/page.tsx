'use client'

import { useQuery } from "@apollo/client";
import usePaginationModel from "../hooks/usePaginationModel";
import { useSnackbar } from "../hooks/useSnackbar";
import { getUserStatsQuery } from "./query";
import { UserRole, UserStatus } from "../generated/gql/graphql";
import { useState } from "react";
import { useDebounce } from "../hooks/useDebounce";
import AccessDenied from "../components/shared/AccessDenied";
import { Box, IconButton, InputAdornment, Stack, TextField } from "@mui/material";
import { Cancel } from "@mui/icons-material";
import UserStatTable from "../components/user-stats/UserStatTable/UserStatTable";
import { useCheckSessionVersion } from "../hooks/useCheckSessionVersion";
import { useSession } from "next-auth/react";

const UserStats = () => {
  useCheckSessionVersion();
  const { data: session } = useSession();

  const { paginationModel, setPaginationModel } = usePaginationModel();
  const { dispatchCurrentSnackBar } = useSnackbar();

  const [userNameKeyword, setUserNameKeyword] = useState<string>('');

  const debouncedUserNameKeyWord = useDebounce(userNameKeyword, 500);

  const { data, loading } =
    useQuery(getUserStatsQuery, {
      fetchPolicy: 'network-only',
      variables: {
        paginationOptions: {
          limit: paginationModel.pageSize,
          pageNum: paginationModel.page,
        },
        filterOptions: {
          roles: [UserRole.Student],
          statuses: [UserStatus.Approved],
          userName: debouncedUserNameKeyWord,
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
    <Stack spacing={2} width={'100%'} display={'flex'} justifyContent={'center'} flexDirection={'column'} alignItems={'center'}>
      <Box width={'90%'}>
        <TextField
          label="이름 검색"
          value={userNameKeyword}
          onChange={(e) => setUserNameKeyword(e.target.value)}
          sx={{ 
            width: '250px',
            '@media (max-width:600px)': {
              width: '100%',
            }
          }}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setUserNameKeyword('')}>
                    <Cancel sx={{ width: '15px', height: '15px' }}/>
                  </IconButton>
                </InputAdornment>
              ),
            },
            htmlInput: {
              sx: {
                '@media (max-width:600px)': {
                  fontSize: '0.8rem',
                }
              },
            },
          }}
        />
      </Box>
      <Box display={'flex'} alignItems={'center'} flexDirection={'column'} width={'100%'} mb={2}>
        <UserStatTable
          loading={loading}
          students={data?.getUsers.records || []}
          pageCount={data?.getUsers.pageInfo.pageCount || 0}
          page={paginationModel.page}
          paginationModel={paginationModel}
          setPaginationModel={setPaginationModel}
        />
      </Box>
    </Stack>
  );
}

export default UserStats;