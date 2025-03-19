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

  const getDifference = <T extends string | number>(existingArr: T[], newArr: T[]) => {
    const countElements = (arr: T[]): Record<T, number> =>
      arr.reduce((acc, value) => {
        acc[value] = (acc[value] || 0) + 1;
        return acc;
      }, {} as Record<T, number>);
  
    const count1 = countElements(existingArr);
    const count2 = countElements(newArr);
  
    const deletedArr: T[] = Object.keys(count1)
      .flatMap((key) =>
        Array(Math.max(count1[key as T] - (count2[key as T] || 0), 0)).fill(key as T)
      );
  
    const addedArr: T[] = Object.keys(count2)
      .flatMap((key) =>
        Array(Math.max(count2[key as T] - (count1[key as T] || 0), 0)).fill(key as T)
      );
  
    const remainingArr: T[] = Object.keys(count1)
      .filter((key) => count2[key as T])
      .flatMap((key) =>
        Array(Math.min(count1[key as T], count2[key as T])).fill(key as T)
      );
  
    return { deletedArr, remainingArr, addedArr };
  };

  const { deletedArr: deletedKorDicResults, remainingArr: remainingKorDicResults, addedArr: addedKorDicResults } = getDifference(
    data?.getWord?.korDicResults || [],
    getWordRequest.korDicResults || []
  );

  const { deletedArr: deletedNaverDicResults, remainingArr: remainingNaverDicResults, addedArr: addedNaverDicResults } = getDifference(
    data?.getWord?.naverDicResults || [],
    getWordRequest.naverDicResults || []
  );

  const { deletedArr: deletedPages, remainingArr: remainingPages, addedArr: addedPages } = getDifference(
    (data?.getWord?.pages || []).filter((page): page is number => page !== null),
    (getWordRequest.pages || []).filter((page): page is number => page !== null)
  );

  const { deletedArr: deletedExamples, remainingArr: remainingExamples, addedArr: addedExamples } = getDifference(
    data?.getWord?.examples || [],
    getWordRequest.examples || []
  );

  const getColour = (status: 'NEW' | 'DELETED' | 'REMAINING') => {
    switch (status) {
      case 'NEW':
        return 'success';
      case 'DELETED':
        return 'error';
      case 'REMAINING':
        return 'textPrimary';
      default:
        return 'textPrimary';
    }
  };
  
  const getResults = (results: string[] | number[], status: 'NEW' | 'DELETED' | 'REMAINING') => {
    return (
      <Box display={'flex'} flexDirection={'column'} width={'100%'}>
        <List sx={{ width: '100%', pt: 0, pb: 0 }}>
          {
            results.map((item, index) => (
              <ListItem key={index} sx={{ pl: 0, pr: 0, '&.MuiListItem-padding': { pt: 0 } }} dense>
                <Typography variant={'body2'} color={getColour(status)}>
                  • {item}
                </Typography>
              </ListItem>
            ))
          }
        </List>
      </Box>
    );
  };

  const getExample = () => {
    const filteredAddedExamples = addedExamples.filter((example) => example.trim() !== '');

    if (loading) {
      return (
        <Stack spacing={0.5} direction={'row'} display={'flex'} alignItems={'center'}>
          <Box display={'flex'} alignItems={'center'} flexDirection={'row'}>
            <Skeleton variant="rounded" width={34} height={19}/>
            <b>:</b>
          </Box>
          <Skeleton variant="rounded" width={'70%'} height={24}/>
        </Stack>
      );
    } else if (deletedExamples.length === 0 && remainingExamples.length === 0 && filteredAddedExamples.length === 0) {
      return (
        <Stack spacing={0.5} direction={'row'}>
          <DialogContentText>
            <b>예문: </b>
          </DialogContentText>
          <DialogContentText>-</DialogContentText>
        </Stack>
      );
    } else if (remainingExamples.length > 0 || deletedExamples.length > 0 || filteredAddedExamples.length > 0) {
      return (
        <Stack spacing={0.5}>
          <DialogContentText>
            <b>예문: </b>
          </DialogContentText>
          <Box>
            {getResults(remainingExamples, 'REMAINING')}
            {getResults(deletedExamples, 'DELETED')}
            {getResults(filteredAddedExamples, 'NEW')}
          </Box>
        </Stack>
      );
    }

    return <></>;
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
                    {getResults(remainingKorDicResults, 'REMAINING')}
                    {getResults(deletedKorDicResults, 'DELETED')}
                    {getResults(addedKorDicResults, 'NEW')}
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
                    {getResults(remainingNaverDicResults, 'REMAINING')}
                    {getResults(deletedNaverDicResults, 'DELETED')}
                    {getResults(addedNaverDicResults, 'NEW')}
                  </>
                }
              </Box>
            </Stack>
            <Divider/>
            <Stack spacing={0.5} direction={'row'}>
              <DialogContentText display={'flex'} alignItems={'center'}>
                {
                  loading ?
                  <>
                    <Skeleton variant="rounded" width={48} height={19}/><b>:</b>
                  </> :
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
                    remainingPages.length > 0 &&
                    <DialogContentText>
                      {remainingPages.join(', ')}{ (deletedPages.length > 0 || addedPages.length > 0) && ', ' }
                    </DialogContentText>
                  }
                  {
                    deletedPages.length > 0 &&
                    <DialogContentText color="error">
                      {deletedPages.join(', ')}{ addedPages.length > 0 && ', ' }
                    </DialogContentText>
                  }
                  {
                    addedPages.length > 0 &&
                    <DialogContentText color="success">
                      {addedPages.join(', ')}
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