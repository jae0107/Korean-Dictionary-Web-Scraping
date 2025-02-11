import { useCurrentUser } from '@/app/hooks/useCurrentUser';
import { AccountCircle } from '@mui/icons-material';
import { AppBar, Box, Button, Container, FormControlLabel, IconButton, Menu, MenuItem, styled, Switch, Theme, Toolbar, Tooltip, Typography } from '@mui/material'
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

const MaterialUISwitch = styled(Switch)(({ theme }) => ({
  width: 62,
  height: 34,
  padding: 7,
  '& .MuiSwitch-switchBase': {
    margin: 1,
    padding: 0,
    transform: 'translateX(6px)',
    '&.Mui-checked': {
      color: '#fff',
      transform: 'translateX(22px)',
      '& .MuiSwitch-thumb:before': {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
          '#fff',
        )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
      },
      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: '#aab4be',
        ...theme.applyStyles('dark', {
          backgroundColor: '#8796A5',
        }),
      },
    },
  },
  '& .MuiSwitch-thumb': {
    backgroundColor: '#001e3c',
    width: 32,
    height: 32,
    '&::before': {
      content: "''",
      position: 'absolute',
      width: '100%',
      height: '100%',
      left: 0,
      top: 0,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
        '#fff',
      )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
    },
    ...theme.applyStyles('dark', {
      backgroundColor: '#003892',
    }),
  },
  '& .MuiSwitch-track': {
    opacity: 1,
    backgroundColor: '#aab4be',
    borderRadius: 20 / 2,
    ...theme.applyStyles('dark', {
      backgroundColor: '#8796A5',
    }),
  },
}));

const NavigationBar = ({
  theme,
  colorMode,
} : {
  theme: Theme;
  colorMode: {
    toggleColorMode: () => void;
  }
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const { userRole } = useCurrentUser();
  
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [anchorElUserManagement, setAnchorElUserManagement] = useState<null | HTMLElement>(null);

  const navigationUser = (url: string) => {
    router.push(url);
    setAnchorElUserManagement(null);
  }

  const navigationMyInfo = (url: string) => {
    router.push(url);
    setAnchorElUser(null);
  }
  
  return (
    <AppBar position="static" sx={{ mb: 2 }}>
      <Container sx={{ maxWidth: 'unset !important' }}>
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            onClick={() => router.push('/home')}
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              cursor: 'pointer',
            }}
          >
            Home
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            <Button
              sx={{ 
                my: 2, 
                color: 'white', 
                display: 'block',
                borderRadius: '0px',
                borderBottom: `2px solid ${pathname === '/vocabulary-list' ? 'rgba(255, 255, 255, 0.5)' : 'transparent'}`,
              }}
              onClick={() => router.push('/vocabulary-list')}
            >
              단어장
            </Button>
            {
              userRole && userRole !== 'STUDENT' && 
              <Button
                sx={{ 
                  my: 2, 
                  color: 'white', 
                  display: 'block',
                  borderRadius: '0px',
                  borderBottom: `2px solid ${pathname === '/request-management' ? 'rgba(255, 255, 255, 0.5)' : 'transparent'}`,
                }}
                onClick={() => router.push('/request-management')}
              >
                요청 관리
              </Button>
            }
            {
              userRole && userRole !== 'STUDENT' && 
              <Button
                sx={{ 
                  my: 2, 
                  color: 'white', 
                  display: 'block',
                  borderRadius: '0px',
                  borderBottom: `2px solid ${pathname.includes('/students') || pathname.includes('/teachers') || pathname.includes('/admins') ? 'rgba(255, 255, 255, 0.5)' : 'transparent'}`,
                }}
                onClick={(e) => setAnchorElUserManagement(e.currentTarget)}
              >
                사용자 관리
              </Button>
            }
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUserManagement}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUserManagement)}
              onClose={() => setAnchorElUserManagement(null)}
            >
              <MenuItem sx={{ backgroundColor: pathname.includes('/students') ? theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : '#00000026' : 'transparent' }}>
                <Typography sx={{ 
                    textAlign: 'center', 
                    color: 'inherit', 
                    cursor: 'pointer',
                  }} 
                  onClick={() => navigationUser('/students')}
                >
                  학생
                </Typography>
              </MenuItem>
              {
                userRole === 'SUPERADMIN' || userRole === 'ADMIN' &&
                <MenuItem sx={{ backgroundColor: pathname.includes('/teachers') ? theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : '#00000026' : 'transparent' }}>
                  <Typography sx={{ 
                      textAlign: 'center', 
                      color: 'inherit', 
                      cursor: 'pointer',
                    }} 
                    onClick={() => navigationUser('/teachers')}
                  >
                    선생님
                  </Typography>
                </MenuItem>
              }
              {
                userRole === 'SUPERADMIN' || userRole === 'ADMIN' &&
                <MenuItem sx={{ backgroundColor: pathname.includes('/admins') ? theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : '#00000026' : 'transparent' }}>
                  <Typography sx={{ 
                      textAlign: 'center', 
                      color: 'inherit', 
                      cursor: 'pointer',
                    }} 
                    onClick={() => navigationUser('/admins')}
                  >
                    관리자
                  </Typography>
                </MenuItem>
              }
            </Menu>
          </Box>
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title={theme.palette.mode === 'dark' ? '라이트 모드' : '다크 모드'}>
              <FormControlLabel
                control={<MaterialUISwitch sx={{ m: 1 }} onChange={colorMode.toggleColorMode} />}
                label={''}
              />
            </Tooltip>
            <IconButton onClick={(e) => setAnchorElUser(e.currentTarget)} sx={{ p: 0 }}>
              <AccountCircle />
            </IconButton>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={() => setAnchorElUser(null)}
            >
              <MenuItem sx={{ backgroundColor: pathname === '/profile' ? theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : '#00000026' : 'transparent' }}>
                <Typography 
                  sx={{ 
                    textAlign: 'center', 
                    color: 'inherit', 
                    cursor: 'pointer' 
                  }} 
                  onClick={() => navigationMyInfo('/profile')}
                  >
                    프로필
                  </Typography>
              </MenuItem>
              <MenuItem sx={{ backgroundColor: pathname === '/my-requests' ? theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : '#00000026' : 'transparent' }}>
                <Typography 
                  sx={{ 
                    textAlign: 'center', 
                    color: 'inherit', 
                    cursor: 'pointer',
                  }} 
                  onClick={() => navigationMyInfo('/my-requests')}
                >
                  나의 요청
                </Typography>
              </MenuItem>
              <MenuItem>
                <Typography sx={{ textAlign: 'center' }}>로그아웃</Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default NavigationBar;