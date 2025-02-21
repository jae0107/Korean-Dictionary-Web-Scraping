'use client';

import { Box } from "@mui/material";
import dynamic from "next/dynamic";

const SignUpForm = dynamic(() => import('../components/users/user/SignUpForm/SignUpForm'), { ssr: false });

const SignUp = () => {
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