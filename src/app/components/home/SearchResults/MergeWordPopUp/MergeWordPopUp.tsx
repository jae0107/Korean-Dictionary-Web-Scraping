import { WordByTitleItemsFragment, WordInput } from "@/app/generated/gql/graphql";
import { AddCircle, ArrowRightAlt, Cancel, Close, DeleteForever, MenuBook } from "@mui/icons-material";
import { Box, Button, Dialog, DialogContent, DialogContentText, DialogTitle, Divider, IconButton, InputAdornment, Link, List, ListItem, Stack, TextField, Typography } from "@mui/material";
import { FieldErrors, SubmitErrorHandler, UseFormReturn } from "react-hook-form";
import korDicLogo from "../../../../../assets/images/korDicLogo.png";
import naverLogo from "../../../../../assets/images/naverLogo.png";
import { useState } from "react";
import { useSnackbar } from "@/app/hooks/useSnackbar";
import { useMutation } from "@apollo/client";
import { duplicateWordRequestMutation } from "./query";

const MergeWordPopUp = ({
  openMergeWordPopUp,
  setOpenMergeWordPopUp,
  existingWord,
  loading,
  form,
  getLoader,
  setLoader,
} : {
  openMergeWordPopUp: boolean;
  setOpenMergeWordPopUp: (value: boolean) => void;
  existingWord: WordByTitleItemsFragment | null;
  loading: boolean;
  form: UseFormReturn<WordInput>;
  getLoader: boolean;
  setLoader: (value: boolean) => void;
}) => {
  const { dispatchCurrentSnackBar } = useSnackbar();
  
  const [getKorDic, setKorDic] = useState<string>('');
  const [getNaverDic, setNaverDic] = useState<string>('');

  const [duplicateWordRequest] = useMutation(duplicateWordRequestMutation);

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
    if (!existingWord) {
      return watch();
    }

    const input: WordInput = {
      pages: [...(existingWord.pages || []).filter(page => page !== null), ...(watch('pages') || []).filter(page => page !== null)],
      title: existingWord.title,
      korDicResults: [...(existingWord.korDicResults || []), ...(watch('korDicResults') || [])],
      naverDicResults: [...(existingWord.naverDicResults || []), ...(watch('naverDicResults') || [])],
      example: mergeExamples(existingWord.example || '', watch('example') || ''),
      wordId: existingWord.id,
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
    duplicateWordRequest({
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
        setOpenMergeWordPopUp(false);
        dispatchCurrentSnackBar({
          payload: {
            open: true,
            type: 'success',
            message: '단어 추가 요청이 성공적으로 제출되었습니다.',
          },
        });
      },
    });
  };

  const getResults = (results: string[], dicType: string, isNew: boolean) => {
    return (
      <Box display={'flex'} flexDirection={'column'} width={'100%'}>
        <List sx={{ width: '100%', pt: 0, pb: 0 }}>
          {
            results.map((item, index) => (
              <ListItem key={index} sx={{ pl: 0, pr: 0, '&.MuiListItem-padding': { pt: 0 } }} dense>
                <Typography variant={'body2'} color={isNew? 'success': 'textPrimary'}>
                  {results.length > 1 ? `${index+(existingWord && isNew ? existingWord[dicType === 'koDic' ? 'korDicResults' : 'naverDicResults'] || [] : []).length+1}. ${item}` : item}
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
                      padding: '0 8px',
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

  const handleAddPageOption = () => {
    const newOption = 0;
    setValue('pages', [
      ...(watch('pages') ?? []),
      newOption,
    ]);
  };

  const getPages = (pages: number[], isNew: boolean) => {
    return (
      <Stack spacing={1}>
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
    <Dialog
      open={openMergeWordPopUp}
      onClose={() => setOpenMergeWordPopUp(false)}
      sx={{
        '@media (max-width: 750px)': {
          '& .MuiDialog-container': {
            '& .MuiPaper-root': {
               margin: 1,
            }
          }
        },
      }}
    >
      <Box display={'flex'} justifyContent={'flex-end'}>
        <IconButton onClick={() => setOpenMergeWordPopUp(false)}>
          <Close/>
        </IconButton>
      </Box>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', pt: 0, pb: 2 }}>
        <MenuBook color='info' sx={{ mr: 1, width: '40px', height: '40px' }}/> {existingWord?.title}
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
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
              <DialogContentText fontWeight={'bold'}>
                국립국어원
              </DialogContentText>
            </Stack>
            <Box>
              {getResults(existingWord?.korDicResults ?? [], 'koDic', false)}
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
              <DialogContentText fontWeight={'bold'}>
                네이버
              </DialogContentText>
            </Stack>
            <Box>
              {getResults(existingWord?.naverDicResults ?? [], 'naverDic', false)}
              {getResults(watch('naverDicResults') ?? [], 'naverDic', true)}
            </Box>
          </Stack>
          <Divider/>
          <Stack spacing={2}>
            <DialogContentText>
              <b>기존 페이지: </b>{' '}{existingWord ? existingWord.pages?.join(', ') || '-' : '-'}
            </DialogContentText>
            <Box display={'flex'} flexDirection={'column'}>
              {getPages(watch('pages') ?? [], true)}
            </Box>
          </Stack>
          <Divider/>
          <Stack spacing={2}>
            <Stack spacing={0.5} direction={'row'}>
              <DialogContentText>
                <b>기존 예문: </b>{' '}{existingWord ? existingWord.example || '-' : '-'}
              </DialogContentText>
            </Stack>
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
              추가 요청
            </Button>
          </Box>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}

export default MergeWordPopUp;