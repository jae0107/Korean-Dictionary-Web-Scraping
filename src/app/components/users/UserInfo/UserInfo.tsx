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
              <TableCell>{user?.year ? `${user?.year}학년` || '-' : '-'}</TableCell>
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
              <TableCell sx={{ minWidth: 70 }} component="th" scope="row">아이디</TableCell>
              <TableCell sx={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>{user.accountId || ''}</TableCell>
            </TableRow>
            {
              user.password && 
              <TableRow>
                <TableCell sx={{ minWidth: 70 }} component="th" scope="row">비밀번호</TableCell>
                <TableCell sx={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>{user.password || ''}</TableCell>
              </TableRow>
            }
            {
              user.importedStatus &&
              <TableRow>
                <TableCell sx={{ minWidth: 70 }} component="th" scope="row">등록 방식</TableCell>
                <TableCell sx={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>{user.importedStatus === 'IMPORTED' ? '일괄 등록' : '수동 등록'}</TableCell>
              </TableRow>
            }
          </TableBody>
        </Table>
      </DialogContent>
    </>
  );
}

export default UserInfo;