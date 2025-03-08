import { AppBar, Box, Button, Container, Skeleton, Toolbar } from '@mui/material';

const DummyNavigationBar = () => {
  return (
    <AppBar position="static" sx={{ mb: 2 }}>
      <Container sx={{ maxWidth: 'unset !important' }}>
        <Toolbar disableGutters>
          <Skeleton variant="rounded" height={32} width={67} sx={{ mr: 2 }}/>
          <Box sx={{ flexGrow: 1, display: 'flex' }}>
            <Box 
              width={64} 
              height={38.5} 
              display={'flex'} 
              alignItems={'center'} 
              justifyContent={'center'} 
              sx={{ 
                my: 2, 
                '@media (max-width: 620px)': { 
                  display: 'none' 
                } 
              }}
              >
              <Skeleton 
                variant="rounded" 
                height={24.5} 
                width={48}
                sx={{
                  my: 2,
                  '@media (max-width: 620px)': {
                    display: 'none',
                  }
                }}
              />
            </Box>
            <Box 
              width={70} 
              height={38.5} 
              display={'flex'} 
              alignItems={'center'} 
              justifyContent={'center'} 
              sx={{ 
                my: 2, 
                '@media (max-width: 620px)': { 
                  display: 'none' 
                } 
              }}
              >
              <Skeleton 
                variant="rounded" 
                height={24.5} 
                width={54}
                sx={{
                  my: 2,
                  '@media (max-width: 620px)': {
                    display: 'none',
                  }
                }}
              />
            </Box>
            <Box 
              width={83} 
              height={38.5} 
              display={'flex'} 
              alignItems={'center'} 
              justifyContent={'center'} 
              sx={{ 
                my: 2, 
                '@media (max-width: 620px)': { 
                  display: 'none' 
                } 
              }}
              >
              <Skeleton 
                variant="rounded" 
                height={24.5} 
                width={67}
                sx={{
                  my: 2,
                  '@media (max-width: 620px)': {
                    display: 'none',
                  }
                }}
              />
            </Box>
            <Box 
              width={166} 
              height={38.5} 
              display={'flex'} 
              alignItems={'center'} 
              justifyContent={'center'} 
              sx={{ 
                my: 2, 
                '@media (max-width: 620px)': { 
                  display: 'none' 
                } 
              }}
              >
              <Skeleton 
                variant="rounded" 
                height={24.5} 
                width={150}
                sx={{
                  my: 2,
                  '@media (max-width: 620px)': {
                    display: 'none',
                  }
                }}
              />
            </Box>
          </Box>
          <Box display={'flex'} flexDirection={'row'} alignItems={'center'} sx={{ flexGrow: 0, }}>
            <Skeleton 
              variant="rounded" 
              height={34} 
              width={62}
              sx={{ mr: 2 }}
            />
            <Skeleton variant='circular' height={24} width={24}/>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default DummyNavigationBar;