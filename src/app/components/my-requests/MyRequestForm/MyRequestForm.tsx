import { MyWordRequestItemsFragment, WordInput } from "@/app/generated/gql/graphql";
import { useSnackbar } from "@/app/hooks/useSnackbar";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Divider, IconButton, InputAdornment, Link, List, ListItem, Stack, TextField, Typography } from "@mui/material";
import { FieldErrors, SubmitErrorHandler, useForm } from "react-hook-form";
import { z } from "zod";
import korDicLogo from "../../../../assets/images/korDicLogo.png";
import naverLogo from "../../../../assets/images/naverLogo.png";
import { AddCircle, ArrowRightAlt, Cancel, DeleteForever } from "@mui/icons-material";
import { useState } from "react";
import { useMutation } from "@apollo/client";
import { updateWordRequestMutation } from "./query";

const schema = z.object({
  title: z.string().nonempty(),
  korDicResults: z.array(z.string()),
  naverDicResults: z.array(z.string()),
  pages: z.array(z.union([z.string(), z.number().int(), z.null()])).optional(),
  example: z.union([z.string(), z.null()]).optional(),
  wordId: z.string().optional(),
})
.refine((data) => data.korDicResults.length > 0 || data.naverDicResults.length > 0, {
  message: "국립국어원 사전 또는 네이버 사전의 검색 결과가 필요합니다.",
  path: ["korDicResults"],
});

const MyRequestForm = ({
  defaultValues,
  originalWord,
  refetch,
} : {
  defaultValues: WordInput;
  originalWord: MyWordRequestItemsFragment | null;
  refetch: () => void;
}) => {
  const { dispatchCurrentSnackBar } = useSnackbar();

  const [getKorDic, setKorDic] = useState<string>('');
  const [getNaverDic, setNaverDic] = useState<string>('');
  const [getLoader, setLoader] = useState<boolean>(false);

  const [updateWordRequest] = useMutation(updateWordRequestMutation);
  
  const form = useForm({
    defaultValues: defaultValues,
    resolver: zodResolver(schema),
  });

  const { watch, setValue, handleSubmit, register } = form;

  const mergeExamples = (existingExample: string, newExample: string) => {
    if (!existingExample) {
      return newExample;
    }
    if (existingExample && !newExample) {
      return existingExample;
    }
    return existingExample + '\n' + newExample;
  };

  const handleMerge = () => {
    if (!originalWord) {
      return watch();
    }

    const input: WordInput = {
      pages: [...(originalWord.pages || []).filter(page => page !== null), ...(watch('pages') || []).filter(page => page !== null)],
      title: originalWord.title,
      korDicResults: [...(originalWord.korDicResults || []), ...(watch('korDicResults') || [])],
      naverDicResults: [...(originalWord.naverDicResults || []), ...(watch('naverDicResults') || [])],
      example: mergeExamples(originalWord.example || '', watch().example || ''),
      wordId: originalWord.id,
    }

    return input;
  };
  
  const getErrorMsg = (errors: FieldErrors<WordInput>) => {
    if (errors) {
      return Object.keys(errors)
        .reduce((messages: string[], key) => {
          const index = key as keyof WordInput;
  
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
  
  const onError: SubmitErrorHandler<WordInput> = (errors) => {
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

  const onSubmit = () => {
    setLoader(true);
    updateWordRequest({
      variables: {
        input: {
          ...handleMerge(),
          pages: (handleMerge().pages || []).filter((page) => page > 0),
        },
      },
      onError: async (error) => {
        setLoader(false);
        dispatchCurrentSnackBar({
          payload: {
            open: true,
            type: 'error',
            message: error.message,
          },
        });
      },
      onCompleted: () => {
        setLoader(false);
        refetch();
        dispatchCurrentSnackBar({
          payload: {
            open: true,
            type: 'success',
            message: '단어 요청이 성공적으로 수정되었습니다.',
          },
        });
      },
    });
  };

  const handleAddPageOption = () => {
    const newOption = 0;
    setValue('pages', [
      ...(watch('pages') ?? []),
      newOption,
    ]);
  };

  const getResults = (results: string[], dicType: string, isNew: boolean) => {
    return (
      <Box display={'flex'} flexDirection={'column'} width={'100%'}>
        <List sx={{ width: '100%' }}>
          {
            results.map((item, index) => (
              <ListItem key={index} sx={{ pl: 0, pr: 0, '&.MuiListItem-padding': { pt: 0 } }} dense>
                <Typography variant={'body2'} color={isNew && originalWord? 'success': 'textPrimary'}>
                  {results.length > 1 ? `${index+(originalWord && isNew ? originalWord[dicType === 'koDic' ? 'korDicResults' : 'naverDicResults'] || [] : []).length+1}. ${item}` : item}
                </Typography>
                {
                  isNew &&
                  <IconButton 
                    color='error' 
                    onClick={() => {
                      const newResults = results.filter((_, i) => i !== index);
                      setValue(dicType === 'koDic' ? 'korDicResults' : 'naverDicResults', newResults);
                    }}
                    sx={{ 
                      padding: '8px',
                      fontSize: '1.5rem',
                      '@media (max-width:500px)': {
                        padding: '0 5px',
                        fontSize: '1.125rem',
                      }
                    }}
                  >
                    <DeleteForever 
                      sx={{
                        width: '20px', 
                        height: '20px',
                        '@media (max-width:500px)': {
                          width: '1.25rem', 
                          height: '1.25rem',
                        }
                      }}
                    />
                  </IconButton>
                }
              </ListItem>
            ))
          }
        </List>
        {
          isNew &&
          <Link
            display={'flex'}
            alignItems={'center'}
            mb={1}
            fontSize={'14px'}
            target="_blank"
            href={dicType === 'koDic' ? `https://krdict.korean.go.kr/kor/dicMarinerSearch/search?nationCode=&ParaWordNo=&mainSearchWord=${watch('title')}` : `https://ko.dict.naver.com/#/search?query=${watch('title')}`}
          >
            {dicType === 'koDic' ? '국립국어원 사전으로 이동하기' : '네이버 사전으로 이동하기'}
            <ArrowRightAlt/>
          </Link>
        }
        {
          isNew &&
          <form
            style={{ width: '100%' }}
            onSubmit={(e) => {
              e.preventDefault();
              let newResults = results;
              if (dicType === 'koDic' && getKorDic.length > 0) {
                newResults = [...results, getKorDic];
              } else if (dicType === 'naverDic' && getNaverDic.length > 0) {
                newResults = [...results, getNaverDic];
              }
              setValue(dicType === 'koDic' ? 'korDicResults' : 'naverDicResults', newResults);
              dicType === 'koDic' ? setKorDic('') : setNaverDic('');
            }}
          >
            <Box display={'flex'} flexDirection={'row'} alignItems={'center'}>
              <TextField
                size='small'
                sx={{ width: '100%' }}
                value={dicType === 'koDic' ? getKorDic : getNaverDic}
                onChange={(e) => dicType === 'koDic' ? setKorDic(e.target.value) : setNaverDic(e.target.value)}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => dicType === 'koDic' ? setKorDic('') : setNaverDic('')}>
                          <Cancel sx={{ width: '15px', height: '15px' }}/>
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                  htmlInput: { 
                    sx: { 
                      '@media (max-width:500px)': {
                        fontSize: '0.8rem'
                      }
                    } 
                  },
                }}
              />
              <IconButton 
                type='submit'
                color='primary'
                sx={{ 
                  padding: '8px',
                  fontSize: '1.5rem',
                  '@media (max-width:500px)': {
                    padding: '5px',
                    fontSize: '1.125rem',
                  }
                }}
              >
                <AddCircle 
                  sx={{
                    width: '20px', 
                    height: '20px',
                    '@media (max-width:500px)': {
                      width: '1.25rem', 
                      height: '1.25rem',
                    }
                  }}
                />
              </IconButton>
            </Box>
          </form>
        }
      </Box>
    );
  };

  const getPages = (pages: number[], isNew: boolean) => {
    return (
      <Stack spacing={2}>
        {
          pages.map((page, index) => (
            <Stack spacing={1} direction={'row'} key={index} width={'100%'}>
              <TextField
                label={'추가될 페이지'}
                fullWidth={index > 0}
                type='number'
                value={page}
                disabled={!isNew}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  setValue(`pages.${index}`, value);
                }}
                sx={{
                  width: pages.length > 1 ? 'calc(100% - 64px - 8px)' : '100%',
                }}
                slotProps={{
                  htmlInput: {
                    min: 0,
                    sx: { 
                      '@media (max-width:500px)': {
                        fontSize: '0.8rem'
                      }
                    } 
                  },
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton disabled={!isNew} onClick={() => setValue(`pages.${index}`, 0)}>
                          <Cancel sx={{ width: '15px', height: '15px' }}/>
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
              {
                isNew && index > 0 &&
                <Button
                  color='error'
                  variant="outlined"
                  sx={{ 
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  onClick={() => {
                    watch('pages')?.splice(index, 1);
                    setValue('pages', watch('pages'));
                  }}
                >
                  <DeleteForever/>
                </Button>
              }
            </Stack>
          ))
        }
        {
          isNew &&
          <Button variant='outlined' onClick={handleAddPageOption}>
            페이지 추가
          </Button>
        }
      </Stack>
    );
  };
    
  return (
    <Stack spacing={2} mt={2} mb={2} maxWidth={'700px'}>
      <Typography variant="h5" display={'flex'} justifyContent={'center'}>
        나의 요청
      </Typography>
      <Divider/>
      <Typography variant="body1">
        <b>단어:</b>{' '}{watch('title')}
      </Typography>
      <Divider/>
      <Stack spacing={1}>
        <Stack spacing={1} direction={'row'} alignItems={'center'}>
          <img 
            src={korDicLogo.src}
            style={{ 
              width: '2rem', 
              height: '2rem', 
              background: 'white',
              borderRadius: '50%',
              border: '1px solid #807c7c87',
            }}
          />
          <Typography variant="body1" fontWeight={'bold'}>
            국립국어원
          </Typography>
        </Stack>
        <Box>
          {originalWord && getResults(originalWord.korDicResults ?? [], 'koDic', false)}
          {getResults(watch('korDicResults') ?? [], 'koDic', true)}
        </Box>
      </Stack>
      <Stack spacing={1}>
        <Stack spacing={1} direction={'row'} alignItems={'center'}>
          <img 
            src={naverLogo.src}
            style={{ 
              width: '2rem', 
              height: '2rem', 
            }}
          />
          <Typography variant="body1" fontWeight={'bold'}>
            네이버
          </Typography>
        </Stack>
        <Box>
          {originalWord && getResults(originalWord.naverDicResults ?? [], 'naverDic', false)}
          {getResults(watch('naverDicResults') ?? [], 'naverDic', true)}
        </Box>
      </Stack>
      <Divider/>
      <Stack spacing={2}>
        {
          originalWord &&
          <Typography variant="body1">
            <b>기존 페이지: </b>{' '}{originalWord.pages?.join(', ') || '-'}
          </Typography>
        }
        <Box display={'flex'} flexDirection={'column'}>
          {getPages(watch('pages') ?? [], true)}
        </Box>
      </Stack>
      <Divider/>
      <Stack spacing={2}>
        {
          originalWord &&
          <Stack spacing={0.5} direction={'row'}>
            <Typography variant="body1">
              <b>기존 예문: </b>{' '}{originalWord.example || '-'}
            </Typography>
          </Stack>
        }
        <TextField
          label={'추가될 예문'}
          {...register('example')}
          type='text'
          multiline
          rows={4}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setValue('example', '')}>
                    <Cancel sx={{ width: '15px', height: '15px' }}/>
                  </IconButton>
                </InputAdornment>
              ),
            },
            htmlInput: { 
              sx: {
                '@media (max-width:500px)': {
                  fontSize: '0.8rem'
                }
              },
            },
          }}
        />
      </Stack>
      <Divider/>
      <Box display={'flex'} justifyContent={'center'} sx={{ m: 1, position: 'relative' }}>
        <Button
          variant="contained"
          loading={getLoader}
          onClick={handleSubmit(onSubmit, onError)}
          sx={{ 
            fontSize: '0.875rem',
            '@media (max-width:500px)': {
              fontSize: '0.8rem'
            }
          }}
        >
          수정하기
        </Button>
      </Box>
    </Stack>
  );
}

export default MyRequestForm;