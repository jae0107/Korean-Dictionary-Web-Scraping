import { Box, FormControl, IconButton, InputAdornment, InputLabel, MenuItem, Select, Stack, Tab, TextField, Tooltip } from "@mui/material";
import { TabContext, TabList } from '@mui/lab';
import { Dispatch, SetStateAction, SyntheticEvent } from "react";
import { WordStatus } from "@/app/generated/gql/graphql";
import { useRouter } from "next/navigation";
import RequestorDropDown from "./RequestorDropDown/RequestorDropDown";
import { Cancel } from "@mui/icons-material";

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
              label="거절"
              value={WordStatus.Denied}
              {...a11yProps(WordStatus.Denied)}
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
            label="단어 검색"
            value={wordKeyword}
            onChange={(e) => setWordKeyword(e.target.value)}
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
          <RequestorDropDown
            setRequestorId={setRequestorId}
          />
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

export default RequestManagementFilter;