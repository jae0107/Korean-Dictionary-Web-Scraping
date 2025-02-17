import { Cancel } from "@mui/icons-material";
import { FormControl, IconButton, InputAdornment, InputLabel, MenuItem, Select, Stack, TextField, Tooltip, useMediaQuery } from "@mui/material";

const VocabFilter = ({
  wordKeyword,
  setWordKeyword,
  getYear,
  setYear,
  getClass,
  setClass,
} : {
  wordKeyword: string;
  setWordKeyword: (value: string) => void;
  getYear: string;
  setYear: (value: string) => void;
  getClass: string;
  setClass: (value: string) => void;
}) => {
  const maxWidth750 = useMediaQuery('(max-width:750px)');
  const maxWidth470 = useMediaQuery('(max-width:470px)');
  
  return (
    <Stack spacing={maxWidth470 ? 1 : 2} direction="row" width={maxWidth470 ? '95%' : '90%'}>
      <TextField
        label="단어 검색"
        value={wordKeyword}
        onChange={(e) => setWordKeyword(e.target.value)}
        sx={{ flex: maxWidth750 ? 2 : 1 }}
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
          htmlInput: { style: { fontSize: maxWidth470 ? '0.8rem' : '1rem' } },
        }}
      />
      <FormControl sx={{ flex: 1 }}>
        <InputLabel>학년</InputLabel>
        <Select
          value={getYear}
          label="학년"
          onChange={(e) => {
            if (e.target.value === '') {
              setClass('');
            }
            setYear(e.target.value);
          }}
          sx={{ fontSize: maxWidth470 ? '0.8rem' : '1rem' }}
        >
          <MenuItem value={''} dense={maxWidth470}><em>-</em></MenuItem>
          <MenuItem value={1} dense={maxWidth470}>1학년</MenuItem>
          <MenuItem value={2} dense={maxWidth470}>2학년</MenuItem>
          <MenuItem value={3} dense={maxWidth470}>3학년</MenuItem>
        </Select>
      </FormControl>
      <Tooltip placement='top' title={getYear === '' ? '학년을 선택해주세요.' : ''}>
        <FormControl sx={{ flex: 1 }} disabled={getYear === ''}>
          <InputLabel>반</InputLabel>
          <Select
            value={getClass}
            label="반"
            onChange={(e) => setClass(e.target.value)}
            sx={{ fontSize: maxWidth470 ? '0.8rem' : '1rem' }}
          >
            <MenuItem value={''} dense={maxWidth470}><em>-</em></MenuItem>
            <MenuItem value={1} dense={maxWidth470}>1반</MenuItem>
            <MenuItem value={2} dense={maxWidth470}>2반</MenuItem>
            <MenuItem value={3} dense={maxWidth470}>3반</MenuItem>
            <MenuItem value={4} dense={maxWidth470}>4반</MenuItem>
            <MenuItem value={5} dense={maxWidth470}>5반</MenuItem>
            <MenuItem value={6} dense={maxWidth470}>6반</MenuItem>
            <MenuItem value={7} dense={maxWidth470}>7반</MenuItem>
            <MenuItem value={8} dense={maxWidth470}>8반</MenuItem>
            <MenuItem value={9} dense={maxWidth470}>9반</MenuItem>
            <MenuItem value={10} dense={maxWidth470}>10반</MenuItem>
          </Select>
        </FormControl>
      </Tooltip>
    </Stack>
  );
}

export default VocabFilter;