import { Box, FormControl, InputLabel, MenuItem, Select, Stack, Tab, TextField, Tooltip } from "@mui/material";
import { TabContext, TabList } from '@mui/lab';
import { Dispatch, SetStateAction, SyntheticEvent } from "react";
import { WordStatus } from "@/app/generated/gql/graphql";
import { useRouter } from "next/navigation";
import RequestorDropDown from "./RequestorDropDown/RequestorDropDown";

const a11yProps = (index: string) => {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
};

const RequestManagementFilter = ({
  wordRequestStatus,
  setWordRequestStatus,
  wordKeyword,
  setWordKeyword,
  getRequestorId,
  setRequestorId,
  getYear,
  setYear,
  getClass,
  setClass,
  setSelectedRequests,
} : {
  wordRequestStatus: WordStatus;
  setWordRequestStatus: Dispatch<SetStateAction<WordStatus>>;
  wordKeyword: string;
  setWordKeyword: (value: string) => void;
  getRequestorId: string;
  setRequestorId: (value: string) => void;
  getYear: string;
  setYear: (value: string) => void;
  getClass: string;
  setClass: (value: string) => void;
  setSelectedRequests: (value: string[]) => void;
}) => {
  const router = useRouter();

  const handleTabChange = (event: SyntheticEvent, newValue: WordStatus) => {
    setWordRequestStatus(newValue);
    setSelectedRequests([]);
    router.push(`?status=${newValue}`);
  };

  return (
    <Stack width={'90%'} spacing={2} mb={2}>
      <TabContext value={wordRequestStatus}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleTabChange}>
            <Tab
              label="승인"
              value={WordStatus.Approved}
              {...a11yProps(WordStatus.Approved)}
            />
            <Tab
              label="승인 대기중"
              value={WordStatus.Pending}
              {...a11yProps(WordStatus.Pending)}
            />
            <Tab
              label="거절"
              value={WordStatus.Denied}
              {...a11yProps(WordStatus.Denied)}
            />
          </TabList>
        </Box>
      </TabContext>
      <Stack spacing={2} direction="row">
        <TextField
          label="단어 검색"
          value={wordKeyword}
          onChange={(e) => setWordKeyword(e.target.value)}
          sx={{ flex: 2 }}
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
        <RequestorDropDown
          setRequestorId={setRequestorId}
        />
      </Stack>
    </Stack>
  );
}

export default RequestManagementFilter;