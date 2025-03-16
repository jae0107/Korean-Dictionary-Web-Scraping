import { MiniTestItemsFragment } from '@/app/generated/gql/graphql';
import { Close } from '@mui/icons-material';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, IconButton, List, ListItem, Stack, Typography } from '@mui/material';
import korDicLogo from "../../../../../assets/images/korDicLogo.png";
import naverLogo from "../../../../../assets/images/naverLogo.png";
import { useMutation } from '@apollo/client';
import { bulkAddMyVocabularyMutation } from './query';
import { useState } from 'react';
import { useSnackbar } from '@/app/hooks/useSnackbar';
import ConfirmDialog from '@/app/components/shared/ConfirmDialog';
import { useRouter } from 'next/navigation';

const FeedbackPopUp = ({
  openFeedback,
  setOpenFeedback,
  score,
  getWrongWords,
  numOfTests,
  isReal,
} : {
  openFeedback: boolean;
  setOpenFeedback: (value: boolean) => void;
  score: number;
  getWrongWords: MiniTestItemsFragment[];
  numOfTests: number;
  isReal: boolean;
}) => {
  const { dispatchCurrentSnackBar } = useSnackbar();
  const router = useRouter();
  
  const [getLoader, setLoader] = useState<boolean>(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState<boolean>(false);
  
  const [bulkAddMyVocabulary] = useMutation(bulkAddMyVocabularyMutation);

  const onSubmit = () => {
    setLoader(true);
    bulkAddMyVocabulary({
      variables: {
        wordIds: getWrongWords.map((test) => test.id),
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
        dispatchCurrentSnackBar({
          payload: {
            open: true,
            type: 'success',
            message: '틀린 단어가 단어장에 추가되었습니다.',
          },
        });
      },
    });
  };

  const getResults = (results: string[] | number[]) => {
    return (
      <Box display={'flex'} flexDirection={'column'} width={'100%'}>
        <List sx={{ width: '100%', pt: 0, pb: 0 }}>
          {
            results.map((item, index) => (
              <ListItem key={index} sx={{ pl: 0, pr: 0, '&.MuiListItem-padding': { pt: 0 } }} dense>
                <Typography variant={'body2'}>
                  • {item}
                </Typography>
              </ListItem>
            ))
          }
        </List>
      </Box>
    );
  };

  const handleClose = (isConfirm: boolean) => {
    if (isConfirm) {
      setOpenConfirmDialog(false);
      setOpenFeedback(false);
      isReal ? router.push('/test-venues') : router.push('/');
    } else {
      setOpenConfirmDialog(false);
    }
  };

  return (
    <>
      <ConfirmDialog
        open={openConfirmDialog}
        handleClose={handleClose}
        title={'주의'}
        content={`정말 닫으시겠습니까? 닫으시면 ${isReal ? '테스트 목록' : '홈'} 페이지로 이동하며, 피드백을 다시 확인할 수 없습니다.`}
      />
      <Dialog
        open={openFeedback}
        onClose={() => setOpenConfirmDialog(true)}
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
          <IconButton onClick={() => setOpenConfirmDialog(true)}>
            <Close/>
          </IconButton>
        </Box>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', pt: 0, pb: 2 }}>
          모의 테스트 결과
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            <DialogContentText>
              {`점수: ${score}/${numOfTests}`}
            </DialogContentText>
            <Divider/>
            {
              getWrongWords.map((test, index) => (
                <Stack spacing={2} key={index}>
                  <Stack spacing={1}>
                    <DialogContentText>
                      <b>단어:</b>{` ${test.correctAnswer}`}
                    </DialogContentText>
                  </Stack>
                  {
                    test.korDicResults && test.korDicResults.length > 0 &&
                    <>
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
                        {getResults(test.korDicResults)}
                      </Box>
                    </>
                  }
                  {
                    test.naverDicResults && test.naverDicResults.length > 0 &&
                    <>
                      <Stack spacing={1} direction={'row'} alignItems={'center'}>
                        <img 
                          src={naverLogo.src}
                          style={{ 
                            width: '2rem', 
                            height: '2rem', 
                            background: 'white',
                            borderRadius: '50%',
                            border: '1px solid #807c7c87',
                          }}
                        />
                        <DialogContentText fontWeight={'bold'}>
                          네이버
                        </DialogContentText>
                      </Stack>
                      <Box>
                        {getResults(test.naverDicResults)}
                      </Box>
                    </>
                  }
                  <Divider/>
                </Stack>
              ))
            }
          </Stack>
        </DialogContent>
        {
          getWrongWords.length > 0 &&
          <DialogActions sx={{ pr: 3, pb: 3 }}>
            <Button variant="contained" onClick={onSubmit} loading={getLoader}>
              단어장에 추가
            </Button>
          </DialogActions>
          }
      </Dialog>
    </>
  );
}

export default FeedbackPopUp;