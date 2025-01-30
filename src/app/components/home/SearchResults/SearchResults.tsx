import { SearchResult } from "@/app/types/types";
import { Box, Button, IconButton, List, ListItem, Stack, TextField, Typography } from "@mui/material";
import korDicLogo from "../../../../assets/images/korDicLogo.png";
import naverLogo from "../../../../assets/images/naverLogo.png";
import { useForm } from "react-hook-form";
import { AddCircle, DeleteForever } from "@mui/icons-material";
import { useState } from "react";

const mock:SearchResult = {
  title: '강아지',
  koDic: ["개의 새끼", "부모나 할아버지 할머니가 자식이나 손주를 귀여워하면서 부르는 말"],
  naverDic: ["개의 새끼", "주로 어린 자식이나 손주를 귀엽게 이르는 말", "자식을 속되게 이르는 말"],
};

const SearchResults = ({
  searchResults,
}:{
  searchResults: SearchResult | null;
}) => {
  const [getKorDic, setKorDic] = useState<string>('');
  const [getNaverDic, setNaverDic] = useState<string>('');

  const form = useForm({
    defaultValues: mock,
  });

  const { watch, setValue } = form;
  
  const getResults = (results: string[], dicType: string) => {
    return (
      <Box display={'flex'} flexDirection={'column'}>
        <List sx={{ width: '100%' }}>
          {
            results.map((item, index) => (
              <ListItem key={index} sx={{ pr: 0, '&.MuiListItem-padding': { pt: 0 } }}>
                <Typography variant={'body2'}>{`${index+1}. ${item}`}</Typography>
                <IconButton 
                  color='error' 
                  onClick={() => {
                    const newResults = results.filter((_, i) => i !== index);
                    setValue(dicType === 'koDic' ? 'koDic' : 'naverDic', newResults);
                  }}
                >
                  <DeleteForever/>
                </IconButton>
              </ListItem>
            ))
          }
        </List>
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
            setValue(dicType === 'koDic' ? 'koDic' : 'naverDic', newResults);
            dicType === 'koDic' ? setKorDic('') : setNaverDic('');
          }}
        >
          <Box display={'flex'} flexDirection={'row'} alignItems={'center'} width={'450px'} ml={2}>
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
          watch('koDic').length > 0 && 
          <Box display={'flex'} flexDirection={'row'}>
            <img src={korDicLogo.src} style={{ width: '50px', height: '50px', background: 'white', borderRadius: '50%', border: '1px solid #807c7c87' }}/>
            {getResults(watch('koDic'), 'koDic')}
          </Box>
        }
        {
          watch('naverDic').length > 0 && 
          <Box display={'flex'} flexDirection={'row'}>
            <img src={naverLogo.src} style={{ width: '50px', height: '50px' }}/>
            {getResults(watch('naverDic'), 'naverDic')}
          </Box>
        }
        <Box display={'flex'} justifyContent={'center'}>
          <Button variant='contained'>추가 요청</Button>
        </Box>
      </Stack>
    </Box>
  );
}

export default SearchResults;