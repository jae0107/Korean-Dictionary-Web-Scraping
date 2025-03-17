import { RequestorItemsFragment, WordRequestItemsFragment, WordStatus } from "@/app/generated/gql/graphql";
import { Close, Groups, MenuBook } from "@mui/icons-material";
import { Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Stack } from "@mui/material";
import korDicLogo from "../../../../../assets/images/korDicLogo.png";
import naverLogo from "../../../../../assets/images/naverLogo.png";
import { Dispatch, SetStateAction, useState } from "react";
import RequestorsPopUp from "../RequestorsPopUp/RequestorsPopUp";

const RequestDetailPopUp = ({
  openRequestDetailPopUp,
  getWordRequest,
  setRequestor,
  setOpenUserInfoPopUp,
  handleClose,
  selectedWordId,
  onApproval,
  onRecover,
  setOpenDeniedReasonPopUp,
  setOpenConfirmDialog,
  setSelectedDeniedReason,
  getApprovalLoader,
  getRecoverLoader,
  getDenyLoader,
  getDeniedReasonLoader,
  getDeleteLoader,
} : {
  openRequestDetailPopUp: boolean;
  getWordRequest: WordRequestItemsFragment | null;
  setRequestor?: Dispatch<SetStateAction<RequestorItemsFragment | null>>;
  setOpenUserInfoPopUp?: (value: boolean) => void;
  handleClose: () => void;
  selectedWordId: string;
  onApproval: (id: string) => void;
  onRecover: (id: string) => void;
  setOpenDeniedReasonPopUp: (value: boolean) => void;
  setOpenConfirmDialog: (value: boolean) => void;
  setSelectedDeniedReason: (value: SetStateAction<string>) => void;
  getApprovalLoader: boolean;
  getRecoverLoader: boolean;
  getDenyLoader: boolean;
  getDeniedReasonLoader: boolean;
  getDeleteLoader: boolean;
}) => {
  const [getRequestors, setRequestors] = useState<RequestorItemsFragment[]>([]);
  const [openRequestorsPopUp, setOpenRequestorsPopUp] = useState<boolean>(false);

  const getRequestor = () => {
    if (getWordRequest?.requestors && getWordRequest.requestors.length > 0 && setRequestor && setOpenUserInfoPopUp) {
      if (getWordRequest.requestors.length === 1) {
        return (
          <Chip 
            label={getWordRequest.requestors[0].name} 
            color="primary" 
            variant="outlined" 
            onClick={() => {
              getWordRequest.requestors && getWordRequest.requestors[0] && setRequestor(getWordRequest.requestors[0]);
              setOpenUserInfoPopUp(true);
            }} 
          /> 
        );
      }
      return (
        <IconButton 
          color='primary' 
          sx={{ border: 'solid 1px' }}
          onClick={() => {
            setRequestors(getWordRequest?.requestors || []);
            setOpenRequestorsPopUp(true);
          }}
        >
          <Groups/>
        </IconButton>
      );
    }
    return <></>;
  }

  const getPages = () => {
    if (!getWordRequest || !getWordRequest.pages || getWordRequest.pages?.length === 0) {
      return '-';
    } else if (getWordRequest.pages.length === 1) {
      return getWordRequest.pages[0];
    }
    return `\n${getWordRequest.pages.map((example) => `${example}`).join(', ')}`;
  }

  const getExamples = () => {
    if (!getWordRequest || !getWordRequest.examples || getWordRequest.examples?.length === 0) {
      return '-';
    } else if (getWordRequest.examples.length === 1) {
      return getWordRequest.examples[0];
    }
    return `\n${getWordRequest.examples.map((example, index) => `${index+1}. ${example}`).join('\n')}`;
  }

  return (
    <>
      <Dialog
        open={openRequestDetailPopUp}
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
        <DialogActions>
          {
            getWordRequest?.status === WordStatus.Pending &&
            <Button variant="contained" loading={getApprovalLoader} onClick={() => onApproval(selectedWordId)}>
              승인
            </Button>
          }
          {
            getWordRequest?.status === WordStatus.Denied &&
            <Button variant="contained" color='primary' loading={getRecoverLoader} onClick={() => onRecover(selectedWordId)}>
              복구
            </Button>
          }
          {
            (getWordRequest?.status === WordStatus.Pending || getWordRequest?.status === WordStatus.Approved) &&
            <Button variant="contained" color='error' loading={getDenyLoader} onClick={() => setOpenDeniedReasonPopUp(true)}>
              거절
            </Button>
          }
          {
            getWordRequest?.status === WordStatus.Denied &&
            <Button variant="contained" color='error' loading={getDeleteLoader} onClick={() => setOpenConfirmDialog(true)}>
              삭제
            </Button>
          }
          {
            getWordRequest?.status === WordStatus.Denied &&
            <Button 
              variant="contained" 
              color='inherit' 
              loading={getDeniedReasonLoader}
              onClick={() => {
                setSelectedDeniedReason(getWordRequest.deniedReason || '');
                setOpenDeniedReasonPopUp(true);
              }}
            >
              거절 사유
            </Button>
          }
        </DialogActions>
      </Dialog>
      <RequestorsPopUp
        getRequestors={getRequestors}
        setRequestors={setRequestors}
        openRequestorsPopUp={openRequestorsPopUp}
        setOpenRequestorsPopUp={setOpenRequestorsPopUp}
      />
    </>
  );
}

export default RequestDetailPopUp; 