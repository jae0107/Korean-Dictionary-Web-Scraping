import { useThemeContext } from "@/app/components/Providers/Providers";
import { UserInput, UserRole } from "@/app/generated/gql/graphql";
import { useSnackbar } from "@/app/hooks/useSnackbar";
import { useMutation } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { PersonAdd } from "@mui/icons-material";
import { Box, Button, InputLabel, MenuItem, Select, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { Controller, FieldErrors, SubmitErrorHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { createUserMutation } from "./query";
import { useRouter } from "next/navigation";

const SignUpForm = () => {
  const theme = useThemeContext();
  const { dispatchCurrentSnackBar } = useSnackbar();
  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(false);
  const [getRole, setRole] = useState<UserRole | null>(null);

  const [createUser] = useMutation(createUserMutation);

  const schema = z.object({
    name: z.string().nonempty({ message: "이름을 작성하십시오." }),
    email: z.string().nonempty({ message: "이메일을 작성하십시오." }).email({ message: "잘못된 이메일 형식입니다." }),
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
      email: '',
      password: '',
      name: '',
      role: UserRole.Student,
      year: 0,
      class: '0',
      number: 0,
    },
    resolver: zodResolver(schema),
  });
  
  const { control, register, handleSubmit, watch, setValue, formState: { errors } } = form;

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
        input: userInput,
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

  return (
    <form onSubmit={handleSubmit(onSubmit, onError)}>
      <Stack spacing={4} width={'500px'} padding={5} borderRadius={2} boxShadow={2} bgcolor={theme && theme.palette.mode === 'dark' ? '#272727' : 'white'}>
        <Stack spacing={2}>
          <Stack spacing={2} direction={'row'} alignItems={'center'}>
            <PersonAdd color='primary' sx={{ width: '40px', height: '40px' }}/>
            <Typography variant="h4">회원가입</Typography>
          </Stack>
          <Box width={'100%'}>
            <InputLabel 
              sx={{ marginBottom: 1 }}
              required
            >
              이메일
            </InputLabel>
            <TextField
              placeholder="이메일을 입력하세요."
              {...register('email')}
              type='email'
              fullWidth
              error={!!errors.email}
            />
          </Box>
          <Box width={'100%'}>
            <InputLabel 
              sx={{ marginBottom: 1 }}
              required
            >
              비밀번호
            </InputLabel>
            <TextField
              placeholder="비밀번호를 입력하세요."
              {...register('password')}
              type='password'
              fullWidth
              error={!!errors.password}
            />
          </Box>
          <Box width={'100%'}>
            <InputLabel 
              sx={{ marginBottom: 1 }}
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
            />
          </Box>
          <Box width={'100%'}>
            <InputLabel 
              sx={{ marginBottom: 1 }}
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
                >
                  <MenuItem value={''}><em>-</em></MenuItem>
                  <MenuItem value={UserRole.Student}>학생</MenuItem>
                  <MenuItem value={UserRole.Teacher}>교사</MenuItem>
                  <MenuItem value={UserRole.Admin}>관리자</MenuItem>
                </Select>
              )}
            />
          </Box>
          <Box width={'100%'}>
            <InputLabel 
              sx={{ marginBottom: 1 }}
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
                >
                  <MenuItem value={0}><em>-</em></MenuItem>
                  <MenuItem value={1}>1학년</MenuItem>
                  <MenuItem value={2}>2학년</MenuItem>
                  <MenuItem value={3}>3학년</MenuItem>
                </Select>
              )}
            />
          </Box>
          <Box width={'100%'}>
            <InputLabel 
              sx={{ marginBottom: 1 }}
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
                >
                  <MenuItem value={'0'}><em>-</em></MenuItem>
                  <MenuItem value={'1'}>1반</MenuItem>
                  <MenuItem value={'2'}>2반</MenuItem>
                  <MenuItem value={'3'}>3반</MenuItem>
                  <MenuItem value={'4'}>4반</MenuItem>
                  <MenuItem value={'5'}>5반</MenuItem>
                  <MenuItem value={'6'}>6반</MenuItem>
                  <MenuItem value={'7'}>7반</MenuItem>
                  <MenuItem value={'8'}>8반</MenuItem>
                  <MenuItem value={'9'}>9반</MenuItem>
                  <MenuItem value={'10'}>10반</MenuItem>
                </Select>
              )}
            />
          </Box>
          {
            getRole === UserRole.Student && 
            <Box width={'100%'}>
              <InputLabel 
                sx={{ marginBottom: 1 }}
                required={getRole === UserRole.Student}
              >
                번호
              </InputLabel>
              <TextField
                type='number'
                error={!!errors.number}
                slotProps={{
                  htmlInput: {
                    min: 0
                  }
                }}
                value={watch('number')}
                onChange={(e) => setValue('number', parseInt(e.target.value))}
                fullWidth
              />
            </Box>
          }
          <Box width={'100%'}>
            <Button fullWidth type='submit' variant="contained" loading={loading} sx={{ mt: 3 }}>
              가입하기
            </Button>
          </Box>
        </Stack>
      </Stack>
    </form>
  );
}

export default SignUpForm;