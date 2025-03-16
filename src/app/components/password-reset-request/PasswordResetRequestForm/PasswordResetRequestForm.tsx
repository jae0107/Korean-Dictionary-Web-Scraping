import { useMutation } from "@apollo/client";
import { Cancel, Login, RestartAlt } from "@mui/icons-material";
import { Box, Button, IconButton, InputAdornment, InputLabel, MenuItem, Select, Stack, TextField, Typography } from "@mui/material";
import { createPasswordResetRequestMutation, sendPasswordResetEmailMutation } from "./query";
import { useSnackbar } from "@/app/hooks/useSnackbar";
import { useThemeContext } from "../../Providers/Providers";
import { Controller, FieldErrors, SubmitErrorHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PasswordResetRequestInput, UserRole } from "@/app/generated/gql/graphql";
import { z } from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import ColourModeSwitch from "../../shared/ColourModeSwitch";
import Link from "next/link";

const PasswordResetRequestForm = () => {
  const theme = useThemeContext();
  const { dispatchCurrentSnackBar } = useSnackbar();
  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(false);
  const [getRole, setRole] = useState<UserRole | null>(UserRole.Student);

  const [createPasswordResetRequest] = useMutation(createPasswordResetRequestMutation); 
  const [sendPasswordResetEmail] = useMutation(sendPasswordResetEmailMutation); 
  
  const schema = z.object({
    name: z.string().nonempty({ message: "이름을 작성하십시오." }),
    email: z.string().optional()
      .refine((email) => {
        if (getRole !== UserRole.Student) {
          if (email === null || email === undefined || email.trim() === "") {
            return false;
          }
        }
        return true;
      },{ message: "이메일을 작성하십시오."})
      .refine((email) => {
        if (getRole !== UserRole.Student && email) {
          if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
            return false;
          }
        }
        return true;
      },{ message: "이메일 형식이 올바르지 않습니다." }),
    accountId: z
      .string()
      .nonempty({ message: "아이디를 작성하십시오." }),
    year: z.number({ message: "학년은 숫자여야 합니다." }).optional()
      .refine((year) => {
        if (getRole === UserRole.Student) {
          if (year === null || year === undefined || year <= 0) {
            return false;
          }
        }
        return true
      },{ message: "학년을 입력하십시오." }),
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
      },{ message: "번호를 입력하십시오." }),
    role: z.nativeEnum(UserRole, { errorMap: () => ({ message: "역할을 작성하십시오." }) }),
  });

  const form = useForm({
    defaultValues: {
      accountId: '',
      email: '',
      name: '',
      role: UserRole.Student,
      year: 0,
      class: '0',
      number: 0,
    },
    resolver: zodResolver(schema),
  });
  
  const { register, handleSubmit, watch, setValue, formState: { errors }, control } = form;

  const getErrorMsg = (errors: FieldErrors<PasswordResetRequestInput>) => {
    if (errors) {
      return Object.keys(errors)
        .reduce((messages: string[], key) => {
          const index = key as keyof PasswordResetRequestInput;
      
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
      
  const onError: SubmitErrorHandler<PasswordResetRequestInput> = (errors) => {
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
  
  const onSubmit = async (input: PasswordResetRequestInput) => {
    setLoading(true);
    if (input.role === UserRole.Student) {
      createPasswordResetRequest({
        variables: {
          input: input.role === UserRole.Student ? {
            name: input.name,
            accountId: input.accountId,
            year: input.year,
            class: input.class,
            number: input.number,
            role: input.role,
          } : {
            name: input.name,
            email: input.email,
            accountId: input.accountId,
            role: input.role,
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
              message: '비밀번호 재설정 요청이 성공적으로 제출되었습니다.',
            },
          });
          router.push('/signin');
        },
      });
    } else {
      sendPasswordResetEmail({
        variables: {
          input: {
            name: input.name,
            email: input.email,
            accountId: input.accountId,
            role: input.role,
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
              message: '비밀번호 재설정 이메일이 성공적으로 전송되었습니다.',
            },
          });
          router.push('/signin');
        },
      });
    }
  };
  
  return (
    <form 
      onSubmit={handleSubmit(onSubmit, onError)} 
      style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        width: '100%',
        marginTop: '50px',
        marginBottom: '50px',
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
        <Stack spacing={2}>
          <Box display={'flex'} flexDirection={'row'} justifyContent={'space-between'} alignItems={'center'}>
            <Stack spacing={2} direction={'row'} alignItems={'center'}>
              <RestartAlt 
                color='primary' 
                sx={{ 
                  width: '40px', 
                  height: '40px',
                  '@media (max-width:500px)': {
                    width: '35px',
                    height: '35px',
                  },
                  '@media (max-width:410px)': {
                    width: '30px',
                    height: '30px',
                  },
                  '@media (max-width:360px)': {
                    width: '25px',
                    height: '25px',
                  }
                }}
              />
              <Typography 
                variant={'h5'}
                sx={{
                  '@media (max-width:410px)': {
                    fontSize: '1.2rem',
                    fontWeight: 400,
                  },
                  '@media (max-width:360px)': {
                    fontSize: '1rem',
                    fontWeight: 400,
                  }
                }}
              >
                비밀번호 재설정 요청
              </Typography>
            </Stack>
            <ColourModeSwitch/>
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
                    선생님
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
                  <MenuItem 
                    value={UserRole.Superadmin}
                    sx={{
                      '@media (max-width:530px)': {
                        fontSize: '0.875rem',
                        pt: '4px',
                        pb: '4px',
                        minHeight: '32px'
                      }
                    }}
                  >
                    최고 관리자
                  </MenuItem>
                </Select>
              )}
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
          {
            getRole !== UserRole.Student &&
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
                이메일
              </InputLabel>
              <TextField
                {...register('email')}
                placeholder="이메일을 입력하세요."
                type='text'
                fullWidth
                error={!!errors.email}
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
          }
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
          }
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
                      value={'0'}
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
          }
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
              비밀번호 재설정 요청
            </Button>
          </Box>
        </Stack>
        <Typography 
          variant={'body2'} 
          fontSize={'0.875rem'}
          sx={{
            '@media (max-width:530px)': {
              fontSize: '0.75rem',
            }
          }}
        >
          <Link href={'/signin'} className='link' style={{ display: 'flex', alignItems: 'center' }}>
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
            로그인 페이지로 이동
          </Link>
        </Typography>
      </Stack>
    </form>
  );
}

export default PasswordResetRequestForm;