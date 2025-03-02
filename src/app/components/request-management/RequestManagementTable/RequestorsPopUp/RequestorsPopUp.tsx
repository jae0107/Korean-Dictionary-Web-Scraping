import { RequestorItemsFragment } from "@/app/generated/gql/graphql";
import { Close, Groups } from "@mui/icons-material";
import { Box, Chip, Dialog, DialogContent, DialogTitle, Grid2, IconButton } from "@mui/material";
import { Dispatch, SetStateAction, useState } from "react";
import UserInfoPopUp from "../UserInfoPopUp/UserInfoPopUp";

const RequestorsPopUp = ({
  getRequestors,
  setRequestors,
  openRequestorsPopUp,
  setOpenRequestorsPopUp,
} : {
  getRequestors: RequestorItemsFragment[];
  setRequestors: Dispatch<SetStateAction<RequestorItemsFragment[]>>;
  openRequestorsPopUp: boolean;
  setOpenRequestorsPopUp: (value: boolean) => void;
}) => {
  const [getRequestor, setRequestor] = useState<RequestorItemsFragment | null>(null);
  const [openUserInfoPopUp, setOpenUserInfoPopUp] = useState<boolean>(false);
  
  const handleClose = () => {
    setOpenRequestorsPopUp(false);
    setRequestors([]);
  }

  return (
    <>
      <Dialog
        open={openRequestorsPopUp}
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
          <Groups color='info' sx={{ mr: 1, width: '40px', height: '40px' }}/> 요청자
        </DialogTitle>
        <DialogContent>
          <Grid2 container spacing={2}>
          {
            getRequestors.map((requestor, index) => (
              <Chip 
                key={index}
                label={requestor.name} 
                color="primary" 
                variant="outlined"
                onClick={() => {
                  setRequestor(requestor);
                  setOpenUserInfoPopUp(true);
                }} 
              />
            ))
          }
          </Grid2>
        </DialogContent>
      </Dialog>
      <UserInfoPopUp
        getRequestor={getRequestor}
        setRequestor={setRequestor}
        setOpenUserInfoPopUp={setOpenUserInfoPopUp}
        openUserInfoPopUp={openUserInfoPopUp}
      />
    </>
  );
}

export default RequestorsPopUp;