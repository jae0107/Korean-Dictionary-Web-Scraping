import { useMutation } from "@apollo/client";
import { FormEvent, useState } from "react";
import { useSnackbar } from "@/app/hooks/useSnackbar";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { FieldErrors, SubmitErrorHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signOut, useSession } from "next-auth/react";
import { Cancel, Close, Done, RadioButtonUnchecked, Visibility, VisibilityOff, VpnKey } from "@mui/icons-material";
import { Box, Button, IconButton, InputAdornment, InputLabel, Stack, TextField, Theme, Typography } from "@mui/material";
import { passwordSetUpMutation } from "./query";

const schema = z.object({
  password: z
    .string()
    .nonempty({ message: "비밀번호를 작성하십시오." })
    .min(8, { message: "비밀번호는 최소 8자 이상이어야 합니다." })
    .regex(/[A-Z]/, { message: "비밀번호에 최소 하나의 대문자가 포함되어야 합니다." })
    .regex(/[a-z]/, { message: "비밀번호에 최소 하나의 소문자가 포함되어야 합니다." })
    .regex(/[0-9]/, { message: "비밀번호에 최소 하나의 숫자가 포함되어야 합니다." })
    .regex(/[\W_]/, { message: "비밀번호에 최소 하나의 특수문자 (!@#$%^&*)가 포함되어야 합니다." }),
});

const PasswordSetUpForm = ({ theme } : { theme: Theme | null }) => {
  const { data: session } = useSession();
  const { dispatchCurrentSnackBar } = useSnackbar();
  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordCheck, setShowPasswordCheck] = useState(false);
  const [passwordCheck, setPasswordCheck] = useState<string>('');
  
  const [passwordSetUp] = useMutation(passwordSetUpMutation);

  const form = useForm({
    defaultValues: {
      password: '',
    },
    resolver: zodResolver(schema),
  });
    
  const { control, register, handleSubmit, watch, setValue, formState: { errors }, setError, clearErrors } = form;
  
  const passwordConditions = [
    { regex: /.{8,}/, message: "비밀번호는 최소 8자 이상이어야 합니다." },
    { regex: /[A-Z]/, message: "비밀번호에 최소 하나의 대문자가 포함되어야 합니다." },
    { regex: /[a-z]/, message: "비밀번호에 최소 하나의 소문자가 포함되어야 합니다." },
    { regex: /[0-9]/, message: "비밀번호에 최소 하나의 숫자가 포함되어야 합니다." },
    { regex: /[\W_]/, message: "비밀번호에 최소 하나의 특수문자 (!@#$%^&*)가 포함되어야 합니다." },
  ];

  const getErrorMsg = (errors: FieldErrors<{password: string}>) => {
    if (errors) {
      return Object.keys(errors)
        .reduce((messages: string[], key) => {
          const index = key as keyof {password: string};
      
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
      
  const onError: SubmitErrorHandler<{password: string}> = (errors) => {
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

  const onSubmit = async ({ password } : { password: string }) => {
    setLoading(true);
    session && passwordSetUp({
      variables: {
        passwordSetUpId: session.user.id,
        password: password,
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
      },
      onCompleted: async () => {
        await signOut({ callbackUrl: '/signin' });
        setLoading(false);
        dispatchCurrentSnackBar({
          payload: {
            open: true,
            type: 'success',
            message: '비밀번호가 성공적으로 설정되었습니다.',
          },
        });
      },
    });
  };

  const onFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (passwordCheck !== watch('password')) {
      setError('password', { message: '비밀번호가 일치하지 않습니다.' });
      dispatchCurrentSnackBar({
        payload: {
          open: true,
          type: 'error',
          message: '비밀번호가 일치하지 않습니다.',
        },
      });
    }
    passwordCheck === watch('password') && handleSubmit(onSubmit, onError)();
  }
  
  const getIcon = (condition: { regex: RegExp, message: string }) => {
    if (watch('password') === '') {
      return <RadioButtonUnchecked color='action' sx={{ width: '10px', height: '10px', mr: 1 }}/>
    } else if (condition.regex.test(watch('password'))) {
      return <Done color='success' sx={{ width: '10px', height: '10px', mr: 1 }}/>;
    }
    return <Close color='error' sx={{ width: '10px', height: '10px', mr: 1 }}/>;
  }
  
  return (
    <form 
      onSubmit={onFormSubmit} 
      style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        width: '100%'
      }}
    >
      <Stack 
        spacing={4} 
        width={'500px'} 
        padding={5} 
        borderRadius={2} 
        boxShadow={2} 
        bgcolor={theme && theme.palette.mode === 'dark' ? '#272727' : '#dfdcdc'}
        sx={{
          '@media (max-width:530px)': {
            width: '95% !important',
          }
        }}
      >
        <Typography variant='h5' display={'flex'} flexDirection={'row'} alignItems={'center'}>
          <VpnKey color='primary' sx={{ width: '40px', height: '40px', mr: 1 }}/>비밀번호 설정
        </Typography>
        <Box width={'100%'}>
          <InputLabel 
            required 
            sx={{ 
              marginBottom: 1, 
              fontSize: '1rem',
              '@media (max-width:530px)': {
                fontSize: '0.8rem',
              }
            }}
          >
            비밀번호
          </InputLabel>
          <TextField
            placeholder="비밀번호를 입력하세요."
            {...register('password')}
            type={showPassword ? 'text' : 'password'}
            fullWidth
            error={!!errors.password}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setValue('password', '')} sx={{ mr: '2px' }}>
                      <Cancel sx={{ width: '15px', height: '15px' }}/>
                    </IconButton>
                    <IconButton onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <VisibilityOff sx={{ width: '20px', height: '20px' }}/> : <Visibility sx={{ width: '20px', height: '20px' }}/>}
                    </IconButton>
                  </InputAdornment>
                ),
              },
              htmlInput: {
                sx: {
                  '@media (max-width:530px)': {
                    fontSize: '0.8rem',
                  }
                },
              },
            }}
            variant="outlined" 
          />
          {
            watch('password') !== '' &&
            <Stack spacing={0.5} mt={1}>
              {passwordConditions.map((condition, index) => {
                return (
                  <Typography
                    key={index}
                    variant='body2'
                    fontSize={'0.80rem'}
                    display={'flex'}
                    alignItems={'center'}
                    color={watch('password') === '' ? 'textSecondary' : condition.regex.test(watch('password')) ? 'success' : 'error'}
                  >
                    {getIcon(condition)}{condition.message}
                  </Typography>
                );
              })}
            </Stack>
          }
        </Box>
        <Box width={'100%'}>
          <InputLabel 
            required 
            sx={{ 
              marginBottom: 1, 
              fontSize: '1rem',
              '@media (max-width:530px)': {
                fontSize: '0.8rem',
              }
            }}
          >
            비밀번호 확인
          </InputLabel>
          <TextField
            placeholder="비밀번호를 다시 입력하세요."
            type={showPasswordCheck ? 'text' : 'password'}
            fullWidth
            value={passwordCheck}
            onChange={(e) => setPasswordCheck(e.target.value)}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setValue('password', '')} sx={{ mr: '2px' }}>
                      <Cancel sx={{ width: '15px', height: '15px' }}/>
                    </IconButton>
                    <IconButton onClick={() => setShowPasswordCheck(!showPasswordCheck)}>
                      {showPasswordCheck ? <VisibilityOff sx={{ width: '20px', height: '20px' }}/> : <Visibility sx={{ width: '20px', height: '20px' }}/>}
                    </IconButton>
                  </InputAdornment>
                ),
              },
              htmlInput: {
                sx: {
                  '@media (max-width:530px)': {
                    fontSize: '0.8rem',
                  }
                },
              },
            }}
            variant="outlined" 
          />
        </Box>
        <Box width={'100%'}>
          <Button 
            fullWidth 
            type='submit' 
            variant="contained" 
            loading={loading} 
            sx={{ 
              mt: 3, 
              fontSize: '0.875rem',
              '@media (max-width:530px)': {
                fontSize: '0.8rem',
              }
            }}
          >
            비밀번호 설정
          </Button>
        </Box>
      </Stack>
    </form>
  );
}

export default PasswordSetUpForm;