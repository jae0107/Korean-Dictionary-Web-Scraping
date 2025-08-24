import { Cancel } from "@mui/icons-material";
import { IconButton, InputAdornment, Stack, TextField } from "@mui/material";

const MyVocabFilter = ({
  wordKeyword,
  setWordKeyword,
  getPageFrom,
  setPageFrom,
  getPageTo,
  setPageTo,
} : {
  wordKeyword: string;
  setWordKeyword: (value: string) => void;
  getPageFrom: number | null;
  setPageFrom: (value: number | null) => void;
  getPageTo: number | null;
  setPageTo: (value: number | null) => void;
}) => {
  return (
    <Stack 
      direction={'row'}
      width={'90%'} 
      spacing={2}
      sx={{
        '@media (max-width:545px)': {
          width: '95% !important',
          '& > :not(style) + :not(style)': {
            ml: '8px !important',
          }
        },
        '@media (max-width:400px)': {
          '& > :not(style) + :not(style)': {
            ml: '4px !important',
          }
        },
      }}
    >
      <TextField
        label="단어 검색"
        value={wordKeyword}
        sx={{ flex: 1.5 }}
        onChange={(e) => setWordKeyword(e.target.value)}
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setWordKeyword('')}>
                  <Cancel sx={{ width: '15px', height: '15px' }}/>
                </IconButton>
              </InputAdornment>
            ),
          },
          htmlInput: {
            sx: {
              '@media (max-width:600px)': {
                fontSize: '0.8rem',
              }
            },
          },
        }}
      />
      <TextField
        label={'시작 페이지'}
        error={!getPageFrom && !!getPageTo}
        type='number'
        value={getPageFrom ?? ''}
        onChange={(e) => setPageFrom(parseInt(e.target.value))}
        sx={{ 
          '@media (max-width:495px)': {
            flex: 1,
          }
        }}
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setPageFrom(null)}>
                  <Cancel sx={{ width: '15px', height: '15px' }}/>
                </IconButton>
              </InputAdornment>
            ),
          },
          htmlInput: {
            min: 0,
            sx: {
              '@media (max-width:600px)': {
                fontSize: '0.8rem',
              }
            },
          },
        }}
      />
      <TextField
        label={'끝 페이지'}
        error={!!getPageFrom && !getPageTo}
        type='number'
        value={getPageTo ?? ''}
        onChange={(e) => setPageTo(parseInt(e.target.value))}
        sx={{ 
          '@media (max-width:495px)': {
            flex: 1,
          }
        }}
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setPageTo(null)}>
                  <Cancel sx={{ width: '15px', height: '15px' }}/>
                </IconButton>
              </InputAdornment>
            ),
          },
          htmlInput: {
            min: 0,
            sx: {
              '@media (max-width:600px)': {
                fontSize: '0.8rem',
              }
            },
          },
        }}
      />
    </Stack>
  );
}

export default MyVocabFilter;