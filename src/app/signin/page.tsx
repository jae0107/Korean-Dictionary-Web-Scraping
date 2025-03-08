'use client';

import { Box } from '@mui/material';
import dynamic from 'next/dynamic';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSnackbar } from '../hooks/useSnackbar';
import { useEffect } from 'react';
import { useSession } from 'next-auth/react';

const LoginForm = dynamic(() => import('../components/users/user/LoginForm/LoginForm'), { ssr: false });

const Login = () => {
  const { status } = useSession();
  const router = useRouter();
  
  const searchParams = useSearchParams();
  const error = searchParams?.get("error");
  const { dispatchCurrentSnackBar } = useSnackbar();

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/');
    }
  }, [status, router]);
  
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
          message: '아이디 혹은 비밀번호가 일치하지 않습니다.',
        },
      });
    }
  }, [searchParams, dispatchCurrentSnackBar]);
  
  return (
    <Box 
      display={'flex'} 
      flexDirection={'column'} 
      justifyContent={'center'} 
      alignItems={'center'} 
      minHeight={'100vh'} 
      mt={0} 
      mb={0}
      sx={{
        '@media (max-height:600px)': {
          marginTop: '16px !important',
          marginBottom: '16px !important',
        }
      }}
    >
      <LoginForm/>
    </Box>
  );
};

export default Login;