import { Cancel } from "@mui/icons-material";
import { FormControl, IconButton, InputAdornment, InputLabel, MenuItem, Select, Stack, TextField, Tooltip } from "@mui/material";


const UserStatFilter = ({
  userNameKeyword,
  setUserNameKeyword,
  getYear,
  setYear,
  getClass,
  setClass,
} : {
  userNameKeyword: string;
  setUserNameKeyword: (value: string) => void;
  getYear: string;
  setYear: (value: string) => void;
  getClass: string;
  setClass: (value: string) => void;
}) => {
  return (
    <Stack
      width={'90%'} 
      spacing={2} 
      direction={'row'}
      sx={{
        '@media (max-width:545px)': {
          width: '95% !important',
          '& > :not(style) + :not(style)': {
              ml: '4px !important',
            }
        },
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
  );
}

export default UserStatFilter;