import { RadioButtonUnchecked } from '@mui/icons-material';
import { Box, InputLabel, Skeleton, Stack, Typography } from '@mui/material';

const DummyPasswordChangeForm = () => {
  return (
    <Stack spacing={2}>
      <Box width={'100%'}>
        <InputLabel sx={{ marginBottom: 1 }} required>현재 비밀번호</InputLabel>
        <Skeleton 
          variant="rounded" 
          height={56}
          sx={{
            '@media (max-width:420px)': {
              height: '51.4px !important'
            }
          }}
        />
      </Box>
      <Box width={'100%'}>
        <InputLabel sx={{ marginBottom: 1 }} required>새 비밀번호</InputLabel>
        <Skeleton 
          variant="rounded" 
          height={56}
          sx={{
            '@media (max-width:420px)': {
              height: '51.4px !important'
            }
          }}
        />
      </Box>
      <Stack spacing={0.5}>
        <Typography
          variant='body2'
          fontSize={'0.80rem'}
          display={'flex'}
          alignItems={'center'}
          color={'textSecondary' }
        >
          <RadioButtonUnchecked color='action' sx={{ width: '10px', height: '10px', mr: 1 }}/>
          비밀번호는 최소 8자 이상이어야 합니다.
        </Typography>
        <Typography
          variant='body2'
          fontSize={'0.80rem'}
          display={'flex'}
          alignItems={'center'}
          color={'textSecondary' }
        >
          <RadioButtonUnchecked color='action' sx={{ width: '10px', height: '10px', mr: 1 }}/>
          비밀번호에 최소 하나의 대문자가 포함되어야 합니다.
        </Typography>
        <Typography
          variant='body2'
          fontSize={'0.80rem'}
          display={'flex'}
          alignItems={'center'}
          color={'textSecondary' }
        >
          <RadioButtonUnchecked color='action' sx={{ width: '10px', height: '10px', mr: 1 }}/>
          비밀번호에 최소 하나의 소문자가 포함되어야 합니다.
        </Typography>
        <Typography
          variant='body2'
          fontSize={'0.80rem'}
          display={'flex'}
          alignItems={'center'}
          color={'textSecondary' }
        >
          <RadioButtonUnchecked color='action' sx={{ width: '10px', height: '10px', mr: 1 }}/>
          비밀번호에 최소 하나의 숫자가 포함되어야 합니다.
        </Typography>
        <Typography
          variant='body2'
          fontSize={'0.80rem'}
          display={'flex'}
          alignItems={'center'}
          color={'textSecondary' }
        >
          <RadioButtonUnchecked color='action' sx={{ width: '10px', height: '10px', mr: 1 }}/>
          {'비밀번호에 최소 하나의 특수문자 (!@#$%^&*)가 포함되어야 합니다.'}
        </Typography>
      </Stack>
    </Stack>
  );
}

export default DummyPasswordChangeForm;