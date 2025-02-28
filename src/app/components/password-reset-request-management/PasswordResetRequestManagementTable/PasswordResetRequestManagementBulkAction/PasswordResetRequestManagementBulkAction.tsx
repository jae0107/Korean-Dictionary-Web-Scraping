import { useMutation } from "@apollo/client";
import { RestartAlt } from "@mui/icons-material";
import { Box, Button, Stack, Typography } from "@mui/material";
import { useState } from "react";
import { bulkPasswordResetMutation } from "./query";
import { useSnackbar } from "@/app/hooks/useSnackbar";

const PasswordResetRequestManagementBulkAction = ({
  ids,
  setSelectedPasswordResetRequests,
  refetch,
} : {
  ids: string[];
  setSelectedPasswordResetRequests: (value: string[]) => void;
  refetch: () => void;
}) => {
  const { dispatchCurrentSnackBar } = useSnackbar();
  
  const [loading, setLoading] = useState<boolean>(false);

  const [bulkPasswordReset] = useMutation(bulkPasswordResetMutation);

  const onBulkSubmit = () => {
    setLoading(true);
    bulkPasswordReset({
      variables: {
        ids: ids,
      },
      onError: (error) => {
        setLoading(false);
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
        setSelectedPasswordResetRequests([]);
        setLoading(false);
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

  return (
    <Box height={ids.length > 0 ? '55px' : '0px'} sx={{ backgroundColor: '#081F3E', transition: 'height .3s ease' }}>
      <Box display={'flex'} flexDirection={'row'} justifyContent={'space-between'} alignItems={'center'} padding={1} height={'100%'} ml={1} mr={1}>
        <Typography display={ids.length > 0 ? 'block' : 'none'} style={{ color: 'white' }} variant='subtitle2'>
          {`${ids.length}개 선택됨`}
        </Typography>
        <Box sx={{ borderRadius: '4px' }}>
          <Button
            startIcon={<RestartAlt />}
            onClick={() => onBulkSubmit()}
            color='success'
            variant='contained'
            loading={loading}
            sx={{
              display: ids.length > 0 ? 'inline-flex' : 'none'
            }}
          >
            <Typography variant='subtitle2'>비밀번호 초기화</Typography>
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default PasswordResetRequestManagementBulkAction;