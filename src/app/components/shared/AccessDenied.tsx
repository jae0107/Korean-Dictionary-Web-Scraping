import { Box } from '@mui/material';

const AccessDenied = () => {
  return (
    <Box display={'flex'} justifyContent={'center'} alignItems={'center'} height={'calc(100vh - 86.5px)'}>
      접근 권한이 없습니다.
    </Box>
  );
}

export default AccessDenied;