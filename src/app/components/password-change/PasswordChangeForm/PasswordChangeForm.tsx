import { zodResolver } from "@hookform/resolvers/zod";
import { Cancel, Close, Done, RadioButtonUnchecked, Visibility, VisibilityOff } from "@mui/icons-material";
import { Box, Button, IconButton, InputAdornment, InputLabel, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { FieldErrors, SubmitErrorHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { useSnackbar } from "@/app/hooks/useSnackbar";
import { useMutation } from "@apollo/client";
import { changeCurrentPasswordMutation } from "./query";
import { signOut } from "next-auth/react";
import { FindPasswordInput } from "@/app/generated/gql/graphql";

const schema = z.object({
  currentPassword: z
    .string()
    .nonempty({ message: "현재 비밀번호를 작성하십시오." }),
  newPassword: z
    .string()
    .nonempty({ message: "새 비밀번호를 작성하십시오." })
    .min(8, { message: "비밀번호는 최소 8자 이상이어야 합니다." })
    .regex(/[A-Z]/, { message: "비밀번호에 최소 하나의 대문자가 포함되어야 합니다." })
    .regex(/[a-z]/, { message: "비밀번호에 최소 하나의 소문자가 포함되어야 합니다." })
    .regex(/[0-9]/, { message: "비밀번호에 최소 하나의 숫자가 포함되어야 합니다." })
    .regex(/[\W_]/, { message: "비밀번호에 최소 하나의 특수문자 (!@#$%^&*)가 포함되어야 합니다." }),
});

const PasswordChangeForm = ({
  id,
} : {
  id: string;
}) => {
  const { dispatchCurrentSnackBar } = useSnackbar();

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);

  const [changeCurrentPassword] = useMutation(changeCurrentPasswordMutation);

  const form = useForm({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
    },
    resolver: zodResolver(schema),
  });

  const { register, handleSubmit, watch, setValue, setError, formState: { errors } } = form;

  const passwordConditions = [
    { regex: /.{8,}/, message: "비밀번호는 최소 8자 이상이어야 합니다." },
    { regex: /[A-Z]/, message: "비밀번호에 최소 하나의 대문자가 포함되어야 합니다." },
    { regex: /[a-z]/, message: "비밀번호에 최소 하나의 소문자가 포함되어야 합니다." },
    { regex: /[0-9]/, message: "비밀번호에 최소 하나의 숫자가 포함되어야 합니다." },
    { regex: /[\W_]/, message: "비밀번호에 최소 하나의 특수문자 (!@#$%^&*)가 포함되어야 합니다." },
  ];

  const getErrorMsg = (errors: FieldErrors<FindPasswordInput>) => {
    if (errors) {
      return Object.keys(errors)
        .reduce((messages: string[], key) => {
          const index = key as keyof FindPasswordInput;
    
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
    
  const onError: SubmitErrorHandler<FindPasswordInput> = (errors) => {
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

  const onSubmit = (data: FindPasswordInput) => {
    setLoading(true);
    changeCurrentPassword({
      variables: {
        changeCurrentPasswordId: id,
        input: {
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        },
      },
      onError: (error) => {
        setLoading(false);
        dispatchCurrentSnackBar({
          payload: {
            open: true,
            type: 'error',
            message: error.message,
          },
        });
        if (error.message === '입력한 현재 비밀번호가 일치하지 않습니다.') {
          setError('currentPassword', { type: 'manual', message: '입력한 현재 비밀번호가 일치하지 않습니다.' });
        }
      },
      onCompleted: async () => {
        await signOut({ callbackUrl: '/signin' });
        dispatchCurrentSnackBar({
          payload: {
            open: true,
            type: 'success',
            message: '성공적으로 비밀번호가 변경되었습니다.',
          },
        });
        setLoading(false);
      },
    });
  };

  const getIcon = (condition: { regex: RegExp, message: string }) => {
    if (watch('newPassword') === '') {
      return <RadioButtonUnchecked color='action' sx={{ width: '10px', height: '10px', mr: 1 }}/>
    } else if (condition.regex.test(watch('newPassword'))) {
      return <Done color='success' sx={{ width: '10px', height: '10px', mr: 1 }}/>;
    }
    return <Close color='error' sx={{ width: '10px', height: '10px', mr: 1 }}/>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit, onError)}>
      <Stack spacing={2}>
        <Box width={'100%'}>
          <InputLabel sx={{ marginBottom: 1 }} required>현재 비밀번호</InputLabel>
          <TextField
            {...register('currentPassword')}
            placeholder="현재 비밀번호를 입력하세요."
            type={showCurrentPassword ? 'text' : 'password'}
            error={!!errors.currentPassword}
            fullWidth
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setValue('currentPassword', '')} sx={{ mr: '2px' }}>
                      <Cancel sx={{ width: '15px', height: '15px' }}/>
                    </IconButton>
                    <IconButton onClick={() => setShowCurrentPassword(!showCurrentPassword)}>
                      {showCurrentPassword ? <VisibilityOff sx={{ width: '20px', height: '20px' }}/> : <Visibility sx={{ width: '20px', height: '20px' }}/>}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
            variant="outlined" 
          />
        </Box>
        <Box width={'100%'}>
          <InputLabel sx={{ marginBottom: 1 }} required>새 비밀번호</InputLabel>
          <TextField
            {...register('newPassword')}
            placeholder="새 비밀번호를 입력하세요."
            type={showNewPassword ? 'text' : 'password'}
            error={!!errors.newPassword}
            fullWidth
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setValue('newPassword', '')} sx={{ mr: '2px' }}>
                      <Cancel sx={{ width: '15px', height: '15px' }}/>
                    </IconButton>
                    <IconButton onClick={() => setShowNewPassword(!showNewPassword)}>
                      {showNewPassword ? <VisibilityOff sx={{ width: '20px', height: '20px' }}/> : <Visibility sx={{ width: '20px', height: '20px' }}/>}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
            variant="outlined" 
          />
        </Box>
        <Stack spacing={0.5}>
          {passwordConditions.map((condition, index) => {
            return (
              <Typography
                key={index}
                variant='body2'
                fontSize={'0.80rem'}
                display={'flex'}
                alignItems={'center'}
                color={watch('newPassword') === '' ? 'textSecondary' : condition.regex.test(watch('newPassword')) ? 'success' : 'error'}
              >
                {getIcon(condition)}{condition.message}
              </Typography>
            );
          })}
        </Stack>
        <Button fullWidth type='submit' variant="contained" loading={loading}>
          비밀번호 변경하기
        </Button>
      </Stack>
    </form>
  );
}

export default PasswordChangeForm;