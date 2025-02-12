'use client';

import { Box } from '@mui/material';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import { useSnackbar } from '../hooks/useSnackbar';
import { useEffect } from 'react';

const LoginForm = dynamic(() => import('../components/users/user/LoginForm/LoginForm'), { ssr: false });

const Login = () => {
  const searchParams = useSearchParams();
  const isNotAuthorized = searchParams?.get('callbackUrl');
  const error = searchParams?.get("error");
  const { dispatchCurrentSnackBar } = useSnackbar();
  
  useEffect(() => {
    const isNotAuthorized = searchParams?.get('callbackUrl');
    
    if (isNotAuthorized && isNotAuthorized.includes('not-authorized') && !error) {
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
    <Box display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'center'} minHeight={'calc(100vh - 86.5px)'} mb={2}>
      <LoginForm/>
    </Box>
  );
};

export default Login;