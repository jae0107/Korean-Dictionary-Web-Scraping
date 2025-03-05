import { useThemeContext } from "@/app/components/Providers/Providers";
import { UserInput, UserRole } from "@/app/generated/gql/graphql";
import { useSnackbar } from "@/app/hooks/useSnackbar";
import { useLazyQuery, useMutation } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Cancel, Close, Done, Login, PersonAdd, RadioButtonUnchecked, Visibility, VisibilityOff } from "@mui/icons-material";
import { Box, Button, IconButton, InputAdornment, InputLabel, MenuItem, Select, Stack, TextField, Typography } from "@mui/material";
import { FormEvent, useState } from "react";
import { Controller, FieldErrors, SubmitErrorHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { accountIdCheckQuery, createUserMutation } from "./query";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ColourModeSwitch from "@/app/components/shared/ColourModeSwitch";
import './style.scss';

const SignUpForm = () => {
  const theme = useThemeContext();
  const { dispatchCurrentSnackBar } = useSnackbar();
  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(false);
  const [getRole, setRole] = useState<UserRole | null>(UserRole.Student);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordCheck, setShowPasswordCheck] = useState(false);
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [passwordCheck, setPasswordCheck] = useState<string>('');

  const [createUser] = useMutation(createUserMutation);
  const [accountIdCheck, {data, loading: accountIdCheckLoading}] = useLazyQuery(accountIdCheckQuery);

  const schema = z.object({
    name: z.string().nonempty({ message: "이름을 작성하십시오." }),
    accountId: z
      .string()
      .nonempty({ message: "아이디를 작성하십시오." })
      .min(4, { message: "아이디는 최소 4자 이상이어야 합니다." })
      .max(20, { message: "아이디는 최대 20자 이하여야 합니다." })
      .regex(/^[a-zA-Z0-9_]+$/, { message: "아이디는 영문, 숫자, 밑줄(_)만 포함할 수 있습니다." }),
    password: z
      .string()
      .nonempty({ message: "비밀번호를 작성하십시오." })
      .min(8, { message: "비밀번호는 최소 8자 이상이어야 합니다." })
      .regex(/[A-Z]/, { message: "비밀번호에 최소 하나의 대문자가 포함되어야 합니다." })
      .regex(/[a-z]/, { message: "비밀번호에 최소 하나의 소문자가 포함되어야 합니다." })
      .regex(/[0-9]/, { message: "비밀번호에 최소 하나의 숫자가 포함되어야 합니다." })
      .regex(/[\W_]/, { message: "비밀번호에 최소 하나의 특수문자 (!@#$%^&*)가 포함되어야 합니다." }),
    year: z.number({ message: "학년은 숫자여야 합니다." }).optional()
      .refine((year) => {
        if (getRole === UserRole.Student) {
          if (year === null || year === undefined || year <= 0) {
            return false;
          }
        }
        return true
      },{ message: "학년은 숫자여야 합니다." }),
    class: z.string().optional()
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
    role: z.nativeEnum(UserRole, { errorMap: () => ({ message: "역할을 작성하십시오." }) }),
  });
  
  const form = useForm({
    defaultValues: {
      accountId: '',
      password: '',
      name: '',
      role: UserRole.Student,
      year: 0,
      class: '0',
      number: 0,
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

  const accountIdConditions = [
    { regex: /.{4,}/, message: "아이디는 최소 4자 이상이어야 합니다." },
    { regex: /^.{1,20}$/, message: "아이디는 최대 20자 이하여야 합니다." },
    { regex: /^[a-zA-Z0-9_]+$/, message: "아이디는 영문, 숫자, 밑줄(_)만 포함할 수 있습니다." },
  ];

  const getErrorMsg = (errors: FieldErrors<UserInput>) => {
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

  const onSubmit = async (userInput: UserInput) => {
    setLoading(true);
    createUser({
      variables: {
        input: {
          ...userInput,
          year: userInput.year === 0 ? null : userInput.year,
          number: userInput.number === 0 ? null : userInput.number,
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
      onCompleted: () => {
        setLoading(false);
        dispatchCurrentSnackBar({
          payload: {
            open: true,
            type: 'success',
            message: '성공적으로 가입되었습니다.',
          },
        });
        router.push('/signin');
      },
    });
  };

  const onAccountIdCheck = async () => {
    if (watch('accountId')) {
      const res = await accountIdCheck({ 
        variables: { accountId: watch('accountId') },
        onError: (error) => {
          setIsChecked(false);
          dispatchCurrentSnackBar({
            payload: {
              open: true,
              type: 'error',
              message: error.message,
            },
          });
        },
      });
      setIsChecked(!res.data?.accountIdCheck);
      if (res.data?.accountIdCheck) {
        setError('accountId', { message: '이미 사용중인 아이디입니다.' });
        dispatchCurrentSnackBar({
          payload: {
            open: true,
            type: 'error',
            message: '이미 사용중인 아이디입니다.',
          },
        });
      } else if (!res.data?.accountIdCheck) {
        clearErrors('accountId');
        dispatchCurrentSnackBar({
          payload: {
            open: true,
            type: 'success',
            message: '사용 가능한 아이디입니다.',
          },
        });
      }
    } else {
      setIsChecked(false);
      setError('accountId', { message: '아이디를 입력해주십시오.' });
      dispatchCurrentSnackBar({
        payload: {
          open: true,
          type: 'error',
          message: '아이디를 입력해주십시오.',
        },
      });
    }
  }

  const onFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isChecked) {
      dispatchCurrentSnackBar({
        payload: {
          open: true,
          type: 'error',
          message: '아이디 중복 확인을 해주십시오.',
        },
      });
    } else if (passwordCheck !== watch('password')) {
      setError('password', { message: '비밀번호가 일치하지 않습니다.' });
      dispatchCurrentSnackBar({
        payload: {
          open: true,
          type: 'error',
          message: '비밀번호가 일치하지 않습니다.',
        },
      });
    }
    isChecked && passwordCheck === watch('password') && handleSubmit(onSubmit, onError)();
  }

  const getIcon = (condition: { regex: RegExp, message: string }, type: 'accountId' | 'password') => {
    if (watch(type) === '') {
      return <RadioButtonUnchecked color='action' sx={{ width: '10px', height: '10px', mr: 1 }}/>
    } else if (condition.regex.test(watch(type))) {
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
        bgcolor={theme && theme.palette.mode === 'dark' ? '#272727' : 'rgb(224, 223, 223)'}
        sx={{
          '@media (max-width:530px)': {
            width: '95% !important',
          }
        }}
      >
        <Stack spacing={2}>
          <Box display={'flex'} flexDirection={'row'} justifyContent={'space-between'} alignItems={'center'}>
            <Stack spacing={2} direction={'row'} alignItems={'center'}>
              <PersonAdd color='primary' sx={{ width: '40px', height: '40px' }}/>
              <Typography 
                variant={'h4'}
                sx={{
                  '@media (max-width:530px)': {
                    fontSize: '1.5rem',
                    fontWeight: 400,
                  }
                }}
              >
                회원가입
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
            <Stack spacing={1} direction={'row'} alignItems={'center'}>
              <TextField
                placeholder="아이디를 입력하세요."
                type='text'
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
                sx={{ flex: 1 }}
                value={watch('accountId')}
                onChange={(e) => {
                  setValue('accountId', e.target.value);
                  setIsChecked(false);
                }}
              />
              <Button variant='outlined' loading={accountIdCheckLoading} onClick={onAccountIdCheck} sx={{ height: '56px' }}>
                중복 확인
              </Button>
            </Stack>
            {
              watch('accountId') !== '' &&
              <Stack spacing={0.5} mt={1}>
                {accountIdConditions.map((condition, index) => {
                  return (
                    <Typography
                      key={index}
                      variant='body2'
                      fontSize={'0.80rem'}
                      display={'flex'}
                      alignItems={'center'}
                      color={watch('accountId') === '' ? 'textSecondary' : condition.regex.test(watch('accountId')) ? 'success' : 'error'}
                    >
                      {getIcon(condition, 'accountId')}{condition.message}
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
                      {getIcon(condition, 'password')}{condition.message}
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
            <InputLabel 
              sx={{ 
                marginBottom: 1, 
                fontSize: '1rem',
                '@media (max-width:530px)': {
                  fontSize: '0.8rem',
                }
              }}
              required
            >
              이름
            </InputLabel>
            <TextField
              {...register('name')}
              placeholder="이름을 입력하세요."
              type='text'
              fullWidth
              error={!!errors.name}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setValue('name', '')}>
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
              sx={{ 
                marginBottom: 1, 
                fontSize: '1rem',
                '@media (max-width:530px)': {
                  fontSize: '0.8rem',
                }
              }}
              required
            >
              역할
            </InputLabel>
            <Controller
              control={control}
              name='role'
              render={({ field }) => (
                <Select
                  value={field.value}
                  label="역할"
                  onChange={(e) => {
                    field.onChange(e);
                    setRole && setRole(e.target.value as UserRole);
                  }}
                  fullWidth
                  error={!!errors.role}
                  sx={{
                    '@media (max-width:530px)': {
                      fontSize: '0.8rem'
                    },
                  }}
                >
                  <MenuItem 
                    value={''} 
                    sx={{
                      '@media (max-width:530px)': {
                        fontSize: '0.875rem',
                        pt: '4px',
                        pb: '4px',
                        minHeight: '32px'
                      }
                    }}
                  >
                    <em>-</em>
                  </MenuItem>
                  <MenuItem 
                    value={UserRole.Student}
                    sx={{
                      '@media (max-width:530px)': {
                        fontSize: '0.875rem',
                        pt: '4px',
                        pb: '4px',
                        minHeight: '32px'
                      }
                    }}
                  >
                    학생
                  </MenuItem>
                  <MenuItem 
                    value={UserRole.Teacher}
                    sx={{
                      '@media (max-width:530px)': {
                        fontSize: '0.875rem',
                        pt: '4px',
                        pb: '4px',
                        minHeight: '32px'
                      }
                    }}
                  >
                    교사
                  </MenuItem>
                  <MenuItem 
                    value={UserRole.Admin}
                    sx={{
                      '@media (max-width:530px)': {
                        fontSize: '0.875rem',
                        pt: '4px',
                        pb: '4px',
                        minHeight: '32px'
                      }
                    }}
                  >
                    관리자
                  </MenuItem>
                </Select>
              )}
            />
          </Box>
          <Box width={'100%'}>
            <InputLabel 
              sx={{ 
                marginBottom: 1, 
                fontSize: '1rem',
                '@media (max-width:530px)': {
                  fontSize: '0.8rem',
                }
              }}
              required={getRole === UserRole.Student}
            >
              학년
            </InputLabel>
            <Controller
              control={control}
              name='year'
              render={({ field }) => (
                <Select
                  value={field.value}
                  label="학년"
                  onChange={field.onChange}
                  fullWidth
                  error={!!errors.year}
                  sx={{
                    '@media (max-width:530px)': {
                      fontSize: '0.8rem'
                    },
                  }}
                >
                  <MenuItem 
                    value={0}
                    sx={{
                      '@media (max-width:530px)': {
                        fontSize: '0.875rem',
                        pt: '4px',
                        pb: '4px',
                        minHeight: '32px'
                      }
                    }}
                  >
                    <em>-</em>
                  </MenuItem>
                  <MenuItem 
                    value={1}
                    sx={{
                      '@media (max-width:530px)': {
                        fontSize: '0.875rem',
                        pt: '4px',
                        pb: '4px',
                        minHeight: '32px'
                      }
                    }}
                  >
                    1학년
                  </MenuItem>
                  <MenuItem 
                    value={2}
                    sx={{
                      '@media (max-width:530px)': {
                        fontSize: '0.875rem',
                        pt: '4px',
                        pb: '4px',
                        minHeight: '32px'
                      }
                    }}
                  >
                    2학년
                  </MenuItem>
                  <MenuItem 
                    value={3}
                    sx={{
                      '@media (max-width:530px)': {
                        fontSize: '0.875rem',
                        pt: '4px',
                        pb: '4px',
                        minHeight: '32px'
                      }
                    }}
                  >
                    3학년
                  </MenuItem>
                </Select>
              )}
            />
          </Box>
          <Box width={'100%'}>
            <InputLabel 
              sx={{ 
                marginBottom: 1, 
                fontSize: '1rem',
                '@media (max-width:530px)': {
                  fontSize: '0.8rem',
                }
              }}
              required={getRole === UserRole.Student}
            >
              반
            </InputLabel>
            <Controller
              control={control}
              name='class'
              render={({ field }) => (
                <Select
                  value={field.value}
                  label="반"
                  onChange={field.onChange}
                  fullWidth
                  error={!!errors.class}
                  sx={{
                    '@media (max-width:530px)': {
                      fontSize: '0.8rem'
                    },
                  }}
                >
                  <MenuItem 
                    value={''}
                    sx={{
                      '@media (max-width:530px)': {
                        fontSize: '0.875rem',
                        pt: '4px',
                        pb: '4px',
                        minHeight: '32px'
                      }
                    }}
                  >
                    <em>-</em>
                  </MenuItem>
                  <MenuItem 
                    value={'1'}
                    sx={{
                      '@media (max-width:530px)': {
                        fontSize: '0.875rem',
                        pt: '4px',
                        pb: '4px',
                        minHeight: '32px'
                      }
                    }}
                  >
                    1반
                  </MenuItem>
                  <MenuItem 
                    value={'2'}
                    sx={{
                      '@media (max-width:530px)': {
                        fontSize: '0.875rem',
                        pt: '4px',
                        pb: '4px',
                        minHeight: '32px'
                      }
                    }}
                  >
                    2반
                  </MenuItem>
                  <MenuItem 
                    value={'3'}
                    sx={{
                      '@media (max-width:530px)': {
                        fontSize: '0.875rem',
                        pt: '4px',
                        pb: '4px',
                        minHeight: '32px'
                      }
                    }}
                  >
                    3반
                  </MenuItem>
                  <MenuItem 
                    value={'4'}
                    sx={{
                      '@media (max-width:530px)': {
                        fontSize: '0.875rem',
                        pt: '4px',
                        pb: '4px',
                        minHeight: '32px'
                      }
                    }}
                  >
                    4반
                  </MenuItem>
                  <MenuItem 
                    value={'5'}
                    sx={{
                      '@media (max-width:530px)': {
                        fontSize: '0.875rem',
                        pt: '4px',
                        pb: '4px',
                        minHeight: '32px'
                      }
                    }}
                  >
                    5반
                  </MenuItem>
                  <MenuItem 
                    value={'6'}
                    sx={{
                      '@media (max-width:530px)': {
                        fontSize: '0.875rem',
                        pt: '4px',
                        pb: '4px',
                        minHeight: '32px'
                      }
                    }}
                  >
                    6반
                  </MenuItem>
                  <MenuItem 
                    value={'7'}
                    sx={{
                      '@media (max-width:530px)': {
                        fontSize: '0.875rem',
                        pt: '4px',
                        pb: '4px',
                        minHeight: '32px'
                      }
                    }}
                  >
                    7반
                  </MenuItem>
                  <MenuItem 
                    value={'8'}
                    sx={{
                      '@media (max-width:530px)': {
                        fontSize: '0.875rem',
                        pt: '4px',
                        pb: '4px',
                        minHeight: '32px'
                      }
                    }}
                  >
                    8반
                  </MenuItem>
                  <MenuItem 
                    value={'9'}
                    sx={{
                      '@media (max-width:530px)': {
                        fontSize: '0.875rem',
                        pt: '4px',
                        pb: '4px',
                        minHeight: '32px'
                      }
                    }}
                  >
                    9반
                  </MenuItem>
                  <MenuItem 
                    value={'10'}
                    sx={{
                      '@media (max-width:530px)': {
                        fontSize: '0.875rem',
                        pt: '4px',
                        pb: '4px',
                        minHeight: '32px'
                      }
                    }}
                  >
                    10반
                  </MenuItem>
                </Select>
              )}
            />
          </Box>
          {
            getRole === UserRole.Student && 
            <Box width={'100%'}>
              <InputLabel 
                sx={{ 
                  marginBottom: 1, 
                  fontSize: '1rem',
                  '@media (max-width:530px)': {
                    fontSize: '0.8rem',
                  }
                }}
                required={getRole === UserRole.Student}
              >
                번호
              </InputLabel>
              <TextField
                type='number'
                error={!!errors.number}
                slotProps={{
                  htmlInput: {
                    min: 0,
                    sx: {
                      '@media (max-width:530px)': {
                        fontSize: '0.8rem',
                      }
                    },
                  },
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setValue('number', 0)}>
                          <Cancel sx={{ width: '15px', height: '15px' }}/>
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
                value={watch('number')}
                onChange={(e) => setValue('number', parseInt(e.target.value))}
                fullWidth
              />
            </Box>
          }
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
              가입하기
            </Button>
          </Box>
          <Box>
            <Typography 
              variant={'body2'} 
              mt={1} 
              display={'flex'} 
              alignItems={'center'} 
              flexDirection={'row'} 
              fontSize={'0.875rem'}
              sx={{
                '@media (max-width:530px)': {
                  fontSize: '0.75rem',
                }
              }}
            >
              계정이 이미 있으신가요? 
              <Link href={'/signin'} className='link'>
                <Login 
                  sx={{
                    mr: 1,
                    width: '20px',
                    height: '20px',
                    '@media (max-width:530px)': {
                      mr: 0.5,
                      width: '15px',
                      height: '15px',
                    }
                  }}
                />
                로그인
              </Link>
            </Typography>
          </Box>
        </Stack>
      </Stack>
    </form>
  );
}

export default SignUpForm;