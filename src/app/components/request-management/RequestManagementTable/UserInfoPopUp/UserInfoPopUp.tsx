import { RequestorItemsFragment } from "@/app/generated/gql/graphql";
import { AccountBox, Close } from "@mui/icons-material";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Table, TableBody, TableCell, TableRow } from "@mui/material";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction } from "react";

const UserInfoPopUp = ({
  getRequestor,
  setRequestor,
  setOpenUserInfoPopUp,
  openUserInfoPopUp,
} : {
  getRequestor: RequestorItemsFragment | null;
  setRequestor: Dispatch<SetStateAction<RequestorItemsFragment | null>>
  setOpenUserInfoPopUp: (value: boolean) => void;
  openUserInfoPopUp: boolean;
}) => {
  const router = useRouter();
  
  const getRole = () => {
    if (getRequestor?.role === 'STUDENT') {
      return '학생';
    } else if (getRequestor?.role === 'TEACHER') {
      return '교사';
    } else if (getRequestor?.role === 'ADMIN' || getRequestor?.role === 'SUPERADMIN') {
      return '관리자';
    }
    return '';
  }

  const handleClose = (id?: string) => {
    if (id) {
      if (getRequestor?.role === 'STUDENT') {
        router.push(`/students/${id}`);
      } else if (getRequestor?.role === 'TEACHER') {
        router.push(`/teachers/${id}`);
      } else if (getRequestor?.role === 'ADMIN' || getRequestor?.role === 'SUPERADMIN') {
        router.push(`/admins/${id}`);
      }
    }
    setOpenUserInfoPopUp(false);
    setRequestor(null);
  }
  
  return (
    <Dialog
      open={openUserInfoPopUp}
      onClose={() => handleClose()}
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
        <IconButton onClick={() => handleClose()}>
          <Close/>
        </IconButton>
      </Box>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', pt: 0 }}>
        <AccountBox color='info' sx={{ mr: 1, width: '40px', height: '40px' }}/> {`${getRole()} 프로필`}
      </DialogTitle>
      <DialogContent>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell sx={{ minWidth: 70 }} component="th" scope="row">이름</TableCell>
              <TableCell>{getRequestor?.name || ''}</TableCell>
            </TableRow>
            {!!getRequestor?.year && <TableRow>
              <TableCell sx={{ minWidth: 70 }} component="th" scope="row">학년</TableCell>
              <TableCell>{`${getRequestor?.year}학년` || ''}</TableCell>
            </TableRow>}
            {!!getRequestor?.class && <TableRow>
              <TableCell sx={{ minWidth: 70 }} component="th" scope="row">반</TableCell>
              <TableCell>{`${getRequestor?.class}반` || ''}</TableCell>
            </TableRow>}
            {!!getRequestor?.number && <TableRow>
              <TableCell sx={{ minWidth: 70 }} component="th" scope="row">번호</TableCell>
              <TableCell>{`${getRequestor?.number}번` || ''}</TableCell>
            </TableRow>}
            {!!getRequestor?.email && <TableRow>
              <TableCell sx={{ minWidth: 70 }} component="th" scope="row">이메일</TableCell>
              <TableCell sx={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>{getRequestor?.email || ''}</TableCell>
            </TableRow>}
          </TableBody>
        </Table>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={() => handleClose(getRequestor?.id)}>
          {`${getRole()} 페이지로 이동`}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default UserInfoPopUp;