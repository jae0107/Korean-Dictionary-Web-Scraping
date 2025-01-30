import { WordStatus } from "@/app/generated/gql/graphql";
import { TabContext, TabList } from "@mui/lab";
import { Box, Stack, Tab, TextField } from "@mui/material";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, SyntheticEvent } from "react";

const a11yProps = (index: string) => {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
};

const MyRequestFilter = ({
  wordRequestStatus,
  setWordRequestStatus,
  wordKeyword,
  setWordKeyword,
} : {
  wordRequestStatus: WordStatus;
  setWordRequestStatus: Dispatch<SetStateAction<WordStatus>>;
  wordKeyword: string;
  setWordKeyword: (value: string) => void;
}) => {
  const router = useRouter();
  
  const handleTabChange = (event: SyntheticEvent, newValue: WordStatus) => {
    setWordRequestStatus(newValue);
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
          sx={{ width: '250px' }}
        />
      </Stack>
    </Stack>
  );
}

export default MyRequestFilter;