import { WordByTitleItemsFragment, WordStatus } from "@/app/generated/gql/graphql";
import { Close, ErrorOutline, MenuBook } from "@mui/icons-material";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Stack, Typography } from "@mui/material";
import korDicLogo from "../../../../assets/images/korDicLogo.png";
import naverLogo from "../../../../assets/images/naverLogo.png";

const ExistingWordPopup = ({
  openExistingWordPopup,
  getWordRequest,
  handleClose,
} : {
  openExistingWordPopup: boolean;
  getWordRequest: WordByTitleItemsFragment;
  handleClose: (edit: boolean) => void;
}) => {
  const getPages = () => {
    if (!getWordRequest.pages || getWordRequest.pages?.length === 0) {
      return '-';
    } else if (getWordRequest.pages.length === 1) {
      return getWordRequest.pages[0];
    }
    return `\n${getWordRequest.pages.map((example) => `${example}`).join(', ')}`;
  }

  const getExamples = () => {
    if (!getWordRequest) {
      return '-';
    }

    const filteredExamples = (getWordRequest.examples || []).filter((example) => example.trim() !== '');
    if (filteredExamples.length === 0) {
      return '-';
    } else if (filteredExamples.length === 1) {
      return filteredExamples[0];
    }
    return `\n${filteredExamples.map((example, index) => `${index+1}. ${example}`).join('\n')}`;
  }

  return (
    <Dialog
      open={openExistingWordPopup}
      onClose={() => handleClose(false)}
      sx={{
        "& .MuiDialog-container": {
          "& .MuiPaper-root": {
            margin: 1,
          },
        },
      }}
    >
      <Box display={'flex'} justifyContent={'flex-end'}>
        <IconButton onClick={() => handleClose(false)}>
          <Close/>
        </IconButton>
      </Box>
      <Box display={'flex'} flexDirection={'row'} justifyContent={'space-between'} alignItems={'center'} pr={3} mt={'4px'}>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', pt: 0, pb: 0 }}>
          <ErrorOutline color='warning' sx={{ mr: 1 }}/>{`이미 ${getWordRequest.status === WordStatus.Approved ? '등록돤' : '신청 대기중인'} 단어입니다.`} 
        </DialogTitle>
      </Box>
      <DialogContent>
        <Stack spacing={2} direction={'column'}>
          <Stack spacing={0.5} direction={'row'}>
            <DialogContentText>
              <b>단어: </b>{getWordRequest?.title}
            </DialogContentText>
          </Stack>
          <Stack spacing={0.5} direction={'row'}>
            <DialogContentText>
              <b>페이지: </b>{getPages()}
            </DialogContentText>
          </Stack>
          {
            getWordRequest?.korDicResults && getWordRequest.korDicResults.length > 0 &&
            <Stack spacing={1} direction={'column'}>
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
              <Stack spacing={1} direction={'column'}>
                {
                  getWordRequest.korDicResults.map((korDicResult, index) => {
                    if (getWordRequest.korDicResults?.length === 1) {
                      return (
                        <DialogContentText key={index}>
                          {korDicResult}
                        </DialogContentText>
                      );
                    }
                    return (
                      <DialogContentText key={index}>
                        {`${index+1}. ${korDicResult}`}
                      </DialogContentText>
                    );
                  })
                }
              </Stack>
            </Stack>
          }
          {
            getWordRequest?.naverDicResults && getWordRequest.naverDicResults.length > 0 &&
            <Stack spacing={1} direction={'column'}>
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
              <Stack spacing={1} direction={'column'}>
                {
                  getWordRequest.naverDicResults.map((naverDicResult, index) => {
                    if (getWordRequest.naverDicResults?.length === 1) {
                      return (
                        <DialogContentText key={index}>
                          {naverDicResult}
                        </DialogContentText>
                      );
                    }
                    return (
                      <DialogContentText key={index}>
                        {`${index+1}. ${naverDicResult}`}
                      </DialogContentText>
                    );
                  })
                }
              </Stack>
            </Stack>
          }
          <Stack spacing={0.5} direction={'row'}>
            <DialogContentText whiteSpace={'pre-line'}>
              <b>예문: </b>{' '}{getExamples()}
            </DialogContentText>
            </Stack>
        </Stack>
      </DialogContent>
      <DialogActions
        sx={{
          '@media (max-width:365px)': {
            flexDirection: 'column',
          }
        }}
      > 
        <Typography variant={'body1'} color={'textPrimary'}>
          수정하여 요청하시겠습니까?
        </Typography>
        <Stack 
          spacing={1} 
          direction={'row'}
          sx={{
            '@media (max-width:365px)': {
              mt: 1,
              width: '100%',
              mr: 1,
            }
          }}
        >
          <Button 
            variant='contained' 
            color='success' 
            onClick={() => handleClose(true)}
            sx={{
              '@media (max-width:365px)': {
                flex: 1,
              }
            }}
          >
            예
          </Button>
          <Button 
            variant='contained' 
            color='error' 
            onClick={() => handleClose(false)}
            sx={{
              '@media (max-width:365px)': {
                flex: 1,
              }
            }}
          >
            아니요
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}

export default ExistingWordPopup;