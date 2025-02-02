import { bulkDeleteWordRequestMutation } from "@/app/components/request-management/RequestManagementTable/RequestManagementBulkAction/query";
import ConfirmDialog from "@/app/components/shared/ConfirmDialog";
import { WordStatus } from "@/app/generated/gql/graphql";
import { useSnackbar } from "@/app/hooks/useSnackbar";
import { useMutation } from "@apollo/client";
import { Cancel } from "@mui/icons-material";
import { Box, Button, Stack, Typography } from "@mui/material";
import { useState } from "react";

const MyRequestBulkAction = ({
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

  const [getBulkDeleteLoader, setBulkDeleteLoader] = useState<boolean>(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState<boolean>(false);

  const [bulkDeleteWordRequest] = useMutation(bulkDeleteWordRequestMutation);

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
              message: `총 ${ids.length}개의 요청이 성공적으로 취소되었습니다.`,
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
                startIcon={<Cancel />}
                onClick={() => setOpenConfirmDialog(true)}
                color='error'
                variant='contained'
                loading={getBulkDeleteLoader}
              >
                <Typography variant='subtitle2'>취소</Typography>
              </Button>
            </Box>
          )}
        </Stack>
      </Box>
      <ConfirmDialog
        open={openConfirmDialog}
        handleClose={handleClose}
        title={'주의'}
        content={'정말 취소하시겠습니까? 취소된 요청은 삭제되며 복구할 수 없습니다.'}
      />
    </Box>
  );
}

export default MyRequestBulkAction;