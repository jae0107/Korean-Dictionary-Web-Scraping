import { TestVenueInput, TestVenueItemsFragment } from "@/app/generated/gql/graphql";
import { Close } from "@mui/icons-material";
import { Box, Dialog, DialogTitle, IconButton } from "@mui/material";
import TestVenueForm from "../TestVenueForm/TestVenueForm";

const TestVenueUpdatePopUp = ({
  open,
  setOpen,
  getTestVenue,
  onUpdate,
  getLoader,
} : {
  open: boolean;
  setOpen: (value: boolean) => void;
  getTestVenue: TestVenueItemsFragment;
  onUpdate: (value: TestVenueInput) => void;
  getLoader: boolean;
}) => {
  const defaultValues: TestVenueInput = {
    year: getTestVenue.year,
    class: getTestVenue.class,
    pageFrom: getTestVenue.pageFrom,
    pageTo: getTestVenue.pageTo,
  };

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
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
        <IconButton onClick={() => setOpen(false)}>
          <Close/>
        </IconButton>
      </Box>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', pt: 0, pb: 2 }}>
        시험장 수정
      </DialogTitle>
      <TestVenueForm defaultValues={defaultValues} getLoader={getLoader} onSubmit={onUpdate} type={'Update'}/>
    </Dialog>
  );
}

export default TestVenueUpdatePopUp;