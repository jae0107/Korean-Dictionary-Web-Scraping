import { SearchResult } from "@/app/types/types";
import { Box, Button, CircularProgress, IconButton, Link, List, ListItem, Stack, TextField, Typography } from "@mui/material";
import korDicLogo from "../../../../assets/images/korDicLogo.png";
import naverLogo from "../../../../assets/images/naverLogo.png";
import { FieldErrors, SubmitErrorHandler, useForm } from "react-hook-form";
import { AddCircle, ArrowRightAlt, DeleteForever } from "@mui/icons-material";
import { useState } from "react";
import { useMutation } from "@apollo/client";
import { createWordRequestMutation } from "./query";
import { WordInput } from "@/app/generated/gql/graphql";
import { useSnackbar } from "@/app/hooks/useSnackbar";
import { z } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";

const mock:SearchResult = {
  title: '강아지',
  koDic: ["개의 새끼", "부모나 할아버지 할머니가 자식이나 손주를 귀여워하면서 부르는 말"],
  naverDic: ["개의 새끼", "주로 어린 자식이나 손주를 귀엽게 이르는 말", "자식을 속되게 이르는 말"],
};

const schema = z.object({
  title: z.string().nonempty(),
  korDicResults: z.array(z.string()),
  naverDicResults: z.array(z.string()),
  page: z.union([z.string(), z.number().int(), z.null()]).optional(),
  example: z.union([z.string(), z.null()]).optional(),
})
.refine((data) => data.korDicResults.length > 0 || data.naverDicResults.length > 0, {
  message: "국립국어원 사전 또는 네이버 사전의 검색 결과가 필요합니다.",
  path: ["korDicResults"],
});

const SearchResults = ({
  searchResults,
}:{
  searchResults: SearchResult;
}) => {
  const { dispatchCurrentSnackBar } = useSnackbar();
  
  const [getKorDic, setKorDic] = useState<string>('');
  const [getNaverDic, setNaverDic] = useState<string>('');
  const [getLoader, setLoader] = useState<boolean>(false);

  const [createWordRequest] = useMutation(createWordRequestMutation);

  const form = useForm<WordInput>({
    defaultValues: {
      title: searchResults.title,
      korDicResults: searchResults.koDic,
      naverDicResults: searchResults.naverDic,
      page: null,
      example: '',
    },
    resolver: zodResolver(schema),
  });

  const { watch, setValue, handleSubmit, register } = form;

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
  
  const onSubmit = (word: WordInput) => {
    setLoader(true);
    createWordRequest({
      variables: {
        input: word,
      },
      onError: (error) => {
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
        dispatchCurrentSnackBar({
          payload: {
            open: true,
            type: 'success',
            message: '단어 추가 요청이 성공적으로 제출되었습니다.',
          },
        });
      },
    });
  }
  
  const getResults = (results: string[], dicType: string) => {
    return (
      <Box display={'flex'} flexDirection={'column'} width={'100%'}>
        <List sx={{ width: '100%' }}>
          {
            results.map((item, index) => (
              <ListItem key={index} sx={{ pr: 0, '&.MuiListItem-padding': { pt: 0 } }}>
                <Typography variant={'body2'}>
                  {results.length > 1 ? `${index+1}. ${item}` : item}
                </Typography>
                <IconButton 
                  color='error' 
                  onClick={() => {
                    const newResults = results.filter((_, i) => i !== index);
                    setValue(dicType === 'koDic' ? 'korDicResults' : 'naverDicResults', newResults);
                  }}
                >
                  <DeleteForever/>
                </IconButton>
              </ListItem>
            ))
          }
        </List>
        <Link
          display={'flex'}
          alignItems={'center'}
          ml={2}
          mb={2}
          fontSize={'14px'}
          target="_blank"
          href={dicType === 'koDic' ? `https://krdict.korean.go.kr/kor/dicMarinerSearch/search?nationCode=&ParaWordNo=&mainSearchWord=${watch('title')}` : `https://ko.dict.naver.com/#/search?query=${watch('title')}`}
        >
          {dicType === 'koDic' ? '국립국어원 사전으로 이동하기' : '네이버 사전으로 이동하기'}
          <ArrowRightAlt/>
        </Link>
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
          <Box display={'flex'} flexDirection={'row'} alignItems={'center'} ml={2}>
            <TextField
              size='small'
              sx={{ width: '100%' }}
              value={dicType === 'koDic' ? getKorDic : getNaverDic}
              onChange={(e) => dicType === 'koDic' ? setKorDic(e.target.value) : setNaverDic(e.target.value)}
            />
            <IconButton 
              type='submit'
              color='primary'
            >
              <AddCircle/>
            </IconButton>
          </Box>
        </form>
      </Box>
    );
  }

  return (
    <Box display={'flex'} alignItems={'center'} justifyContent={'center'} width={'100%'}>
      <Stack spacing={2} maxWidth={'700px'}>
        <Typography variant={'h5'} ml={'66px !important'}>{watch('title')}</Typography>
        {
          (watch('korDicResults') ?? []).length > 0 && 
          <Box display={'flex'} flexDirection={'row'}>
            <img src={korDicLogo.src} style={{ width: '50px', height: '50px', background: 'white', borderRadius: '50%', border: '1px solid #807c7c87' }}/>
            {getResults(watch('korDicResults') ?? [], 'koDic')}
          </Box>
        }
        {
          (watch('naverDicResults') ?? []).length > 0 && 
          <Box display={'flex'} flexDirection={'row'}>
            <img src={naverLogo.src} style={{ width: '50px', height: '50px' }}/>
            {getResults(watch('naverDicResults') ?? [], 'naverDic')}
          </Box>
        }
        <TextField
          label={'페이지'}
          {...register('page')}
          type='number'
          slotProps={{
            htmlInput: {
              min: 0
            }
          }}
        />
        <TextField
          label={'예문'}
          {...register('example')}
          type='text'
          multiline
          rows={4}
        />
        <Box display={'flex'} justifyContent={'center'} sx={{ m: 1, position: 'relative' }}>
        <Button
          variant="contained"
          disabled={getLoader}
          onClick={handleSubmit(onSubmit, onError)}
        >
          추가 요청
        </Button>
        {getLoader && (
          <CircularProgress
            size={24}
            color="success"
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              marginTop: '-12px',
              marginLeft: '-12px',
            }}
          />
        )}
      </Box>
      </Stack>
    </Box>
  );
}

export default SearchResults;