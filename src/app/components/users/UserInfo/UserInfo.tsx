import { DialogContent, Table, TableBody, TableCell, TableRow } from '@mui/material';
import { UserInfoProps } from './type';

const UserInfo = ({
  user
} : {
  user: UserInfoProps;
}) => {
  return (
    <>
      <DialogContent>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell sx={{ minWidth: 70 }} component="th" scope="row">이름</TableCell>
              <TableCell>{user?.name || ''}</TableCell>
            </TableRow>
            {(!!user?.year || user.role === 'STUDENT') && <TableRow>
              <TableCell sx={{ minWidth: 70 }} component="th" scope="row">학년</TableCell>
              <TableCell>{`${user?.year}학년` || '-'}</TableCell>
            </TableRow>}
            {((!!user?.class && !!parseInt(user.class)) || user.role === 'STUDENT') && <TableRow>
              <TableCell sx={{ minWidth: 70 }} component="th" scope="row">반</TableCell>
              <TableCell>{user?.class && parseInt(user.class) > 0 ? `${user?.class}반` || '-' : '-'}</TableCell>
            </TableRow>}
            {(!!user?.number || user.role === 'STUDENT') && <TableRow>
              <TableCell sx={{ minWidth: 70 }} component="th" scope="row">번호</TableCell>
              <TableCell>{user?.number && user.number > 0 ? `${user.number}번` || '-' : '-'}</TableCell>
            </TableRow>}
            <TableRow>
              <TableCell sx={{ minWidth: 70 }} component="th" scope="row">이메일</TableCell>
              <TableCell sx={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>{user.email || ''}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </DialogContent>
    </>
  );
}

export default UserInfo;