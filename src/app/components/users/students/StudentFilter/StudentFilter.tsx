import { UserImportedStatus, UserStatus } from "@/app/generated/gql/graphql";
import { Cancel } from "@mui/icons-material";
import { TabContext, TabList } from "@mui/lab";
import { Box, FormControl, IconButton, InputAdornment, InputLabel, MenuItem, Select, Stack, Tab, TextField } from "@mui/material";
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
  setSelectedStudents,
  studentImportedStatus,
  setStudentImportedStatus,
} : {
  userNameKeyword: string;
  setUserNameKeyword: (value: string) => void;
  studentStatus: UserStatus;
  setStudentStatus: Dispatch<SetStateAction<UserStatus>>;
  setSelectedStudents: (value: string[]) => void;
  studentImportedStatus: UserImportedStatus | null;
  setStudentImportedStatus: Dispatch<SetStateAction<UserImportedStatus | null>>;
}) => {
  const router = useRouter();

  const handleTabChange = (event: SyntheticEvent, newValue: UserStatus) => {
    setStudentStatus(newValue);
    setSelectedStudents([]);
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
      <Stack direction="row" spacing={2}>
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
        <FormControl 
          sx={{ 
            width: '250px',
            '@media (max-width:600px)': {
              width: '100%',
            }
          }}
        >
          <InputLabel>등록 방식</InputLabel>
          <Select
            value={studentImportedStatus ?? ''}
            label="학년"
            onChange={(e) => {
              if (e.target.value === 'IMPORTED') {
                setStudentImportedStatus(UserImportedStatus.Imported);
              } else if (e.target.value === 'NOT_IMPORTED') {
                setStudentImportedStatus(UserImportedStatus.NotImported);
              } else {
                setStudentImportedStatus(null);
              }
            }}
            sx={{
              '@media (max-width:600px)': {
                fontSize: '0.8rem'
              }
            }}
          >
            <MenuItem 
              value={''}
              sx={{
                '@media (max-width:600px)': {
                  fontSize: '0.875rem',
                  pt: '4px',
                  pb: '4px',
                  minHeight: '32px'
                }
              }}
            >
              <em>-</em>
            </MenuItem>
            <MenuItem 
              value={'IMPORTED'}
              sx={{
                '@media (max-width:600px)': {
                  fontSize: '0.875rem',
                  pt: '4px',
                  pb: '4px',
                  minHeight: '32px'
                }
              }}
            >
              일괄 등록
            </MenuItem>
            <MenuItem 
              value={'NOT_IMPORTED'}
              sx={{
                '@media (max-width:600px)': {
                  fontSize: '0.875rem',
                  pt: '4px',
                  pb: '4px',
                  minHeight: '32px'
                }
              }}
            >
              수동 등록
            </MenuItem>
          </Select>
        </FormControl>
      </Stack>
    </Stack>
  );
}

export default StudentFilter;