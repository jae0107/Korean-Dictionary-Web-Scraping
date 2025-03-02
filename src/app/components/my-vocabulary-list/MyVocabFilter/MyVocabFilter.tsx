import { Cancel } from "@mui/icons-material";
import { IconButton, InputAdornment, Stack, TextField } from "@mui/material";

const MyVocabFilter = ({
  wordKeyword,
  setWordKeyword,
  getPage,
  setPage,
} : {
  wordKeyword: string;
  setWordKeyword: (value: string) => void;
  getPage: number | null;
  setPage: (value: number | null) => void;
}) => {
  return (
    <Stack 
      direction={'row'}
      width={'90%'} 
      spacing={2}
      sx={{
        '@media (max-width:545px)': {
          width: '95% !important',
        }
      }}
    >
      <TextField
        label="단어 검색"
        value={wordKeyword}
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
        label={'페이지'}
        type='number'
        value={getPage ?? ''}
        onChange={(e) => setPage(parseInt(e.target.value))}
        sx={{ 
          '@media (max-width:495px)': {
            flex: 1,
          }
        }}
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setPage(null)}>
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