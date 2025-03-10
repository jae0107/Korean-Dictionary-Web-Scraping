import { TestVenueStatus } from '@/app/generated/gql/graphql';
import { TabContext, TabList } from '@mui/lab';
import { Box, FormControl, InputLabel, MenuItem, Select, Stack, Tab, Tooltip } from '@mui/material';
import { useRouter } from 'next/navigation';
import { SyntheticEvent } from 'react';

const a11yProps = (index: string) => {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
};

const TestVenueFilter = ({
  getStatus,
  setStatus,
  getYear,
  setYear,
  getClass,
  setClass,
} : {
  getStatus: TestVenueStatus;
  setStatus: (status: TestVenueStatus) => void;
  getYear: string;
  setYear: (value: string) => void;
  getClass: string;
  setClass: (value: string) => void;
}) => {
  const router = useRouter();
  
  const handleTabChange = (event: SyntheticEvent, newValue: TestVenueStatus) => {
    setStatus(newValue);
    setYear('');
    setClass('');
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
      <TabContext value={getStatus}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleTabChange}>
            <Tab
              label="시험 중"
              value={TestVenueStatus.Open}
              {...a11yProps(TestVenueStatus.Open)}
              sx={{
                '@media (max-width:420px)': {
                  minWidth: 'unset',
                }
              }}
            />
            <Tab
              label="대기"
              value={TestVenueStatus.Ready}
              {...a11yProps(TestVenueStatus.Ready)}
              sx={{
                '@media (max-width:420px)': {
                  minWidth: 'unset',
                }
              }}
            />
            <Tab
              label="시험 끝"
              value={TestVenueStatus.Closed}
              {...a11yProps(TestVenueStatus.Closed)}
              sx={{
                '@media (max-width:420px)': {
                  minWidth: 'unset',
                }
              }}
            />
          </TabList>
        </Box>
      </TabContext>
      <Stack spacing={2} direction={'row'} alignItems={'center'}>
        <FormControl sx={{ width: '100px' }}>
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
          <FormControl sx={{ width: '100px' }} disabled={getYear === ''}>
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
  );
}

export default TestVenueFilter;