import { Close } from '@mui/icons-material';
import {
  IconButton,
  Snackbar,
  SnackbarOrigin,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { createContext, forwardRef, useContext, useReducer } from 'react';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
export type SnackbarType = 'success' | 'warning' | 'error' | 'info';

interface SnackBarOption {
  message: string;
  type: SnackbarType;
  open: boolean;
  anchorOrigin?: SnackbarOrigin;
}

interface SnackbarPayload {
  payload: Partial<SnackBarOption>;
}

function snackBarReducer(state: SnackBarOption, action: SnackbarPayload) {
  return {
    ...state,
    ...action.payload,
  };
}
// snackbar message could stacked
const Alert = forwardRef<HTMLDivElement, AlertProps>(
  function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  }
);
const SnackbarContext = createContext({
  currentSnackBar: {
    open: false,
    message: '',
    type: 'warning',
  },
  dispatchCurrentSnackBar: (_action: SnackbarPayload) => {},
});

export let dispatchSnackBar: (action: SnackbarPayload) => void;

function SnackbarProvider({ children }: { children: React.ReactNode }) {
  const maxWidth600 = useMediaQuery('(max-width:600px)');
  
  const [currentSnackBar, dispatchCurrentSnackBar] = useReducer(
    snackBarReducer,
    {
      open: false,
      message: '',
      type: 'warning',
      anchorOrigin: {
        horizontal: 'center',
        vertical: 'bottom',
      },
    } as SnackBarOption
  );

  dispatchSnackBar = dispatchCurrentSnackBar;

  return (
    <SnackbarContext.Provider
      value={{
        currentSnackBar,
        dispatchCurrentSnackBar,
      }}
    >
      {children}
      <Snackbar
        anchorOrigin={currentSnackBar.anchorOrigin}
        open={currentSnackBar.open}
        autoHideDuration={6000}
        onClose={() =>
          dispatchCurrentSnackBar({
            payload: {
              open: false,
            },
          })
        }
      >
        <Alert
          severity={currentSnackBar.type}
          sx={{ width: maxWidth600 ? '95%' : '100%' }}
          action={
            <IconButton
              sx={{
                color: currentSnackBar.type === 'success' ? '#ffffff' : 'black',
              }}
              size="small"
              aria-label="close"
              color="inherit"
              onClick={() =>
                dispatchCurrentSnackBar({
                  payload: {
                    open: false,
                  },
                })
              }
            >
              <Close
                fontSize="small"
                sx={{
                  color:
                    currentSnackBar.type === 'success' ? '#081f3e' : '#ffffff',
                  width: maxWidth600 ? '15px' : '20px',
                  height: maxWidth600 ? '15px' : '20px',
                }}
              />
            </IconButton>
          }
        >
          <Typography
            variant={maxWidth600 ? 'body2' : 'body1'}
            fontSize={maxWidth600 ? '0.75rem' : '1rem'}
            style={{
              whiteSpace: 'pre-line',
              color: currentSnackBar.type === 'success' ? '#081f3e' : '#ffffff',
            }}
          >
            {currentSnackBar.message}
          </Typography>
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
}

function useSnackbar() {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error('useAuth must be used with SnackbarProvider');
  }
  return context;
}

export { useSnackbar, SnackbarProvider };
