import { Close } from "@mui/icons-material";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography } from "@mui/material";
import Link from "next/link";

const AccountIdPopUp = ({ 
  getAccountId,
  showAccountIdPopUp,
  setShowAccountIdPopUp,
} : { 
  getAccountId: string;
  showAccountIdPopUp: boolean;
  setShowAccountIdPopUp: (value: boolean) => void;
}) => {
  return (
    <Dialog
      open={showAccountIdPopUp}
      onClose={() => setShowAccountIdPopUp(false)}
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
        <IconButton onClick={() => setShowAccountIdPopUp(false)}>
          <Close/>
        </IconButton>
      </Box>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', pt: 0 }}>
        아이디 찾기 결과
      </DialogTitle>
      <DialogContent>
        {`회원님의 아이디는 ${getAccountId} 입니다.`}
      </DialogContent>
      <DialogActions>
        <Button 
          variant="contained" 
          component={Link}
          href={'/signin'}
        >
          로그인 페이지로 이동
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AccountIdPopUp;