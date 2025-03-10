import { TestVenueInput } from '@/app/generated/gql/graphql';
import { useSnackbar } from '@/app/hooks/useSnackbar';
import { zodResolver } from '@hookform/resolvers/zod';
import { Cancel } from '@mui/icons-material';
import { Box, Button, DialogActions, DialogContent, IconButton, InputAdornment, InputLabel, Stack, TextField } from '@mui/material';
import React from 'react'
import { FieldErrors, SubmitErrorHandler, useForm } from 'react-hook-form';
import { z } from 'zod';

const schema = z.object({
  year: z.union([z.number(), z.string()]).refine(val => !isNaN(Number(val)), {
    message: "학년은 숫자여야 합니다.",
  }),
  class: z.union([z.number(), z.string()]),
  pageFrom: z.union([z.number(), z.string()]).nullable().optional().refine(val => !isNaN(Number(val)), {
    message: "시작 페이지는 숫자여야 합니다.",
  }),
  pageTo: z.union([z.number(), z.string()]).nullable().optional().refine(val => !isNaN(Number(val)), {
    message: "끝 페이지는 숫자여야 합니다.",
  }),
});

const TestVenueForm = ({
  defaultValues,
  getLoader,
  onSubmit,
  type,
} : {
  defaultValues: TestVenueInput;
  getLoader: boolean;
  onSubmit: (value: TestVenueInput) => void;
  type: 'Create' | 'Update';
}) => {
  const { dispatchCurrentSnackBar } = useSnackbar();
  
  const form = useForm({
    defaultValues: defaultValues,
    resolver: zodResolver(schema),
  });

  const getErrorMsg = (errors: FieldErrors<TestVenueInput>) => {
    if (errors) {
      return Object.keys(errors)
        .reduce((messages: string[], key) => {
          const index = key as keyof TestVenueInput;
      
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
      
  const onError: SubmitErrorHandler<TestVenueInput> = (errors) => {
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

  const { register, handleSubmit, setValue, watch, setError } = form;

  const submit = () => {
    const noPageFrom = !watch('pageFrom') || watch('pageFrom') === 0;
    const noPageTo = !watch('pageTo') || watch('pageTo') === 0;

    if ((watch('pageFrom') && watch('pageFrom')! > 0) && noPageTo) {
      dispatchCurrentSnackBar({
        payload: {
          open: true,
          type: 'error',
          message: '시작 페이지와 끝 페이지를 모두 입력하거나 둘 다 입력하지 않아야 합니다.',
        },
      });

      setError('pageTo', {
        message: '시작 페이지와 끝 페이지를 모두 입력하거나 둘 다 입력하지 않아야 합니다.',
      });
      return;
    } else if (noPageFrom && (watch('pageTo') && watch('pageTo')! > 0)) {
      dispatchCurrentSnackBar({
        payload: {
          open: true,
          type: 'error',
          message: '시작 페이지와 끝 페이지를 모두 입력하거나 둘 다 입력하지 않아야 합니다.',
        },
      });

      setError('pageFrom', {
        message: '시작 페이지와 끝 페이지를 모두 입력하거나 둘 다 입력하지 않아야 합니다.',
      });
      return;
    } else {
      handleSubmit(onSubmit, onError)();
    }
  }

  return (
    <>
      <DialogContent>
        <Stack spacing={2}>
          <Box>
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
              학년
            </InputLabel>
            <TextField
              {...register('year')}
              placeholder="학년을 입력하세요."
              type='text'
              fullWidth
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setValue('year', 0)}>
                        <Cancel sx={{ width: '15px', height: '15px' }}/>
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Box>
          <Box>
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
              반
            </InputLabel>
            <TextField
              {...register('class')}
              placeholder="반을 입력하세요."
              type='text'
              fullWidth
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setValue('class', '')}>
                        <Cancel sx={{ width: '15px', height: '15px' }}/>
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Box>
          <Box>
            <InputLabel 
              sx={{ 
                marginBottom: 1, 
                fontSize: '1rem',
                '@media (max-width:530px)': {
                  fontSize: '0.8rem',
                }
              }}
            >
              시작 페이지
            </InputLabel>
            <TextField
              {...register('pageFrom')}
              placeholder="시작 페이지을 입력하세요."
              type='number'
              fullWidth
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setValue('pageFrom', 0)}>
                        <Cancel sx={{ width: '15px', height: '15px' }}/>
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Box>
          <Box>
            <InputLabel 
              sx={{ 
                marginBottom: 1, 
                fontSize: '1rem',
                '@media (max-width:530px)': {
                  fontSize: '0.8rem',
                }
              }}
            >
              끝 페이지
            </InputLabel>
            <TextField
              {...register('pageTo')}
              placeholder="끝 페이지을 입력하세요."
              type='number'
              fullWidth
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setValue('pageTo', 0)}>
                        <Cancel sx={{ width: '15px', height: '15px' }}/>
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ pr: 3, pb: 3 }}>
        <Button variant="contained" onClick={submit} loading={getLoader}>
          {type === 'Create' ? '시험장 생성' : '시험장 수정'}
        </Button>
      </DialogActions>
    </>
    
  );
}

export default TestVenueForm;