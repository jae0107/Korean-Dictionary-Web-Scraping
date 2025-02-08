import { AccountBox } from "@mui/icons-material";
import { Box, Button, Stack, Typography } from "@mui/material";
import UserForm from "./UserForm/UserForm";
import { UserInput, UserRole } from "@/app/generated/gql/graphql";
import { useState } from "react";
import { FieldErrors, SubmitErrorHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@apollo/client";
import { updateUserMutation } from "./query";
import { useSnackbar } from "@/app/hooks/useSnackbar";

const UserFormContainer = ({
  id,
  defaultValues,
  userType,
  refetch,
} : {
  id: string;
  defaultValues: UserInput;
  userType: string;
  refetch: () => void;
}) => {
  const { dispatchCurrentSnackBar } = useSnackbar();
  
  const [editMode, setEditMode] = useState(false);
  const [getUpdateLoader, setUpdateLoader] = useState<boolean>(false);
  const [getRole, setRole] = useState<UserRole>(defaultValues.role || UserRole.Student);

  const [updateUser] = useMutation(updateUserMutation);

  const schema = z.object({
    name: z.string().nonempty({ message: "이름을 작성하십시오." }),
    email: z.string().email({ message: "잘못된 이메일 형식입니다." }).nonempty({ message: "이메일을 작성하십시오." }),
    year: z.number({ message: "학년은 숫자여야 합니다." }).optional()
    .refine((year) => {
      if (getRole === UserRole.Student) {
        if (year === null || year === undefined || year <= 0) {
          return false;
        }
      }
      return true
    },{ message: "학년은 숫자여야 합니다." }),
    class: z.string().nonempty({ message: "반을 입력하십시오." }).optional()
    .refine((classValue) => {
      if (getRole === UserRole.Student) {
        if (classValue === null || classValue === undefined || classValue === "0" || classValue.trim() === "") {
          return false;
        }
      }
      return true;
    },{ message: "반을 입력하십시오." }),
    number: z.number({ message: "번호는 숫자여야 합니다." }).optional()
    .refine((number) => {
      if (getRole === UserRole.Student) {
        if (number === null || number === undefined || number <= 0) {
          return false;
        }
      }
      return true;
    },{ message: "번호는 숫자여야 합니다." }),
    role: z.string().nonempty({ message: "역할을 작성하십시오." }),
  });

  const form = useForm({
    defaultValues,
    resolver: zodResolver(schema),
  });
  
  const { handleSubmit } = form;

  const getErrorMsg = (errors: FieldErrors<UserInput>) => {
    console.log("errors: ", errors)
    console.log("form: ", form.getValues())
    if (errors) {
      return Object.keys(errors)
        .reduce((messages: string[], key) => {
          const index = key as keyof UserInput;

          if (errors && errors[index]) {
            const error = errors[index];
            error && error.message && messages.push(error.message);
          }

          return messages;
        }, [])
        .join('\n');
    }
    return '';
  };

  const onError: SubmitErrorHandler<UserInput> = (errors) => {
    if (Object.keys(errors).length) {
      dispatchCurrentSnackBar({
        payload: {
          open: true,
          type: 'error',
          message: getErrorMsg(errors),
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
    <Stack spacing={4} width={'300px'} mt={2} alignSelf={'center'}>  
      <Box display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'}>
        <Box display={'flex'} flexDirection={'row'} alignItems={'center'}>
          <AccountBox color='info' sx={{ mr: 1, width: '40px', height: '40px' }}/>
          <Typography variant="h5">{`${userType} 프로필`}</Typography>
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
      <UserForm editMode={editMode} form={form} setRole={setRole}/>
    </Stack>
  );
}

export default UserFormContainer;