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
    >
      <DialogTitle display={'flex'} alignItems={'center'}>
        <DoDisturb color='warning' sx={{ mr: 1 }}/>거절 사유
      </DialogTitle>
      <DialogContent sx={{ pt: '6px !important', width: '400px' }}>
        <TextField
          label={'거절 사유'}
          type='text'
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