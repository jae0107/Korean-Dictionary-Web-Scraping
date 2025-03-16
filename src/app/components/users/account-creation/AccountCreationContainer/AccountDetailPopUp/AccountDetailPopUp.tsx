import { ExtendedUserInput } from "@/app/account-creation/type";
import { AccountBox, Close } from "@mui/icons-material";
import { Box, Dialog, DialogTitle, IconButton } from "@mui/material";
import UserInfo from "../../../UserInfo/UserInfo";
import { UserInfoProps } from "../../../UserInfo/type";


const AccountDetailPopUp = ({
  openAccountDetailPopUp,
  selectedData,
  setOpenAccountDetailPopUp,
  setSelectedData,
} : {
  openAccountDetailPopUp: boolean;
  selectedData: ExtendedUserInput;
  setOpenAccountDetailPopUp: (value: boolean) => void;
  setSelectedData: (value: ExtendedUserInput | null) => void;
}) => {
  const userInfoProps: UserInfoProps = {
    name: selectedData.name || '',
    year: selectedData.year || undefined,
    class: selectedData.class || '',
    number: selectedData.number || undefined,
    accountId: selectedData.accountId || '',
    role: selectedData.role || 'STUDENT',
    password: selectedData.password || '',
    importedStatus: 'IMPORTED',
  };

  const handleClose = (id?: string) => {
    setOpenAccountDetailPopUp(false);
    setSelectedData(null);
  }

  return (
    <Dialog
      open={openAccountDetailPopUp}
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
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', pt: 0 }}>
        <AccountBox color='info' sx={{ mr: 1, width: '40px', height: '40px' }}/> 학생 프로필
      </DialogTitle>
      <UserInfo user={userInfoProps}/>
    </Dialog>
  );
}

export default AccountDetailPopUp;