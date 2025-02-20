'use client';

import { Box, useMediaQuery } from '@mui/material';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import { useSnackbar } from '../hooks/useSnackbar';
import { useEffect } from 'react';

const LoginForm = dynamic(() => import('../components/users/user/LoginForm/LoginForm'), { ssr: false });

const Login = () => {
  const searchParams = useSearchParams();
  const error = searchParams?.get("error");
  const { dispatchCurrentSnackBar } = useSnackbar();
  const maxHeight600 = useMediaQuery('(max-height:600px)');
  
  useEffect(() => {
    const isNotAuthorized = searchParams?.get('callbackUrl');
    const baseURL = typeof window !== "undefined" ? window.location.origin+'/' : "";
    
    if (isNotAuthorized && !error && baseURL !== isNotAuthorized) {
      dispatchCurrentSnackBar({
        payload: {
          open: true,
          type: 'error',
          message: '로그인이 필요합니다.',
        },
      });
    } else if (error) {
      dispatchCurrentSnackBar({
        payload: {
          open: true,
          type: 'error',
          message: '이메일 혹은 비밀번호가 일치하지 않습니다.',
        },
      });
    }
  }, [searchParams, dispatchCurrentSnackBar]);
  
  return (
    <Box display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'center'} minHeight={'100vh'} mt={maxHeight600 ? 2 : 0} mb={maxHeight600 ? 2 : 0}>
      <LoginForm/>
    </Box>
  );
};

export default Login;