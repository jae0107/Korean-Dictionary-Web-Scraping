import { FormControl, InputLabel, MenuItem, Select, Stack, TextField, Tooltip } from "@mui/material";

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
  return (
    <Stack spacing={2} direction="row" width={'90%'}>
      <TextField
        label="단어 검색"
        value={wordKeyword}
        onChange={(e) => setWordKeyword(e.target.value)}
        sx={{ flex: 1 }}
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
        >
          <MenuItem value={''}><em>-</em></MenuItem>
          <MenuItem value={1}>1학년</MenuItem>
          <MenuItem value={2}>2학년</MenuItem>
          <MenuItem value={3}>3학년</MenuItem>
        </Select>
      </FormControl>
      <Tooltip placement='top' title={getYear === '' ? '학년을 선택해주세요.' : ''}>
        <FormControl sx={{ flex: 1 }} disabled={getYear === ''}>
          <InputLabel>반</InputLabel>
          <Select
            value={getClass}
            label="반"
            onChange={(e) => setClass(e.target.value)}
          >
            <MenuItem value={''}><em>-</em></MenuItem>
            <MenuItem value={1}>1반</MenuItem>
            <MenuItem value={2}>2반</MenuItem>
            <MenuItem value={3}>3반</MenuItem>
            <MenuItem value={4}>4반</MenuItem>
            <MenuItem value={5}>5반</MenuItem>
            <MenuItem value={6}>6반</MenuItem>
            <MenuItem value={7}>7반</MenuItem>
            <MenuItem value={8}>8반</MenuItem>
            <MenuItem value={9}>9반</MenuItem>
            <MenuItem value={10}>10반</MenuItem>
          </Select>
        </FormControl>
      </Tooltip>
    </Stack>
  );
}

export default VocabFilter;