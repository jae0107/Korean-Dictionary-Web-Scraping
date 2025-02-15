'use client';

import { Box, useMediaQuery } from "@mui/material";
import dynamic from "next/dynamic";

const SignUpForm = dynamic(() => import('../components/users/user/SignUpForm/SignUpForm'), { ssr: false });

const SignUp = () => {
  const maxHeight900 = useMediaQuery('(max-height:900px)');
  
  return (
    <Box display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'center'} minHeight={'100vh'} mt={maxHeight900 ? 2 : 0} mb={maxHeight900 ? 2 : 0}>
      <SignUpForm/>
    </Box>
  );
}

export default SignUp;