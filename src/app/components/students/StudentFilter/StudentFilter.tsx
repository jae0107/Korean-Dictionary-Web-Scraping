import { UserStatus } from "@/app/generated/gql/graphql";
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

const StudentFilter = ({
  userNameKeyword,
  setUserNameKeyword,
  studentStatus,
  setStudentStatus,
} : {
  userNameKeyword: string;
  setUserNameKeyword: (value: string) => void;
  studentStatus: UserStatus;
  setStudentStatus: Dispatch<SetStateAction<UserStatus>>;
}) => {
  const router = useRouter();

  const handleTabChange = (event: SyntheticEvent, newValue: UserStatus) => {
    setStudentStatus(newValue);
    router.push(`?status=${newValue}`);
  };
  
  return (
    <Stack width={'90%'} spacing={2} mb={2}>
      <TabContext value={studentStatus}>
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
        sx={{ width: '250px' }}
      />
    </Stack>
  );
}

export default StudentFilter;