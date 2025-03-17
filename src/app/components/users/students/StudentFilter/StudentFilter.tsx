import { UserImportedStatus, UserStatus } from "@/app/generated/gql/graphql";
import { Cancel } from "@mui/icons-material";
import { TabContext, TabList } from "@mui/lab";
import { Box, FormControl, IconButton, InputAdornment, InputLabel, MenuItem, Select, Stack, Tab, TextField, Tooltip } from "@mui/material";
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
  getYear,
  setYear,
  getClass,
  setClass,
} : {
  userNameKeyword: string;
  setUserNameKeyword: (value: string) => void;
  studentStatus: UserStatus;
  setStudentStatus: Dispatch<SetStateAction<UserStatus>>;
  setSelectedStudents: (value: string[]) => void;
  studentImportedStatus: UserImportedStatus | null;
  setStudentImportedStatus: Dispatch<SetStateAction<UserImportedStatus | null>>;
  getYear: string;
  setYear: (value: string) => void;
  getClass: string;
  setClass: (value: string) => void;
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
      <Stack 
        spacing={2} 
        direction="row"
        sx={{
          '@media (max-width:800px)': {
            '& > :not(style) + :not(style)': {
              ml: '8px !important',
            }
          },
          '@media (max-width:545px)': {
            '& > :not(style) + :not(style)': {
              ml: '4px !important',
            }
          },
          '@media (max-width:495px)': {
            flexDirection: 'column',
            '& > :not(style) + :not(style)': {
              ml: '0px !important',
              mt: '8px !important',
            },
          }
        }}
      >
        <Stack
          spacing={2}
          direction="row"
          flex={2}
          sx={{
            '@media (max-width:800px)': {
              '& > :not(style) + :not(style)': {
                ml: '8px !important',
              }
            },
            '@media (max-width:545px)': {
              '& > :not(style) + :not(style)': {
                ml: '4px !important',
              }
            }
          }}
        >
          <TextField
            label="이름 검색"
            value={userNameKeyword}
            onChange={(e) => setUserNameKeyword(e.target.value)}
            sx={{ 
              flex: 1,
              '@media (max-width:495px)': {
                '&.MuiTextField-root .MuiOutlinedInput-root': {
                  pr: '4px !important',
                }
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
          <FormControl sx={{ flex: 1 }}>
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
        <Stack
          spacing={2}
          direction="row"
          flex={1}
          sx={{
            '@media (max-width:800px)': {
              '& > :not(style) + :not(style)': {
                ml: '8px !important',
              }
            },
            '@media (max-width:545px)': {
              '& > :not(style) + :not(style)': {
                ml: '4px !important',
              }
            }
          }}
        >
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
                value={1}
                sx={{
                  '@media (max-width:600px)': {
                    fontSize: '0.875rem',
                    pt: '4px',
                    pb: '4px',
                    minHeight: '32px'
                  }
                }}
              >
                1학년
              </MenuItem>
              <MenuItem 
                value={2}
                sx={{
                  '@media (max-width:600px)': {
                    fontSize: '0.875rem',
                    pt: '4px',
                    pb: '4px',
                    minHeight: '32px'
                  }
                }}
              >
                2학년
              </MenuItem>
              <MenuItem 
                value={3}
                sx={{
                  '@media (max-width:600px)': {
                    fontSize: '0.875rem',
                    pt: '4px',
                    pb: '4px',
                    minHeight: '32px'
                  }
                }}
              >
                3학년
              </MenuItem>
            </Select>
          </FormControl>
          <Tooltip placement='top' title={getYear === '' ? '학년을 선택해주세요.' : ''}>
            <FormControl sx={{ flex: 1 }} disabled={getYear === ''}>
              <InputLabel>반</InputLabel>
              <Select
                value={getClass}
                label="반"
                onChange={(e) => setClass(e.target.value)}
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
                  value={1}
                  sx={{
                    '@media (max-width:600px)': {
                      fontSize: '0.875rem',
                      pt: '4px',
                      pb: '4px',
                      minHeight: '32px'
                    }
                  }}
                >
                  1반
                </MenuItem>
                <MenuItem 
                  value={2}
                  sx={{
                    '@media (max-width:600px)': {
                      fontSize: '0.875rem',
                      pt: '4px',
                      pb: '4px',
                      minHeight: '32px'
                    }
                  }}
                >
                  2반
                </MenuItem>
                <MenuItem 
                  value={3}
                  sx={{
                    '@media (max-width:600px)': {
                      fontSize: '0.875rem',
                      pt: '4px',
                      pb: '4px',
                      minHeight: '32px'
                    }
                  }}
                >
                  3반
                </MenuItem>
                <MenuItem 
                  value={4}
                  sx={{
                    '@media (max-width:600px)': {
                      fontSize: '0.875rem',
                      pt: '4px',
                      pb: '4px',
                      minHeight: '32px'
                    }
                  }}
                >
                  4반
                </MenuItem>
                <MenuItem 
                  value={5}
                  sx={{
                    '@media (max-width:600px)': {
                      fontSize: '0.875rem',
                      pt: '4px',
                      pb: '4px',
                      minHeight: '32px'
                    }
                  }}
                >
                  5반
                </MenuItem>
                <MenuItem 
                  value={6}
                  sx={{
                    '@media (max-width:600px)': {
                      fontSize: '0.875rem',
                      pt: '4px',
                      pb: '4px',
                      minHeight: '32px'
                    }
                  }}
                >
                  6반
                </MenuItem>
                <MenuItem 
                  value={7}
                  sx={{
                    '@media (max-width:600px)': {
                      fontSize: '0.875rem',
                      pt: '4px',
                      pb: '4px',
                      minHeight: '32px'
                    }
                  }}
                >
                  7반
                </MenuItem>
                <MenuItem 
                  value={8}
                  sx={{
                    '@media (max-width:600px)': {
                      fontSize: '0.875rem',
                      pt: '4px',
                      pb: '4px',
                      minHeight: '32px'
                    }
                  }}
                >
                  8반
                </MenuItem>
                <MenuItem 
                  value={9}
                  sx={{
                    '@media (max-width:600px)': {
                      fontSize: '0.875rem',
                      pt: '4px',
                      pb: '4px',
                      minHeight: '32px'
                    }
                  }}
                >
                  9반
                </MenuItem>
                <MenuItem 
                  value={10}
                  sx={{
                    '@media (max-width:600px)': {
                      fontSize: '0.875rem',
                      pt: '4px',
                      pb: '4px',
                      minHeight: '32px'
                    }
                  }}
                >
                  10반
                </MenuItem>
              </Select>
            </FormControl>
          </Tooltip>
        </Stack>
      </Stack>
    </Stack>
  );
}

export default StudentFilter;