import { Box, Button, IconButton, InputAdornment, InputLabel, Stack, TextField, Typography } from '@mui/material';
import { useThemeContext } from '../../Providers/Providers';
import { useSnackbar } from '@/app/hooks/useSnackbar';
import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { passwordResetMutation } from './query';
import { FieldErrors, SubmitErrorHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PasswordResetInput } from '@/app/generated/gql/graphql';
import { z } from 'zod';
import { Cancel, Close, Done, RadioButtonUnchecked, Visibility, VisibilityOff, VpnKey } from '@mui/icons-material';
import ColourModeSwitch from '../../shared/ColourModeSwitch';
import { useRouter } from 'next/navigation';

const schema = z.object({
  email: z.string().nonempty({ message: "이메일을 작성하십시오." }).email({ message: "잘못된 이메일 형식입니다." }),
  password: z
    .string()
    .nonempty({ message: "비밀번호를 작성하십시오." })
    .min(8, { message: "비밀번호는 최소 8자 이상이어야 합니다." })
    .regex(/[A-Z]/, { message: "비밀번호에 최소 하나의 대문자가 포함되어야 합니다." })
    .regex(/[a-z]/, { message: "비밀번호에 최소 하나의 소문자가 포함되어야 합니다." })
    .regex(/[0-9]/, { message: "비밀번호에 최소 하나의 숫자가 포함되어야 합니다." })
    .regex(/[\W_]/, { message: "비밀번호에 최소 하나의 특수문자 (!@#$%^&*)가 포함되어야 합니다." }),
});

const PasswordResetForm = () => {
  const theme = useThemeContext();
  const { dispatchCurrentSnackBar } = useSnackbar();
  const router = useRouter();
  
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState(false);

  const [passwordReset] = useMutation(passwordResetMutation);  
  
  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: zodResolver(schema),
  });

  const { register, handleSubmit, watch, setValue, formState: { errors } } = form;

  const passwordConditions = [
    { regex: /.{8,}/, message: "비밀번호는 최소 8자 이상이어야 합니다." },
    { regex: /[A-Z]/, message: "비밀번호에 최소 하나의 대문자가 포함되어야 합니다." },
    { regex: /[a-z]/, message: "비밀번호에 최소 하나의 소문자가 포함되어야 합니다." },
    { regex: /[0-9]/, message: "비밀번호에 최소 하나의 숫자가 포함되어야 합니다." },
    { regex: /[\W_]/, message: "비밀번호에 최소 하나의 특수문자 (!@#$%^&*)가 포함되어야 합니다." },
  ];

  const getErrorMsg = (errors: FieldErrors<PasswordResetInput>) => {
    if (errors) {
      return Object.keys(errors)
        .reduce((messages: string[], key) => {
          const index = key as keyof PasswordResetInput;
    
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
    
  const onError: SubmitErrorHandler<PasswordResetInput> = (errors) => {
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

  const onSubmit = (data: PasswordResetInput) => {
    setLoading(true);
    passwordReset({
      variables: {
        input: {
          email: data.email,
          password: data.password,
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
      },
      onCompleted: async () => {
        dispatchCurrentSnackBar({
          payload: {
            open: true,
            type: 'success',
            message: '성공적으로 비밀번호가 재설정되었습니다.',
          },
        });
        router.push('/signin');
        setLoading(false);
      },
    });
  };

  const getIcon = (condition: { regex: RegExp, message: string }) => {
    if (watch('password') === '') {
    return <RadioButtonUnchecked color='action' sx={{ width: '10px', height: '10px', mr: 1 }}/>
    } else if (condition.regex.test(watch('password'))) {
      return <Done color='success' sx={{ width: '10px', height: '10px', mr: 1 }}/>;
    }
    return <Close color='error' sx={{ width: '10px', height: '10px', mr: 1 }}/>;
  }
  
  return (
    <form onSubmit={handleSubmit(onSubmit, onError)} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
      <Stack 
        spacing={4} 
        width={'500px'} 
        padding={5} 
        borderRadius={2} 
        boxShadow={2} 
        bgcolor={theme && theme.palette.mode === 'dark' ? '#272727' : 'white'}
        sx={{
          '@media (max-width:530px)': {
            width: '95% !important',
          }
        }}
      >
        <Box display={'flex'} flexDirection={'row'} justifyContent={'space-between'} alignItems={'center'}>
          <Stack spacing={2} direction={'row'} alignItems={'center'}>
            <VpnKey 
              color='primary'
              sx={{
                width: '40px',
                height: '40px',
                '@media (max-width:530px)': {
                  width: '30px',
                  height: '30px',
                }
              }}
            />
            <Typography 
              variant={'h4'}
              sx={{
                '@media (max-width:530px)': {
                  fontSize: '1.5rem',
                  fontWeight: 400,
                }
              }}
            >
              비밀번호 재설정
            </Typography>
          </Stack>
          <ColourModeSwitch/>
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
            이메일
          </InputLabel>
          <TextField
            placeholder="이메일을 입력하세요."
            {...register('email')}
            type='email'
            fullWidth
            error={!!errors.email}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setValue('email', '')}>
                      <Cancel sx={{ width: '15px', height: '15px' }}/>
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
          />
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
        </Box>
        <Stack spacing={0.5}>
          {passwordConditions.map((condition, index) => {
            return (
              <Typography
                key={index}
                variant='body2'
                fontSize={'0.8rem'}
                display={'flex'}
                alignItems={'center'}
                color={watch('password') === '' ? 'textSecondary' : condition.regex.test(watch('password')) ? 'success' : 'error'}
              >
                {getIcon(condition)}{condition.message}
              </Typography>
            );
          })}
        </Stack>
        <Button type='submit' variant='contained' color='primary' loading={loading}>
          비밀번호 재설정
        </Button>
      </Stack>
    </form>
  );
}

export default PasswordResetForm;