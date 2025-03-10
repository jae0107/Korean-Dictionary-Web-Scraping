import { Close } from '@mui/icons-material';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from '@mui/material';
import TestVenueForm from '../TestVenueForm/TestVenueForm';
import { TestVenueInput } from '@/app/generated/gql/graphql';
import { useMutation } from '@apollo/client';
import { createTestVenueMutation } from './query';
import { useState } from 'react';
import { useSnackbar } from '@/app/hooks/useSnackbar';

const TestVenueCreationPopUp = ({
  open,
  setOpen,
  refetch,
} : {
  open: boolean;
  setOpen: (value: boolean) => void;
  refetch: () => void;
}) => {
  const { dispatchCurrentSnackBar } = useSnackbar();
  
  const [getLoader, setLoader] = useState<boolean>(false);

  const [createTestVenue] = useMutation(createTestVenueMutation);

  const onCreation = (input: TestVenueInput) => {
    setLoader(true);
    createTestVenue({
      variables: {
        input: {
          ...input,
          year: Number(input.year),
          class: String(input.class),
          pageFrom: input.pageFrom && input.pageFrom > 0 ? Number(input.pageFrom) : null,
          pageTo: input.pageTo && input.pageTo > 0 ?  Number(input.pageTo) : null,
        },
      },
      onError: (error) => {
        setLoader(false);
        dispatchCurrentSnackBar({
          payload: {
            open: true,
            type: 'error',
            message: error.message,
          },
        });
      },
      onCompleted: () => {
        refetch();
        setOpen(false);
        setLoader(false);
        dispatchCurrentSnackBar({
          payload: {
            open: true,
            type: 'success',
            message: '시험장이 생성되었습니다.',
          },
        });
      },
    });
  }

  const defaultValues: TestVenueInput = {
    year: 0,
    class: '',
    pageFrom: 0,
    pageTo: 0,
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
        시험장 생성
      </DialogTitle>
      <TestVenueForm defaultValues={defaultValues} getLoader={getLoader} onSubmit={onCreation} type={'Create'}/>
    </Dialog>
  );
}

export default TestVenueCreationPopUp;