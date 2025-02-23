'use client'

import { Box, Typography } from "@mui/material";
import AccessDenied from "../components/shared/AccessDenied";
import { useCurrentUser } from "../hooks/useCurrentUser";
import {useDropzone} from 'react-dropzone';
import { useThemeContext } from "../components/Providers/Providers";
import { FileUpload } from "@mui/icons-material";

const AccountCreation = () => {
  const theme = useThemeContext();
  const { myRole } = useCurrentUser();
  
  if (myRole === 'STUDENT') {
    return <AccessDenied/>;
  }

  const {
    acceptedFiles,
    fileRejections,
    getRootProps,
    getInputProps,
  } = useDropzone({
    accept: {
      'text/csv': [], // For CSV files
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [], // For Excel files (.xlsx)
      'application/vnd.ms-excel': [] // For Excel files (.xls)
    },
    multiple: false,
    onDrop: (acceptedFiles) => {
      console.log(acceptedFiles)
    },
  });

  return (
    <Box 
      width={'100%'} 
      height={'calc(100vh - 86.5px)'} 
      display={'flex'} 
      justifyContent={'center'} 
      alignItems={'center'}
    >
      <Box 
        {...getRootProps()} 
        border={'2px dotted #888888'} 
        width={'95%'} 
        height={'50%'} 
        p={5} 
        display={'flex'} 
        justifyContent={'center'} 
        alignItems={'center'}
        bgcolor={'#8888881c'}
      >
        <input {...getInputProps()} />
        <Typography display={'flex'} alignItems={'center'} justifyContent={'center'}>
          <FileUpload sx={{ mr: 1 }}/>드래그 앤 드롭하거나 클릭하여 파일을 업로드하세요.
        </Typography>
      </Box>
    </Box>
    
  );
}

export default AccountCreation;