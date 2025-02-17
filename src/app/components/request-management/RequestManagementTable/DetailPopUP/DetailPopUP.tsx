import { RequestorItemsFragment, WordRequestItemsFragment, WordStatus } from "@/app/generated/gql/graphql";
import { Close, MenuBook, Remove } from "@mui/icons-material";
import { Box, Chip, Dialog, DialogContent, DialogContentText, DialogTitle, IconButton, Stack } from "@mui/material";
import korDicLogo from "../../../../../assets/images/korDicLogo.png";
import naverLogo from "../../../../../assets/images/naverLogo.png";
import { Dispatch, SetStateAction } from "react";

const DetailPopUP = ({
  openDetailPopUp,
  setOpenDetailPopUp,
  getWordRequest,
  setWordRequest,
  setRequestor,
  setOpenUserInfoPopUp,
} : {
  openDetailPopUp: boolean;
  setOpenDetailPopUp: (value: boolean) => void;
  getWordRequest: WordRequestItemsFragment | null;
  setWordRequest: (value: WordRequestItemsFragment | null) => void;
  setRequestor: Dispatch<SetStateAction<RequestorItemsFragment | null>>;
  setOpenUserInfoPopUp: (value: boolean) => void;
}) => {
  const getRequestor = () => {
    if (getWordRequest?.requestor) {
      return (
          <Chip 
            label={getWordRequest.requestor.name} 
            color="primary" 
            variant="outlined" 
            onClick={() => {
              setRequestor(getWordRequest.requestor);
              setOpenUserInfoPopUp(true);
            }} 
          /> 
      );
    }
    return <></>;
  }

  const handleClose = () => {
    setOpenDetailPopUp(false);
    setWordRequest(null);
  }

  return (
    <>
      <Dialog
        open={openDetailPopUp}
        onClose={() => handleClose()}
        sx={{
          "& .MuiDialog-container": {
            "& .MuiPaper-root": {
              margin: 1,
            },
          },
        }}
      >
        <Box display={'flex'} justifyContent={'flex-end'}>
          <IconButton onClick={() => handleClose()}>
            <Close/>
          </IconButton>
        </Box>
        <Box display={'flex'} flexDirection={'row'} justifyContent={'space-between'} alignItems={'center'} pr={3} mt={'4px'}>
          <DialogTitle sx={{ display: 'flex', alignItems: 'center', pt: 0, pb: 0 }}>
            <MenuBook color='info' sx={{ mr: 1, width: '40px', height: '40px' }}/> {getWordRequest?.title}
          </DialogTitle>
          {getRequestor()}
        </Box>
        <DialogContent>
          <Stack spacing={2} direction={'column'}>
            {
              getWordRequest?.page && 
              <Stack spacing={0.5} direction={'row'}>
                <DialogContentText>
                  <b>페이지: </b>{' '}{getWordRequest.page}
                </DialogContentText>
              </Stack>
            }
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
                    getWordRequest.korDicResults.map((korDicResult, index) => (
                      <DialogContentText key={index}>
                        {index+1}. {korDicResult}
                      </DialogContentText>
                    ))
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
                    getWordRequest.naverDicResults.map((naverDicResult, index) => (
                      <DialogContentText key={index}>
                        {index+1}. {naverDicResult}
                      </DialogContentText>
                    ))
                  }
                </Stack>
              </Stack>
            }
            {
              getWordRequest?.example &&
              <Stack spacing={0.5} direction={'row'}>
                <DialogContentText>
                  <b>예문: </b>{' '}{getWordRequest.example}
                </DialogContentText>
              </Stack>
            }
            {
              getWordRequest?.deniedReason && getWordRequest.status === WordStatus.Denied &&
              <Stack spacing={0.5} direction={'row'}>
                <DialogContentText>
                  <b>거절 사유: </b>{' '}{getWordRequest.deniedReason}
                </DialogContentText>
              </Stack>
            }
          </Stack>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default DetailPopUP; 