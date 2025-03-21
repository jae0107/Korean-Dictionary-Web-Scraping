import { WordStatus } from '@/app/generated/gql/graphql';
import { useMutation } from '@apollo/client';
import { CheckCircleOutline, DeleteForever, HighlightOff, Restore } from '@mui/icons-material';
import { Box, Button, Stack, Typography } from '@mui/material';
import { bulkApproveWordRequestMutation, bulkDeleteWordRequestMutation, bulkDenyWordRequestMutation, bulkRecoverWordRequestMutation } from './query';
import { useSnackbar } from '@/app/hooks/useSnackbar';
import { useState } from 'react';
import ConfirmDialog from '@/app/components/shared/ConfirmDialog';

const RequestManagementBulkAction = ({
  ids,
  setSelectedRequests,
  status,
  refetch,
} : {
  ids: string[];
  setSelectedRequests: (value: string[]) => void;
  status: WordStatus;
  refetch: () => void;
}) => {
  const { dispatchCurrentSnackBar } = useSnackbar();

  const [getBulkApprovalLoader, setBulkApprovalLoader] = useState<boolean>(false);
  const [getBulkDenyLoader, setBulkDenyLoader] = useState<boolean>(false);
  const [getBulkDeleteLoader, setBulkDeleteLoader] = useState<boolean>(false);
  const [getBulkRecoverLoader, setBulkRecoverLoader] = useState<boolean>(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState<boolean>(false);
  
  const [bulkApproveWordRequest] = useMutation(bulkApproveWordRequestMutation);
  const [bulkDenyWordRequest] = useMutation(bulkDenyWordRequestMutation);
  const [bulkRecoverWordRequest] = useMutation(bulkRecoverWordRequestMutation);
  const [bulkDeleteWordRequest] = useMutation(bulkDeleteWordRequestMutation);

  const onBulkApproval = () => {
    setBulkApprovalLoader(true);
    bulkApproveWordRequest({
      variables: {
        ids: ids,
      },
      onError: (error) => {
        setBulkApprovalLoader(false);
        dispatchCurrentSnackBar({
          payload: {
            open: true,
            type: 'error',
            message: error.message,
          },
        });
      },
      onCompleted: () => {
        refetch();
        setSelectedRequests([]);
        setBulkApprovalLoader(false);
        dispatchCurrentSnackBar({
          payload: {
            open: true,
            type: 'success',
            message: `총 ${ids.length}개의 요청이 성공적으로 승인되었습니다.`,
          },
        });
      },
    });
  }

  const onBulkDeny = () => {
    setBulkDenyLoader(true);
    bulkDenyWordRequest({
      variables: {
        ids: ids,
      },
      onError: (error) => {
        setBulkDenyLoader(false);
        dispatchCurrentSnackBar({
          payload: {
            open: true,
            type: 'error',
            message: error.message,
          },
        });
      },
      onCompleted: () => {
        refetch();
        setSelectedRequests([]);
        setBulkDenyLoader(false);
        dispatchCurrentSnackBar({
          payload: {
            open: true,
            type: 'success',
            message: `총 ${ids.length}개의 요청이 성공적으로 거절되었습니다.`,
          },
        });
      },
    });
  }

  const onBulkRecover = () => {
    setBulkRecoverLoader(true);
    bulkRecoverWordRequest({
      variables: {
        ids: ids,
      },
      onError: (error) => {
        setBulkRecoverLoader(false);
        dispatchCurrentSnackBar({
          payload: {
            open: true,
            type: 'error',
            message: error.message,
          },
        });
      },
      onCompleted: () => {
        refetch();
        setSelectedRequests([]);
        setBulkRecoverLoader(false);
        dispatchCurrentSnackBar({
          payload: {
            open: true,
            type: 'success',
            message: `총 ${ids.length}개의 요청이 성공적으로 복구되었습니다.`,
          },
        });
      },
    });
  }

  const handleClose = (isConfirm: boolean) => {
    setOpenConfirmDialog(false);
    if (isConfirm) {
      setBulkDeleteLoader(true);
      bulkDeleteWordRequest({
        variables: {
          ids: ids,
        },
        onError: (error) => {
          setBulkDeleteLoader(false);
          dispatchCurrentSnackBar({
            payload: {
              open: true,
              type: 'error',
              message: error.message,
            },
          });
        },
        onCompleted: () => {
          refetch();
          setSelectedRequests([]);
          setBulkDeleteLoader(false);
          dispatchCurrentSnackBar({
            payload: {
              open: true,
              type: 'success',
              message: `총 ${ids.length}개의 요청이 성공적으로 삭제되었습니다.`,
            },
          });
        },
      });
    }
  }

  return (
    <Box height={ids.length > 0 ? '55px' : '0px'} sx={{ backgroundColor: '#081F3E', transition: 'height .3s ease' }}>
      <Box display={'flex'} flexDirection={'row'} justifyContent={'space-between'} alignItems={'center'} padding={1} height={'100%'} ml={1} mr={1}>
        <Typography display={ids.length > 0 ? 'block' : 'none'} style={{ color: 'white' }} variant='subtitle2'>
          {`${ids.length}개 선택됨`}
        </Typography>
        <Stack
          sx={{ border: '#081F3E' }}
          display={ids.length > 0 ? 'flex' : 'none'}
          spacing={1}
          direction={'row'}
        >
          {status === WordStatus.Pending && (
            <Box sx={{ borderRadius: '4px' }}>
              <Button
                startIcon={<CheckCircleOutline />}
                onClick={() => onBulkApproval()}
                color='success'
                variant='contained'
                loading={getBulkApprovalLoader}
              >
                <Typography variant='subtitle2'>승인</Typography>
              </Button>
            </Box>
          )}
          {status !== WordStatus.Denied && (
            <Box sx={{ borderRadius: '4px' }}>
              <Button
                startIcon={<HighlightOff />}
                onClick={() => onBulkDeny()}
                color='error'
                variant='contained'
                loading={getBulkDenyLoader}
              >
                <Typography variant='subtitle2'>거절</Typography>
              </Button>
            </Box>
          )}
          {status === WordStatus.Denied && (
            <Box sx={{ borderRadius: '4px' }}>
              <Button
                startIcon={<Restore />}
                onClick={() => onBulkRecover()}
                color='primary'
                variant='contained'
                loading={getBulkRecoverLoader}
              >
                <Typography variant='subtitle2'>복구</Typography>
              </Button>
            </Box>
          )}
          {status === WordStatus.Denied && (
            <Box sx={{ borderRadius: '4px' }}>
              <Button
                startIcon={<DeleteForever />}
                onClick={() => setOpenConfirmDialog(true)}
                color='error'
                variant='contained'
                loading={getBulkDeleteLoader}
              >
                <Typography variant='subtitle2'>삭제</Typography>
              </Button>
            </Box>
          )}
        </Stack>
      </Box>
      <ConfirmDialog
        open={openConfirmDialog}
        handleClose={handleClose}
        title={'주의'}
        content={'정말 삭제하시겠습니까? 삭제된 데이터는 복구할 수 없습니다.'}
      />
    </Box>
  );
}

export default RequestManagementBulkAction;