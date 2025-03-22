import { MyWordRequestItemsFragment, WordInput } from "@/app/generated/gql/graphql";
import { useSnackbar } from "@/app/hooks/useSnackbar";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, DialogContentText, Divider, IconButton, InputAdornment, Link, List, ListItem, Stack, TextField, Typography } from "@mui/material";
import { FieldErrors, SubmitErrorHandler, useForm } from "react-hook-form";
import { z } from "zod";
import korDicLogo from "../../../../assets/images/korDicLogo.png";
import naverLogo from "../../../../assets/images/naverLogo.png";
import { AddCircle, ArrowRightAlt, Cancel, DeleteForever } from "@mui/icons-material";
import { useState } from "react";
import { useMutation } from "@apollo/client";
import { updateWordRequestMutation } from "./query";
import { checkDuplicate } from "../../shared/utils/utils";

const schema = (getExistingWord: MyWordRequestItemsFragment | null) => {
  return z.object({
    title: z.string().nonempty(),
    korDicResults: z.array(z.string()),
    naverDicResults: z.array(z.string()),
    pages: z.array(z.union([z.string(), z.number().int(), z.null()])).optional(),
    examples: z.array(z.union([z.string(), z.null()])).optional(),
    wordId: z.string().optional(),
  })
  .refine((data) => (getExistingWord?.korDicResults || []).length > 0 || (getExistingWord?.naverDicResults || []).length > 0 || data.korDicResults.length > 0 || data.naverDicResults.length > 0, {
    message: "국립국어원 사전 또는 네이버 사전의 검색 결과가 필요합니다.",
    path: ["korDicResults"],
  });
}

const MyRequestForm = ({
  id,
  defaultValues,
  originalWord,
  refetch,
} : {
  id: string;
  defaultValues: WordInput;
  originalWord: MyWordRequestItemsFragment | null;
  refetch: () => void;
}) => {
  const { dispatchCurrentSnackBar } = useSnackbar();

  const [getKorDic, setKorDic] = useState<string>('');
  const [getNaverDic, setNaverDic] = useState<string>('');
  const [getLoader, setLoader] = useState<boolean>(false);
  const [getExistingWord, setExistingWord] = useState<MyWordRequestItemsFragment | null>(originalWord);

  const [updateWordRequest] = useMutation(updateWordRequestMutation);
  
  const form = useForm({
    defaultValues: defaultValues,
    resolver: zodResolver(schema(getExistingWord)),
  });

  const { watch, setValue, handleSubmit, register } = form;

  const mergeExamples = (existingExamples: string[], newExamples: string[]) => {
    if (!existingExamples || existingExamples.length === 0) {
      return newExamples;
    }
    if (existingExamples && existingExamples.length > 0 && (!newExamples || newExamples.length === 0)) {
      return existingExamples;
    }
    return [...existingExamples, ...newExamples];
  };

  const handleMerge = () => {
    if (!getExistingWord) {
      return watch();
    }

    const input: WordInput = {
      pages: [...(getExistingWord.pages || []).filter((page) => page !== null), ...(watch('pages') || []).filter((page) => page !== null)],
      title: getExistingWord.title,
      korDicResults: [...(getExistingWord.korDicResults || []), ...(watch('korDicResults') || [])],
      naverDicResults: [...(getExistingWord.naverDicResults || []), ...(watch('naverDicResults') || [])],
      examples: mergeExamples(getExistingWord.examples || [], watch('examples') || []),
      wordId: getExistingWord.id,
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

  const onBeforeSubmit = () => {
    if (originalWord) {
      const existingInput: WordInput = {
        pages: (originalWord.pages || []).filter((page): page is number => page !== null && page > 0),
        korDicResults: originalWord.korDicResults || [],
        naverDicResults: originalWord.naverDicResults || [],
        examples: originalWord.examples || [],
      };
  
      const newInput: WordInput = {
        ...watch(),
        pages: (watch('pages') || []).filter((page) => page > 0),
        examples: (watch('examples') || []).filter((example) => example.trim() !== ''),
      };
  
      const errors = checkDuplicate(existingInput, newInput);
        
      if (errors.length > 0) {
        dispatchCurrentSnackBar({
          payload: {
            open: true,
            type: 'error',
            message: errors.join('\n'),
          },
        });
        return;
      }
    }
    handleSubmit(onSubmit, onError)();
  };

  const onSubmit = () => {
    setLoader(true);
    updateWordRequest({
      variables: {
        updateWordRequestId: id,
        input: {
          ...handleMerge(),
          pages: (handleMerge().pages || []).filter((page) => page > 0).map((page) => Number(page)),
          examples: (handleMerge().examples || []).filter((example) => example.trim() !== ''),
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

  const handleAddExampleOption = () => {
    const newOption = '';
    setValue('examples', [
      ...(watch('examples') ?? []),
      newOption,
    ]);
  };

  const getResults = (results: string[], dicType: string, isNew: boolean) => {
    return (
      <Box display={'flex'} flexDirection={'column'} width={'100%'}>
        <List sx={{ width: '100%', padding: 0 }}>
          {
            results.map((item, index) => (
              <ListItem key={index} sx={{ pl: 0, pr: 0, '&.MuiListItem-padding': { pt: 0 } }} dense>
                <Typography variant={'body2'} color={isNew && getExistingWord? 'success': 'textPrimary'}>
                  • {item}
                </Typography>
                {
                  <IconButton 
                    color='error' 
                    onClick={() => {
                      const newResults = results.filter((_, i) => i !== index);
                      if (isNew) {
                        setValue(dicType === 'koDic' ? 'korDicResults' : 'naverDicResults', newResults)
                      } else if (getExistingWord) {
                        let tmp = getExistingWord;
                        if (dicType === 'koDic') {
                          tmp = {
                            ...getExistingWord,
                            korDicResults: newResults,
                          };
                        } else {
                          tmp = {
                            ...getExistingWord,
                            naverDicResults: newResults,
                          };
                        }

                        setExistingWord(tmp);
                      }
                    }}
                    sx={{ 
                      padding: '4px',
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

  const getPages = (pages: number[]) => {
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
                        <IconButton onClick={() => setValue(`pages.${index}`, 0)}>
                          <Cancel sx={{ width: '15px', height: '15px' }}/>
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
              {
                index > 0 &&
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
        <Button variant='outlined' onClick={handleAddPageOption}>
          페이지 추가
        </Button>
      </Stack>
    );
  };

  const getExistingPages = (pages: number[]) => {
      return (
        pages.map((page, index) => 
          <DialogContentText key={index} display={'flex'} alignItems={'center'}>
            • {page}
            <IconButton 
              color='error' 
              onClick={() => {
                const newResults = pages.filter((_, i) => i !== index);
                if (getExistingWord) {
                  const tmp = {
                    ...getExistingWord,
                    pages: newResults,
                  }
                  setExistingWord(tmp);
                }
              }}
              sx={{ 
                padding: '4px',
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
          </DialogContentText>
        )
      );
    };
  
    const getExistingExamples = (examples: string[]) => {
      return (
        examples.map((example, index) => 
          <DialogContentText key={index} display={'flex'} alignItems={'center'}>
            • {example}
            <IconButton 
              color='error' 
              onClick={() => {
                const newResults = examples.filter((_, i) => i !== index);
                if (getExistingWord) {
                  const tmp = {
                    ...getExistingWord,
                    examples: newResults,
                  }
                  setExistingWord(tmp);
                }
              }}
              sx={{ 
                padding: '4px',
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
          </DialogContentText>
        )
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
          {getExistingWord && getResults(getExistingWord.korDicResults ?? [], 'koDic', false)}
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
          {getExistingWord && getResults(getExistingWord.naverDicResults ?? [], 'naverDic', false)}
          {getResults(watch('naverDicResults') ?? [], 'naverDic', true)}
        </Box>
      </Stack>
      <Divider/>
      <Stack spacing={2}>
        <Stack spacing={0.5}>
          <Typography variant="body1">
            <b>기존 페이지: </b>{' '}{!getExistingWord ||(getExistingWord && getExistingWord.pages?.length === 0) && '-'}
          </Typography>
          {getExistingPages((getExistingWord?.pages || []).filter((page): page is number => page !== null))}
        </Stack>
        <Box display={'flex'} flexDirection={'column'}>
          {getPages(watch('pages') ?? [])}
        </Box>
      </Stack>
      <Divider/>
      <Stack spacing={2}>
        <Stack spacing={0.5}>
          <DialogContentText>
            <b>기존 예문: </b>{' '}{!getExistingWord ||(getExistingWord && getExistingWord.examples?.length === 0) && '-'}
          </DialogContentText>
          {getExistingExamples(getExistingWord?.examples || [])}
        </Stack>
        {
          watch('examples') && (watch('examples') || []).length > 0 && 
          <Stack spacing={2}>
            {(watch('examples') || []).map((example, i) => (
              <TextField
                key={i}
                label={'추가될 예문'}
                {...register(`examples.${i}`)}
                type='text'
                multiline
                rows={4}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setValue('examples', [])}>
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
            ))}
          </Stack>
        }
        <Button variant='outlined' onClick={handleAddExampleOption}>
          예문 추가
        </Button>
      </Stack>
      <Divider/>
      <Box display={'flex'} justifyContent={'center'} sx={{ m: 1, position: 'relative' }}>
        <Button
          variant="contained"
          loading={getLoader}
          onClick={onBeforeSubmit}
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