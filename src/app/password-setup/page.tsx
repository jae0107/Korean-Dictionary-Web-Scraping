'use client'

import { Box } from "@mui/material";
import dynamic from "next/dynamic";
import AccessDenied from "../components/shared/AccessDenied";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { UserStatus } from "../generated/gql/graphql";
import { useThemeContext } from "../components/Providers/Providers";
import DummyPasswordSetUpForm from "../components/password-setup/DummyPasswordSetUpForm/DummyPasswordSetUpForm";

const PasswordSetUpForm = dynamic(() => import('../components/password-setup/PasswordSetUpForm/PasswordSetUpForm'), { ssr: false });

const PasswordSetUp = () => {
  const theme = useThemeContext();
  const { myRole, myStatus, loading } = useCurrentUser();
  
  if (!(myRole === 'STUDENT' && myStatus === UserStatus.Pending) && !loading) {
    return <AccessDenied/>;
  }
  
  return (
    <Box 
      display={'flex'} 
      flexDirection={'column'} 
      justifyContent={'center'} 
      alignItems={'center'} 
      minHeight={'calc(100vh - 86.5px)'} 
      mt={0} 
      mb={0}
      sx={{
        '@media (max-height:600px)': {
          marginTop: '16px !important',
          marginBottom: '16px !important',
        }
      }}
    >
      {
        loading ? 
        <DummyPasswordSetUpForm theme={theme}/> :
        <PasswordSetUpForm theme={theme}/>
      }
    </Box>
  );
}

export default PasswordSetUp;