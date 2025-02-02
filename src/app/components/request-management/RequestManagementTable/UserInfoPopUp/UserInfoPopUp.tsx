import { RequestorItemsFragment } from "@/app/generated/gql/graphql";
import { AccountBox } from "@mui/icons-material";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Table, TableBody, TableCell, TableRow } from "@mui/material";
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
      >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center' }}>
        <AccountBox color='info' sx={{ mr: 1, width: '40px', height: '40px' }}/> {`${getRole()} 프로필`}
      </DialogTitle>
      <DialogContent>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell component="th" scope="row">이름</TableCell>
              <TableCell>{getRequestor?.name || ''}</TableCell>
            </TableRow>
            {!!getRequestor?.year && <TableRow>
              <TableCell component="th" scope="row">학년</TableCell>
              <TableCell>{`${getRequestor?.year}학년` || ''}</TableCell>
            </TableRow>}
            {!!getRequestor?.class && <TableRow>
              <TableCell component="th" scope="row">반</TableCell>
              <TableCell>{`${getRequestor?.class}반` || ''}</TableCell>
            </TableRow>}
            {!!getRequestor?.number && <TableRow>
              <TableCell component="th" scope="row">번호</TableCell>
              <TableCell>{`${getRequestor?.number}번` || ''}</TableCell>
            </TableRow>}
            {!!getRequestor?.email && <TableRow>
              <TableCell component="th" scope="row">이메일</TableCell>
              <TableCell>{getRequestor?.email || ''}</TableCell>
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