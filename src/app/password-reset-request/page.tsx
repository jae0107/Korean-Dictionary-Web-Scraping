'use client'

import { Box } from "@mui/material";
import PasswordResetRequestForm from "../components/password-reset-request/PasswordResetRequestForm/PasswordResetRequestForm";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const PasswordResetRequest = () => {
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
        '@media (max-height:820px)': {
          marginTop: '16px !important',
          marginBottom: '16px !important',
        }
      }}
    >
      <PasswordResetRequestForm/>
    </Box>
  );
}

export default PasswordResetRequest;