import { VpnKey } from "@mui/icons-material";
import { Box, InputLabel, Skeleton, Stack, Theme, Typography } from "@mui/material";

const DummyPasswordSetUpForm = ({ theme } : { theme: Theme | null }) => {
  return (
    <Box
      display={'flex'}
      justifyContent={'center'}
      alignItems={'center'}
      width={'100%'}
    >
      <Stack 
        spacing={4} 
        width={'500px'} 
        padding={5} 
        borderRadius={2} 
        boxShadow={2} 
        bgcolor={theme && theme.palette.mode === 'dark' ? '#272727' : 'white'}
        sx={{
          '@media (max-width:530px)': {
            width: '95% !important',
          }
        }}
      >
        <Typography variant='h5' display={'flex'} flexDirection={'row'} alignItems={'center'}>
          <VpnKey color='primary' sx={{ width: '40px', height: '40px', mr: 1 }}/>비밀번호 설정
        </Typography>
        <Box width={'100%'}>
          <InputLabel sx={{ marginBottom: 1 }} required>비밀번호</InputLabel>
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
          <InputLabel sx={{ marginBottom: 1 }} required>비밀번호 확인</InputLabel>
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
      </Stack>
    </Box>
  );
}

export default DummyPasswordSetUpForm;