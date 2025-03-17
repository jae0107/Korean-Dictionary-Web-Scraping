import { WordByTitleItemsFragment, WordInput } from "@/app/generated/gql/graphql";
import { AddCircle, ArrowRightAlt, Cancel, Close, DeleteForever, MenuBook } from "@mui/icons-material";
import { Box, Button, Dialog, DialogContent, DialogContentText, DialogTitle, Divider, IconButton, InputAdornment, Link, List, ListItem, Skeleton, Stack, TextField, Typography } from "@mui/material";
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
  setExistingWord,
  loading,
  form,
  getLoader,
  setLoader,
} : {
  openMergeWordPopUp: boolean;
  setOpenMergeWordPopUp: (value: boolean) => void;
  existingWord: WordByTitleItemsFragment | null;
  setExistingWord: (value: WordByTitleItemsFragment | null) => void;
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
    if (!existingWord) {
      return watch();
    }

    const input: WordInput = {
      pages: [...(existingWord.pages || []).filter(page => page !== null), ...(watch('pages') || []).filter(page => page !== null)],
      title: existingWord.title,
      korDicResults: [...(existingWord.korDicResults || []), ...(watch('korDicResults') || [])],
      naverDicResults: [...(existingWord.naverDicResults || []), ...(watch('naverDicResults') || [])],
      examples: mergeExamples(existingWord.examples || [], watch('examples') || []),
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
                  • {item}
                </Typography>
                {
                  <IconButton 
                    color='error' 
                    onClick={() => {
                      const newResults = results.filter((_, i) => i !== index);
                      if (isNew) {
                        setValue(dicType === 'koDic' ? 'korDicResults' : 'naverDicResults', newResults)
                      } else if (existingWord) {
                        let tmp = existingWord;
                        if (dicType === 'koDic') {
                          tmp = {
                            ...existingWord,
                            korDicResults: newResults,
                          };
                        } else {
                          tmp = {
                            ...existingWord,
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

  const getPages = (pages: number[]) => {
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
              if (existingWord) {
                const tmp = {
                  ...existingWord,
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
              if (existingWord) {
                const tmp = {
                  ...existingWord,
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
        <MenuBook color='info' sx={{ mr: 1, width: '40px', height: '40px' }}/>
        {
          loading ?
          <Skeleton variant="rounded" width={110} height={35}/> :
          existingWord?.title
        }
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          <Stack spacing={1}>
            <Stack spacing={1} direction={'row'} alignItems={'center'}>
              {
                loading ?
                <Skeleton 
                  variant="circular" 
                  width={'2rem'} 
                  height={'2rem'}
                /> :
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
              }
              {
                loading ?
                <Skeleton 
                  variant="rounded" 
                  width={70} 
                  height={24} 
                /> :
                <DialogContentText fontWeight={'bold'}>
                  국립국어원
                </DialogContentText>
              }
            </Stack>
            <Box>
              {
                loading ?
                <Stack spacing={'4px'}>
                  <Skeleton variant="rounded" width={260} height={20}/>
                  <Skeleton variant="rounded" width={260} height={20}/>
                  <Skeleton variant="rounded" width={260} height={20}/>
                  <Skeleton variant="rounded" width={260} height={20}/>
                </Stack> :
                <>
                  {getResults(existingWord?.korDicResults ?? [], 'koDic', false)}
                  {getResults(watch('korDicResults') ?? [], 'koDic', true)}
                </>
              }
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
              {
                loading ?
                <Stack spacing={'4px'}>
                  <Skeleton variant="rounded" width={260} height={20}/>
                  <Skeleton variant="rounded" width={260} height={20}/>
                  <Skeleton variant="rounded" width={260} height={20}/>
                  <Skeleton variant="rounded" width={260} height={20}/>
                </Stack> :
                <>
                  {getResults(existingWord?.naverDicResults ?? [], 'naverDic', false)}
                  {getResults(watch('naverDicResults') ?? [], 'naverDic', true)}
                </>
              }
            </Box>
          </Stack>
          <Divider/>
          <Stack spacing={2}>
            <Stack spacing={0.5}>
              <DialogContentText>
                {
                  loading ?
                  <Skeleton variant="rounded" width={80} height={24}/> :
                  <>
                    <b>기존 페이지: </b>{' '}{!existingWord || (existingWord && existingWord.pages?.length === 0) && '-'}
                  </>
                }
              </DialogContentText>
              {
                loading ?
                <Stack spacing={2}>
                  <Skeleton variant="rounded" width={110} height={28}/>
                </Stack> :
                <>
                  {getExistingPages((existingWord?.pages || []).filter((page): page is number => page !== null))}
                </>
              }
            </Stack>
            <Box display={'flex'} flexDirection={'column'}>
              {
                loading ?
                <Stack spacing={1}>
                  <Skeleton variant="rounded" width={409} height={56}/>
                  <Skeleton variant="rounded" width={409} height={36.5}/>
                </Stack> :
                <>
                  {getPages(watch('pages') ?? [])}
                </>
              }
            </Box>
          </Stack>
          <Divider/>
          <Stack spacing={2}>
            <Stack spacing={0.5}>
              <DialogContentText>
                {
                  loading ?
                  <Skeleton variant="rounded" width={70} height={24}/> :
                  <>
                    <b>기존 예문: </b>{' '}{!existingWord ||(existingWord && existingWord.examples?.length === 0) && '-'}
                  </>
                }
              </DialogContentText>
              {
                loading ?
                <>
                  <Skeleton variant="rounded" width={409} height={27}/>
                  <Skeleton variant="rounded" width={409} height={27}/>
                </> :
                <>
                  {getExistingExamples(existingWord?.examples || [])}
                </>
              }
            </Stack>
            {
              loading && <Skeleton variant="rounded" width={409} height={125}/>
            }
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
            {
              loading ?
              <Skeleton variant="rounded" width={409} height={36.5}/> :
              <Button variant='outlined' onClick={handleAddExampleOption}>
                예문 추가
              </Button>
            }
          </Stack>
          <Divider/>
          <Box display={'flex'} justifyContent={'center'} sx={{ m: 1, position: 'relative' }}>
            {
              loading ?
              <Skeleton variant="rounded" width={86} height={36.5}/> :
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
            }
          </Box>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}

export default MergeWordPopUp;