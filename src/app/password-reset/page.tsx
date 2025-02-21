'use client';

import { Box } from "@mui/material";
import dynamic from "next/dynamic";

const PasswordResetForm = dynamic(() => import('../components/password-reset/PasswordResetForm/PasswordResetForm'), { ssr: false });

const PasswordReset = () => {
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
      <PasswordResetForm/>
    </Box>
  );
}

export default PasswordReset;