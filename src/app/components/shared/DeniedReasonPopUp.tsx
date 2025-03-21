import { Cancel, DoDisturb } from "@mui/icons-material";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, InputAdornment, TextField } from "@mui/material";
import { useState } from "react";

const DeniedReasonPopUp = ({
  open,
  handleClose,
  getDeniedReason,
  setDeniedReason,
} : {
  open: boolean;
  handleClose: (isConfirm: boolean, deniedReason: string) => void;
  getDeniedReason: string;
  setDeniedReason: (value: string) => void;
}) => {
  return (
    <Dialog
      open={open}
      onClose={() => handleClose(false, getDeniedReason)}
      sx={{
        '@media (max-width: 470px)': {
          "& .MuiDialog-container": {
            "& .MuiPaper-root": {
              width: '100%',
              margin: 1,
            },
          },
        }
      }}
    >
      <DialogTitle display={'flex'} alignItems={'center'}>
        <DoDisturb color='warning' sx={{ mr: 1 }}/>거절 사유
      </DialogTitle>
      <DialogContent 
        sx={{ 
          pt: '6px !important', 
          width: '400px',
          '@media (max-width: 470px)': {
            width: '100%',
          },
        }}
      >
        <TextField
          type='text'
          placeholder="거절 사유를 입력하세요."
          multiline
          rows={4}
          fullWidth
          value={getDeniedReason}
          onChange={(e) => setDeniedReason(e.target.value)}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setDeniedReason('')}>
                    <Cancel sx={{ width: '15px', height: '15px' }}/>
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button autoFocus variant='contained' color='error' onClick={() => handleClose(false, getDeniedReason)}>
          취소
        </Button>
        <Button variant='contained' color='success' onClick={() => handleClose(true, getDeniedReason)}>
          제출
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default DeniedReasonPopUp;