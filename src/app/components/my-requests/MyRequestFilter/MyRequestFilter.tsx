import { WordStatus } from "@/app/generated/gql/graphql";
import { Cancel } from "@mui/icons-material";
import { TabContext, TabList } from "@mui/lab";
import { Box, IconButton, InputAdornment, Stack, Tab, TextField } from "@mui/material";
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
  setSelectedRequests,
} : {
  wordRequestStatus: WordStatus;
  setWordRequestStatus: Dispatch<SetStateAction<WordStatus>>;
  wordKeyword: string;
  setWordKeyword: (value: string) => void;
  setSelectedRequests: (value: string[]) => void;
}) => {
  const router = useRouter();
  
  const handleTabChange = (event: SyntheticEvent, newValue: WordStatus) => {
    setWordRequestStatus(newValue);
    setSelectedRequests([]);
    router.push(`?status=${newValue}`);
  };
  
  return (
    <Stack 
      width={'90%'} 
      spacing={2} 
      mb={2}
      sx={{
        '@media (max-width:545px)': {
          width: '95% !important',
        }
      }}
    >
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
              label="중복"
              value={WordStatus.Duplicated}
              {...a11yProps(WordStatus.Duplicated)}
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
          sx={{ 
            width: '250px',
            '@media (max-width:600px)': {
              width: '100%',
            }
          }}
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
      </Stack>
    </Stack>
  );
}

export default MyRequestFilter;