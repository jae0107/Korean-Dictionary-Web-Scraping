import { useColorModeContext, useThemeContext } from "@/app/components/Providers/Providers";
import { useSnackbar } from "@/app/hooks/useSnackbar";
import { z } from "zod";
import { useRouter } from 'next/navigation';
import { useState } from "react";
import { FieldErrors, SubmitErrorHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { Box, Button, Divider, IconButton, InputAdornment, InputLabel, Stack, TextField, Typography } from "@mui/material";
import { Cancel, Login, Visibility, VisibilityOff } from "@mui/icons-material";
import Link from "next/link";
import ColourModeSwitch from "@/app/components/shared/ColourModeSwitch";

const schema = z.object({
  email: z.string().nonempty({ message: "이메일을 작성하십시오." }).email({ message: "잘못된 이메일 형식입니다." }),
  password: z.string().nonempty({ message: "비밀번호를 작성하십시오." }),
});

interface LoginInput {
  email: string;
  password: string;
}

const LoginForm = () => {
  const theme = useThemeContext();
  const { dispatchCurrentSnackBar } = useSnackbar();
  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: zodResolver(schema),
  });

  const { register, handleSubmit, watch, setValue, formState: { errors } } = form;

  const getErrorMsg = (errors: FieldErrors<LoginInput>) => {
    if (errors) {
      return Object.keys(errors)
        .reduce((messages: string[], key) => {
          const index = key as keyof LoginInput;
  
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
  
  const onError: SubmitErrorHandler<LoginInput> = (errors) => {
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

  const onSubmit = async () => {
    setLoading(true);
    const res = await signIn('credentials', {
      username: watch('email'),
      password: watch('password'),
      redirect: false,
      callbackUrl: '/',
    });

    if (res && res.error) {
      dispatchCurrentSnackBar({
        payload: {
          open: true,
          type: 'error',
          message: res.error,
        },
      });
    } else {
      router.push('/');
    }
    setLoading(false);
  };

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
        <Stack spacing={4}>
          <Box display={'flex'} flexDirection={'row'} justifyContent={'space-between'} alignItems={'center'}>
            <Stack spacing={2} direction={'row'} alignItems={'center'}>
              <Login 
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
                로그인
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
          <Button 
            fullWidth 
            type='submit' 
            variant="contained" 
            loading={loading} 
            sx={{ 
              fontSize: '0.875rem',
              '@media (max-width:530px)': {
                fontSize: '0.8rem',
              }
            }}
          >
            로그인
          </Button>
        </Stack>
        <Divider/>
        <Stack spacing={2}>
          <Box>
            <Typography 
              variant={'body2'} 
              mb={1} 
              fontSize={'0.875rem'}
              sx={{
                '@media (max-width:530px)': {
                  fontSize: '0.75rem',
                }
              }}
            >
              계정이 없으신가요?
            </Typography>
            <Button
              fullWidth
              variant='outlined'
              component={Link}
              href={'/signup'}
              sx={{ 
                fontSize: '0.875rem',
                '@media (max-width:530px)': {
                  fontSize: '0.8rem',
                }
              }}
            >
              회원가입
            </Button>
          </Box>
          <Typography 
            variant={'body2'} 
            fontSize={'0.875rem'}
            sx={{
              '@media (max-width:530px)': {
                fontSize: '0.75rem',
              }
            }}
          >
            비밀번호를 잊으셨나요? <a href={'/forgot-password'}>비밀번호 찾기</a>
          </Typography>
        </Stack>
      </Stack>
    </form>
  );
}

export default LoginForm;