'use client'

import { useQuery } from "@apollo/client";
import { getMyPasswordQuery } from "./query";
import { useSnackbar } from "../hooks/useSnackbar";
import { Box, Stack, Typography } from "@mui/material";
import PasswordChangeForm from "../components/password-change/PasswordChangeForm/PasswordChangeForm";
import { VpnKey } from "@mui/icons-material";
import DummyPasswordChangeForm from "../components/password-change/DummyPasswordChangeForm/DummyPasswordChangeForm";

const PasswordChange = () => {
  const { dispatchCurrentSnackBar } = useSnackbar();

  const { data, loading } = useQuery(getMyPasswordQuery, {
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

  return (
    <Box width={'100%'} display={'flex'} justifyContent={'center'}>
      <Stack 
        spacing={4} 
        width={'400px'} 
        mt={2} 
        alignSelf={'center'}
        sx={{
          '@media (max-width:420px)': {
            width: '95% !important',
          }
        }}
      >  
        <Typography variant='h5' display={'flex'} flexDirection={'row'} alignItems={'center'}>
          <VpnKey color='primary' sx={{ width: '40px', height: '40px', mr: 1 }}/>비밀번호 변경
        </Typography>
        {
          loading && <DummyPasswordChangeForm/>
        }
        {
          data && data.getCurrentUser.password &&
          <PasswordChangeForm id={data.getCurrentUser.id}/>
        }
      </Stack>  
    </Box>
  );
}

export default PasswordChange;