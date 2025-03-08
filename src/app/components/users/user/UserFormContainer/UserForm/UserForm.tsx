import { UserInput, UserRole } from "@/app/generated/gql/graphql";
import { Controller, FieldErrors, SubmitErrorHandler, UseFormReturn } from "react-hook-form";
import { Box, Button, FormControl, Grid2, IconButton, InputAdornment, InputLabel, MenuItem, Select, Stack, TextField } from "@mui/material";
import { Cancel, Edit, HighlightOff, SaveAlt } from "@mui/icons-material";
import { useState } from "react";
import { useMutation } from "@apollo/client";
import { updateUserMutation } from "./query";
import { useSnackbar } from "@/app/hooks/useSnackbar";
import { useSession } from "next-auth/react";

const UserForm = ({
  id,
  editMode,
  setEditMode,
  form,
  setRole,
  refetch,
  defaultValues,
} : {
  id: string;
  editMode: boolean;
  setEditMode: (value: boolean) => void;
  form: UseFormReturn<UserInput>;
  setRole?: (role: UserRole) => void;
  refetch: () => void;
  defaultValues: UserInput;
}) => {
  const { dispatchCurrentSnackBar } = useSnackbar();
  const { data: session } = useSession();

  const [getUpdateLoader, setUpdateLoader] = useState<boolean>(false);

  const [updateUser] = useMutation(updateUserMutation);
  
  const { register, control, watch, setValue, handleSubmit, formState: { errors } } = form;

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
    <Stack spacing={2} >
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
          type='text'
          placeholder="이름을 입력하세요."
          fullWidth
          disabled={!editMode}
          error={!!errors.name}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setValue('name', '')} disabled={!editMode} sx={{ display: editMode ? 'inline-flex' : 'none' }}>
                    <Cancel sx={{ width: '15px', height: '15px' }}/>
                  </IconButton>
                </InputAdornment>
              ),
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
          아이디
        </InputLabel>
        <TextField
          {...register('accountId')}
          type='text'
          placeholder="아이디를 입력하세요."
          fullWidth
          disabled={session?.user.role === 'SUPERADMIN' ? !editMode : !editMode || session?.user.role === 'STUDENT' || session?.user.id !== id}
          error={!!errors.accountId}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setValue('accountId', '')} disabled={session?.user.role === 'SUPERADMIN' ? !editMode : !editMode || session?.user.role === 'STUDENT' || session?.user.id !== id} sx={{ display: editMode ? 'inline-flex' : 'none' }}>
                    <Cancel sx={{ width: '15px', height: '15px' }}/>
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />
      </Box>
      {
        watch('role') !== UserRole.Student &&
        <Box width={'100%'}>
          <InputLabel 
            sx={{ 
              marginBottom: 1, 
              fontSize: '1rem',
              '@media (max-width:530px)': {
                fontSize: '0.8rem',
              }
            }}
            required={watch('role') !== UserRole.Student}
          >
            이메일
          </InputLabel>
          <TextField
            {...register('email')}
            placeholder="이메일을 입력하세요."
            type='text'
            fullWidth
            disabled={!editMode}
            error={!!errors.email}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setValue('name', '')} disabled={!editMode} sx={{ display: editMode ? 'inline-flex' : 'none' }}>
                      <Cancel sx={{ width: '15px', height: '15px' }}/>
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />
        </Box>
      }
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
              fullWidth
              onChange={(e) => {
                field.onChange(e);
                setRole && setRole(e.target.value as UserRole);
              }}
              disabled={!editMode || session?.user.role === 'STUDENT' || session?.user.role === 'TEACHER'}
              error={!!errors.role}
            >
              <MenuItem value={''}><em>-</em></MenuItem>
              <MenuItem value={'STUDENT'}>학생</MenuItem>
              {(session?.user.role === 'SUPERADMIN' || session?.user.role === 'ADMIN' || session?.user.role === 'TEACHER') && <MenuItem value={'TEACHER'}>교사</MenuItem>}
              {(session?.user.role === 'SUPERADMIN' || session?.user.role === 'ADMIN') && <MenuItem value={'ADMIN'}>관리자</MenuItem>}
              {session?.user.role === 'SUPERADMIN' && <MenuItem value={'SUPERADMIN'}>최고 관리자</MenuItem>}
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
          required={watch('role') === 'STUDENT'}
        >
          학년
        </InputLabel>
        <Controller
          control={control}
          name='year'
          render={({ field }) => (
            <Select
              value={field.value}
              onChange={field.onChange}
              disabled={!editMode}
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
          sx={{ 
            marginBottom: 1, 
            fontSize: '1rem',
            '@media (max-width:530px)': {
              fontSize: '0.8rem',
            }
          }}
          required={watch('role') === 'STUDENT'}
        >
          반
        </InputLabel>
        <Controller
          control={control}
          name='class'
          render={({ field }) => (
            <Select
              value={field.value}
              onChange={field.onChange}
              disabled={!editMode}
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
        watch('role') === 'STUDENT' && 
        <Box width={'100%'}>
          <InputLabel 
            sx={{ 
              marginBottom: 1, 
              fontSize: '1rem',
              '@media (max-width:530px)': {
                fontSize: '0.8rem',
              }
            }}
            required={watch('role') === 'STUDENT'}
          >
            번호
          </InputLabel>
          <TextField
            type='number'
            disabled={!editMode}
            error={!!errors.number}
            fullWidth
            slotProps={{
              htmlInput: {
                min: 0
              },
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setValue('number', 0)} disabled={!editMode} sx={{ display: editMode ? 'inline-flex' : 'none' }}>
                      <Cancel sx={{ width: '15px', height: '15px' }}/>
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
            value={watch('number')}
            onChange={(e) => setValue('number', parseInt(e.target.value))}
          />
        </Box>
      }
      {
        !editMode ? (
          <Button variant='outlined' fullWidth onClick={() => setEditMode(true)} startIcon={<Edit/>}>
            수정
          </Button>
        ) : (
          <Grid2 container spacing={1}>
            <Grid2 size={6}>
              <Button 
                variant='outlined' 
                fullWidth 
                onClick={() => {
                  setValue('name', defaultValues.name);
                  setValue('accountId', defaultValues.accountId);
                  setValue('email', defaultValues.email);
                  setValue('year', defaultValues.year);
                  setValue('class', defaultValues.class);
                  setValue('number', defaultValues.number);
                  setValue('role', defaultValues.role);
                  setEditMode(false);
                }} 
                color="error" 
                startIcon={<HighlightOff/>} 
                disabled={getUpdateLoader}
              >
                취소
              </Button>
            </Grid2>
            <Grid2 size={6}>
              <Button variant='outlined' fullWidth startIcon={<SaveAlt/>} onClick={handleSubmit(onUpdateUser, onError)} loading={getUpdateLoader}>
                저장
              </Button>
            </Grid2>
          </Grid2>
        )
      }
    </Stack>
  )
}

export default UserForm;