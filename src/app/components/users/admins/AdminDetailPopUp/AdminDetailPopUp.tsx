import { AccountBox, Close } from "@mui/icons-material";
import { Box, Button, Dialog, DialogActions, DialogTitle, IconButton, Link } from "@mui/material";
import { UserInfoProps } from "../../UserInfo/type";
import UserInfo from "../../UserInfo/UserInfo";

const AdminDetailPopUp = ({
  openAdminDetailPopUp,
  handleClose,
  user,
  selectedUserId,
  getApprovalLoader,
  getRecoverLoader,
  getDenyLoader,
  getDeleteLoader,
  onApproval,
  onRecover,
  onDeny,
  setOpenConfirmDialog,
  myRole,
} : {
  openAdminDetailPopUp: boolean;
  handleClose: () => void;
  user: UserInfoProps | null;
  selectedUserId: string;
  getApprovalLoader: boolean;
  getRecoverLoader: boolean;
  getDenyLoader: boolean;
  getDeleteLoader: boolean;
  onApproval: (id: string) => void;
  onRecover: (id: string) => void;
  onDeny: (id: string) => void;
  setOpenConfirmDialog: (value: boolean) => void;
  myRole: string | undefined;
}) => {
  const disabled = myRole !== 'SUPERADMIN' && user?.role === 'SUPERADMIN';
  return (
    <Dialog
      open={openAdminDetailPopUp}
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
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', pt: 0, pb: 0 }}>
        <AccountBox color='info' sx={{ mr: 1, width: '40px', height: '40px' }}/> {`${user?.role === 'ADMIN' ? '관리자' : '최고 관리자'} 회원 가입 요청`}
      </DialogTitle>
      {user && <UserInfo user={user}/>}
      <DialogActions>
        {
          user && user.status !== 'DENIED' && 
          <Button variant="contained" color='inherit' component={Link} href={`/admins/${selectedUserId}`} disabled={disabled}>
            프로필 페이지로 이동
          </Button>
        }
        {
          user && user.status === 'PENDING' && 
          <Button variant="contained" color='success' loading={getApprovalLoader} onClick={() => onApproval(selectedUserId)} disabled={disabled}>
            승인
          </Button>
        }
        {
          user && user.status === 'DENIED' &&
          <Button variant="contained" color='primary' loading={getRecoverLoader} onClick={() => onRecover(selectedUserId)} disabled={disabled}>
            복구
          </Button>
        }
        {
          user && (user.status === 'PENDING' || user.status === 'APPROVED') &&
          <Button variant="contained" color='error' loading={getDenyLoader} onClick={() => onDeny(selectedUserId)} disabled={disabled}>
            거절
          </Button>
        }
        {
          user && user.status === 'DENIED' &&
          <Button variant="contained" color='error' loading={getDeleteLoader} onClick={() => setOpenConfirmDialog(true)} disabled={disabled}>
            삭제
          </Button>
        }
      </DialogActions>
    </Dialog>
  );
}

export default AdminDetailPopUp;