'use client';

import { Box } from "@mui/material";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const SignUpForm = dynamic(() => import('../components/users/user/SignUpForm/SignUpForm'), { ssr: false });

const SignUp = () => {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/');
    }
  }, [status, router]);

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
        '@media (max-height:910px)': {
          marginTop: '16px !important',
          marginBottom: '16px !important',
        }
      }}
    >
      <SignUpForm/>
    </Box>
  );
}

export default SignUp;