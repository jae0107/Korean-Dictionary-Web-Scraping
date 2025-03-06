import { RequestorItemsFragment, WordRequestItemsFragment } from "@/app/generated/gql/graphql";
import { useMutation, useQuery } from "@apollo/client";
import { Dispatch, SetStateAction, useState } from "react";
import { approveDuplicatedWordRequestMutation, getWordQuery } from "./query";
import { useSnackbar } from "@/app/hooks/useSnackbar";
import { Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, IconButton, List, ListItem, Skeleton, Stack, Typography } from "@mui/material";
import { Close, Groups, MenuBook } from "@mui/icons-material";
import RequestorsPopUp from "../RequestorsPopUp/RequestorsPopUp";
import korDicLogo from "../../../../../assets/images/korDicLogo.png";
import naverLogo from "../../../../../assets/images/naverLogo.png";

const DuplicatedRequestPopUp = ({
  openDuplicatedRequestPopUp,
  getWordRequest,
  handleClose,
  selectedReferenceWordId,
  getApprovalLoader,
  setApprovalLoader,
  setOpenDeniedReasonPopUp,
  getDenyLoader,
  setOpenUserInfoPopUp,
  setRequestor,
  refetch,
  noActions,
} : {
  openDuplicatedRequestPopUp: boolean,
  getWordRequest: WordRequestItemsFragment;
  handleClose: () => void;
  selectedReferenceWordId: string;
  getApprovalLoader?: boolean;
  setApprovalLoader?: Dispatch<SetStateAction<{
    [key: string]: boolean;
  }>>;
  setOpenDeniedReasonPopUp?: (value: boolean) => void;
  getDenyLoader?: boolean;
  setOpenUserInfoPopUp?: (value: boolean) => void;
  setRequestor?: Dispatch<SetStateAction<RequestorItemsFragment | null>>;
  refetch?: () => void;
  noActions?: boolean;
}) => {
  const { dispatchCurrentSnackBar } = useSnackbar();

  const [getRequestors, setRequestors] = useState<RequestorItemsFragment[]>([]);
  const [openRequestorsPopUp, setOpenRequestorsPopUp] = useState<boolean>(false);

  const [approveDuplicatedWordRequest] = useMutation(approveDuplicatedWordRequestMutation);
  
  const { data, loading } =
    useQuery(getWordQuery, {
      fetchPolicy: 'network-only',
      variables: {
        getWordId: selectedReferenceWordId,
      },
      onError: (error) => {
        dispatchCurrentSnackBar({
          payload: {
            open: true,
            type: 'error',
            message: error.message,
          },
        });
      },
    });

  const onDuplicatedApproval = (id: string) => {
    if (setApprovalLoader) {
      setApprovalLoader({[id]: true});
      approveDuplicatedWordRequest({
        variables: {
          approveDuplicatedWordRequestId: id,
        },
        onError: (error) => {
          setApprovalLoader({[id]: false});
          dispatchCurrentSnackBar({
            payload: {
              open: true,
              type: 'error',
              message: error.message,
            },
          });
        },
        onCompleted: () => {
          refetch && refetch();
          handleClose();
          setApprovalLoader({[id]: false});
          dispatchCurrentSnackBar({
            payload: {
              open: true,
              type: 'success',
              message: '성공적으로 승인되었습니다.',
            },
          });
        },
      });
    }
  };
  
  const getRequestor = () => {
    if (getWordRequest.requestors && getWordRequest.requestors.length > 0 && setRequestor && setOpenUserInfoPopUp) {
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
            setRequestors(getWordRequest.requestors || []);
            setOpenRequestorsPopUp(true);
          }}
        >
          <Groups/>
        </IconButton>
      );
    }
    return <></>;
  }

  const newKorDicResults = (getWordRequest.korDicResults || []).filter((item, index) => {
    return !data?.getWord?.korDicResults?.some((existingItem, existingIndex) => 
      existingItem === item && existingIndex === index
    );
  });
  
  const newNaverDicResults = (getWordRequest.naverDicResults || []).filter((item, index) => {
    return !data?.getWord?.naverDicResults?.some((existingItem, existingIndex) => 
      existingItem === item && existingIndex === index
    );
  });

  const newPages = (getWordRequest.pages || []).filter((item, index) => {
    return !data?.getWord?.pages?.some((existingItem, existingIndex) =>
      existingItem === item && existingIndex === index
    );
  });

  const newExamples = (getWordRequest.examples || []).filter(example => !(data?.getWord.examples || []).includes(example));
  
  const getResults = (results: string[], dicType: string, isNew: boolean) => {
    return (
      <Box display={'flex'} flexDirection={'column'} width={'100%'}>
        <List sx={{ width: '100%', pt: 0, pb: 0 }}>
          {
            results.map((item, index) => (
              <ListItem key={index} sx={{ pl: 0, pr: 0, '&.MuiListItem-padding': { pt: 0 } }} dense>
                <Typography variant={'body2'} color={isNew? 'success': 'textPrimary'}>
                  {results.length > 1 ? `${index+(data && data.getWord && isNew ? data.getWord[dicType === 'koDic' ? 'korDicResults' : 'naverDicResults'] || [] : []).length+1}. ${item}` : item}
                </Typography>
              </ListItem>
            ))
          }
        </List>
      </Box>
    );
  };

  const getExample = () => {
    if (data?.getWord?.examples?.length === 0 && newExamples.length === 0) {
      return (
        <Stack spacing={0.5} direction={'row'}>
          <DialogContentText>
            <b>예문: </b>
          </DialogContentText>
          <DialogContentText>-</DialogContentText>
        </Stack>
      );
    } else if (data?.getWord?.examples?.length === 0 && newExamples.length > 0) {
      return (
        <Stack spacing={0.5} direction={'row'}>
          <DialogContentText>
            <b>예문: </b>
          </DialogContentText>
          <DialogContentText color="success">
            {newExamples.length === 1 ? newExamples[0] : newExamples.map((example, index) => `• ${example}`).join('\n')}
          </DialogContentText>
        </Stack>
      );
    } else if (data && data.getWord && data.getWord.examples && data.getWord.examples.length > 0 && newExamples.length === 0) {
      return (
        <Stack spacing={0.5} direction={'row'}>
          <DialogContentText>
            <b>예문: </b>
          </DialogContentText>
          <DialogContentText>
            {data.getWord.examples.length === 1 ? data.getWord.examples[0] : data.getWord.examples.map((example, index) => `• ${example}`).join('\n')}
          </DialogContentText>
        </Stack>
      );
    } else if (data && data.getWord && data.getWord.examples && data.getWord.examples.length > 0 && newExamples.length > 0) {
      return (
        <Stack spacing={0.5}>
          <DialogContentText>
            <b>예문: </b>
          </DialogContentText>
          <DialogContentText whiteSpace={'pre-line'}>
            {data.getWord.examples.map((example, index) => `• ${example}`).join('\n')}
          </DialogContentText>
          <DialogContentText color="success" whiteSpace={'pre-line'}>
            {newExamples.map((example, index) => `• ${example}`).join('\n')}
          </DialogContentText>
        </Stack>
      );
    }
    return (
      <Stack spacing={0.5} direction={'row'} display={'flex'} alignItems={'center'}>
        <Box display={'flex'} alignItems={'center'} flexDirection={'row'}>
          <Skeleton variant="rounded" width={34} height={19}/>
          <b>:</b>
        </Box>
        <Skeleton variant="rounded" width={'70%'} height={24}/>
      </Stack>
    );
  };
      
  return (
    <>
      <Dialog
        open={openDuplicatedRequestPopUp}
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
            <MenuBook color='info' sx={{ mr: 1, width: '40px', height: '40px' }}/> 
            {
              loading ?
              <Skeleton variant="rounded" width={110} height={35}/> :
              getWordRequest.title
            }
          </DialogTitle>
          {
            loading ?
            <Skeleton 
              variant="circular" 
              width={42} 
              height={42}
            /> :
            getRequestor()
          }
        </Box>
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
                    {getResults(data?.getWord?.korDicResults ?? [], 'koDic', false)}
                    {getResults(newKorDicResults, 'koDic', true)}
                  </>
                }
              </Box>
            </Stack>
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
                    src={naverLogo.src}
                    style={{ 
                      width: '2rem', 
                      height: '2rem', 
                    }}
                  />
                }
                {
                  loading ?
                  <Skeleton 
                    variant="rounded" 
                    width={42} 
                    height={24} 
                  /> :
                  <DialogContentText fontWeight={'bold'}>
                    네이버
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
                    {getResults(data?.getWord?.naverDicResults ?? [], 'naverDic', false)}
                    {getResults(newNaverDicResults, 'naverDic', true)}
                  </>
                }
              </Box>
            </Stack>
            <Divider/>
            <Stack spacing={0.5} direction={'row'}>
              <DialogContentText display={'flex'} alignItems={'center'}>
                {
                  loading ?
                  <Box display={'flex'} alignItems={'center'} flexDirection={'row'}>
                    <Skeleton variant="rounded" width={48} height={19}/><b>:</b>
                  </Box> :
                  <b>페이지: </b>
                }
              </DialogContentText>
              {
                loading ?
                <Stack spacing={0.5} direction={'row'}>
                  <Skeleton variant="rounded" width={31} height={24}/>,
                  <Skeleton variant="rounded" width={31} height={24}/>
                </Stack> :
                <>
                  {
                    data?.getWord?.pages?.length === 0 && newPages.length === 0 && <DialogContentText>-</DialogContentText>
                  }
                  {
                    data && data.getWord && data.getWord.pages && data.getWord.pages.length > 0 &&
                    <DialogContentText>
                      {data.getWord.pages.join(', ')}{ newPages.length > 0 && ', ' }
                    </DialogContentText>
                  }
                  {
                    newPages.length > 0 &&
                    <DialogContentText color="success">
                      {newPages.join(', ')}
                    </DialogContentText>
                  }
                </>
              }
            </Stack>
            <Divider/>
            {getExample()}
          </Stack>
        </DialogContent>
        <Divider/>
        {
          !noActions &&
          <DialogActions>
            {
              loading ?
              <Skeleton variant="rounded" width={64} height={36.5}/> :
              <Button variant="contained" loading={getApprovalLoader} onClick={() => onDuplicatedApproval(getWordRequest.id || '')}>
                승인
              </Button>
            }
            {
              loading ?
              <Skeleton variant="rounded" width={64} height={36.5}/> :
              <Button variant="contained" color='error' loading={getDenyLoader} onClick={() => setOpenDeniedReasonPopUp && setOpenDeniedReasonPopUp(true)}>
                거절
              </Button>
            }
          </DialogActions>
        }
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

export default DuplicatedRequestPopUp;