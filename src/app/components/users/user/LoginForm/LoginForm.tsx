import { useThemeContext } from "@/app/components/Providers/Providers";
import { useSnackbar } from "@/app/hooks/useSnackbar";
import { z } from "zod";
import { useRouter } from 'next/navigation';
import { useState } from "react";
import { FieldErrors, SubmitErrorHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getSession, signIn } from "next-auth/react";
import { Box, Button, Divider, IconButton, InputAdornment, InputLabel, Stack, TextField, Typography } from "@mui/material";
import { Cancel, Login, Visibility, VisibilityOff } from "@mui/icons-material";
import Link from "next/link";
import ColourModeSwitch from "@/app/components/shared/ColourModeSwitch";

const schema = z.object({
  accountId: z
    .string()
    .nonempty({ message: "아이디를 작성하십시오." })
    .min(4, { message: "아이디는 최소 4자 이상이어야 합니다." })
    .max(20, { message: "아이디는 최대 20자 이하여야 합니다." })
    .regex(/^[a-zA-Z0-9_]+$/, { message: "아이디는 영문, 숫자, 밑줄(_)만 포함할 수 있습니다." }),
  password: z.string().nonempty({ message: "비밀번호를 작성하십시오." }),
});

interface LoginInput {
  accountId: string;
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
      accountId: '',
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
      username: watch('accountId'),
      password: watch('password'),
      redirect: false,
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
      const session = await getSession();
      if (session?.user.status === 'PENDING') {
        router.push('/password-setup');
      } else if (session?.user.status === 'APPROVED') {
        router.push('/');
      }
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
        bgcolor={theme && theme.palette.mode === 'dark' ? '#272727' : '#dfdcdc'}
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
              아이디
            </InputLabel>
            <TextField
              placeholder="아이디를 입력하세요."
              {...register('accountId')}
              type='text'
              fullWidth
              error={!!errors.accountId}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setValue('accountId', '')}>
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
            아이디를 잊으셨나요? <Link href={'/find-my-id'}>아이디 찾기</Link>
          </Typography>
          <Typography 
            variant={'body2'} 
            fontSize={'0.875rem'}
            sx={{
              '@media (max-width:530px)': {
                fontSize: '0.75rem',
              }
            }}
          >
            비밀번호를 잊으셨나요? <Link href={'/password-reset-request'}>비밀번호 재설정 요청</Link>
          </Typography>
        </Stack>
      </Stack>
    </form>
  );
}

export default LoginForm;