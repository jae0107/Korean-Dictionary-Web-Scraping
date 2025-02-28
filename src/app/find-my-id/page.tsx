'use client'

import { Box } from "@mui/material";
import FindMyIdForm from "../components/find-my-id/FindMyIdForm/FindMyIdForm";
import { useState } from "react";

const FindMyId = () => {
  const [getAccountId, setAccountId] = useState<string>('');

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
      <FindMyIdForm/>
    </Box>
  );
}

export default FindMyId;