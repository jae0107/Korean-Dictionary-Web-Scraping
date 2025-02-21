import { UserStatus } from "@/app/generated/gql/graphql";
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

const TeacherFilter = ({
  userNameKeyword,
  setUserNameKeyword,
  teacherStatus,
  setTeacherStatus,
  setSelectedTeachers,
} : {
  userNameKeyword: string;
  setUserNameKeyword: (value: string) => void;
  teacherStatus: UserStatus;
  setTeacherStatus: Dispatch<SetStateAction<UserStatus>>;
  setSelectedTeachers: (value: string[]) => void;
}) => {
  const router = useRouter();

  const handleTabChange = (event: SyntheticEvent, newValue: UserStatus) => {
    setTeacherStatus(newValue);
    setSelectedTeachers([]);
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
      <TabContext value={teacherStatus}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleTabChange}>
            <Tab
              label="승인"
              value={UserStatus.Approved}
              {...a11yProps(UserStatus.Approved)}
            />
            <Tab
              label="승인 대기중"
              value={UserStatus.Pending}
              {...a11yProps(UserStatus.Pending)}
            />
            <Tab
              label="거절"
              value={UserStatus.Denied}
              {...a11yProps(UserStatus.Denied)}
            />
          </TabList>
        </Box>
      </TabContext>
      <TextField
        label="이름 검색"
        value={userNameKeyword}
        onChange={(e) => setUserNameKeyword(e.target.value)}
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
                <IconButton onClick={() => setUserNameKeyword('')}>
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
  );
}

export default TeacherFilter;