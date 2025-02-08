import { UserInput, UserRole } from '@/app/generated/gql/graphql';
import { useMutation } from '@apollo/client';
import { AccountBox } from '@mui/icons-material';
import { Box, Button, Typography } from '@mui/material';
import React, { useState } from 'react'
import { updateUserMutation } from '../query';
import { SubmitErrorHandler, UseFormReturn } from 'react-hook-form';
import { useSnackbar } from '@/app/hooks/useSnackbar';

const UserFormHeader = ({
  id,
  type,
  editMode,
  setEditMode,
  form,
  refetch,
} : {
  id: string;
  type?: UserRole;
  editMode: boolean;
  setEditMode: (value: boolean) => void;
  form: UseFormReturn<UserInput>;
  refetch: () => void;
}) => {
  const { dispatchCurrentSnackBar } = useSnackbar();
  
  const [getUpdateLoader, setUpdateLoader] = useState<boolean>(false);
  const [updateUser] = useMutation(updateUserMutation);
    
  const getUserType = () => {
    switch (type) {
      case UserRole.Student:
        return '학생 프로필';
      case UserRole.Teacher:
        return '선생님 프로필';
      case UserRole.Admin:
        return '관리자 프로필';
      case UserRole.Superadmin:
        return '관리자 프로필';
      default:
        return '나의 프로필';
      }
    }
  
  const { setValue, handleSubmit } = form;

  const onError: SubmitErrorHandler<UserInput> = (errors) => {
    if (Object.keys(errors).length) {
      dispatchCurrentSnackBar({
        payload: {
          open: true,
          type: 'error',
          message: 'getErrorMsg(errors)',
        },
      });
    }
  };

  const onUpdateUser = (userInput: UserInput) => {
    setUpdateLoader(true);
    updateUser({
      variables: {
        updateUserId: id,
        input: userInput,
      },
      onError: (error) => {
        setUpdateLoader(false);
        dispatchCurrentSnackBar({
          payload: {
            open: true,
            type: 'error',
            message: error.message,
          },
        });
      },
      onCompleted: () => {
        refetch();
        setEditMode(false);
        setUpdateLoader(false);
        dispatchCurrentSnackBar({
          payload: {
            open: true,
            type: 'success',
            message: '성공적으로 업데이트 되었습니다.',
          },
        });
      },
    });
  }

  return (
    <Box display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'}>
      <Box display={'flex'} flexDirection={'row'} alignItems={'center'}>
        <AccountBox color='info' sx={{ mr: 1, width: '40px', height: '40px' }}/>
        <Typography variant="h5">{getUserType()}</Typography>
      </Box>
      <Button 
        variant='outlined' 
        loading={getUpdateLoader}
        onClick={() => {
          if (editMode) {
            handleSubmit(onUpdateUser, onError)();
          } else {
            setEditMode(!editMode);
          }
        }}>
        {editMode ? '저장' : '수정'}
      </Button>
    </Box>
  );
}

export default UserFormHeader;