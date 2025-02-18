import { ErrorOutline } from "@mui/icons-material";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";

const ConfirmDialog = ({
  open,
  handleClose,
  title,
  content,
} : {
  open: boolean;
  handleClose: (isConfirm: boolean) => void;
  title: string;
  content: string;
}) => {
  return (
    <Dialog
      open={open}
      onClose={() => handleClose(false)}
      sx={{
        '@media (max-width: 501px)': {
          "& .MuiDialog-container": {
            "& .MuiPaper-root": {
              margin: 1,
            },
          },
        }
      }}
    >
      <DialogTitle display={'flex'} alignItems={'center'}>
        <ErrorOutline color='warning' sx={{ mr: 1 }}/>{title}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          {content}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button autoFocus variant='contained' color='error' onClick={() => handleClose(false)}>
          아니요
        </Button>
        <Button variant='contained' color='success' onClick={() => handleClose(true)}>
          예
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ConfirmDialog;