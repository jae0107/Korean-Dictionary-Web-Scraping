import { Box, Skeleton, Stack, useTheme } from '@mui/material';

const DummyTestCard = () => {
  const theme = useTheme();
  
  return (
    <Box 
      width={'800px'} 
      border={`2px solid ${theme.palette.mode === 'dark' ? '#515151' : '#b4b4b4'}`} 
      bgcolor={theme.palette.mode === 'dark' ? '#353535' : '#dfdcdc'}
      borderRadius={2} 
      position={'relative'}
      sx={{
        '@media (max-width:830px)': {
          width: '95% !important',
        }
      }}
    >
      <Box display={'flex'} justifyContent={'center'} p={4} position={'relative'}>
        <Box position="absolute" top={8} right={16}>
          <Skeleton variant='circular' height={50} width={50}/>
        </Box>
        <Stack spacing={2} display={'flex'} flexDirection={'column'}>
          <Stack spacing={1}>
            <Stack spacing={1} direction={'row'} alignItems={'center'}>
              <Skeleton variant="circular" width={'2rem'} height={'2rem'}/>
              <Skeleton variant="rounded" width={70} height={24} />
            </Stack>
            <Box>
              <Stack spacing={'4px'}>
                <Skeleton variant="rounded" width={300} height={20}/>
                <Skeleton variant="rounded" width={300} height={20}/>
                <Skeleton variant="rounded" width={300} height={20}/>
                <Skeleton variant="rounded" width={300} height={20}/>
              </Stack>
            </Box>
          </Stack>
          <Stack spacing={1}>
            <Stack spacing={1} direction={'row'} alignItems={'center'}>
              <Skeleton variant="circular" width={'2rem'} height={'2rem'}/>
              <Skeleton variant="rounded" width={42} height={24} />
            </Stack>
            <Box>
              <Stack spacing={'4px'}>
                <Skeleton variant="rounded" width={300} height={20}/>
                <Skeleton variant="rounded" width={300} height={20}/>
                <Skeleton variant="rounded" width={300} height={20}/>
                <Skeleton variant="rounded" width={300} height={20}/>
              </Stack>
            </Box>
          </Stack>
          <Stack spacing={2} direction={'row'} alignItems={'center'}>
            <Stack spacing={1} direction={'row'} alignItems={'center'}>
              <Skeleton variant="circular" width={24} height={24}/>
              <Skeleton variant="rounded" width={42} height={24}/>
            </Stack>
            <Stack spacing={1} direction={'row'} alignItems={'center'}>
              <Skeleton variant="circular" width={24} height={24}/>
              <Skeleton variant="rounded" width={42} height={24}/>
            </Stack>
            <Stack spacing={1} direction={'row'} alignItems={'center'}>
              <Skeleton variant="circular" width={24} height={24}/>
              <Skeleton variant="rounded" width={42} height={24}/>
            </Stack>
            <Stack spacing={1} direction={'row'} alignItems={'center'}>
              <Skeleton variant="circular" width={24} height={24}/>
              <Skeleton variant="rounded" width={42} height={24}/>
            </Stack>
          </Stack>
        </Stack>
      </Box>
      <Skeleton variant='rectangular' width={'100%'} height={49}/>
    </Box>
  );
}

export default DummyTestCard;