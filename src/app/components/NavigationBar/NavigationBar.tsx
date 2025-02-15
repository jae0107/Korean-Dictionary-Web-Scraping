import { useCurrentUser } from '@/app/hooks/useCurrentUser';
import { NetworkStatus } from '@apollo/client';
import { AccountCircle, AdminPanelSettings, Checklist, Logout, Portrait, School, VpnKey } from '@mui/icons-material';
import { AppBar, Box, Button, CircularProgress, Container, IconButton, Menu, MenuItem, Theme, Toolbar, Typography, useMediaQuery } from '@mui/material';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import ColourModeSwitch from '../shared/ColourModeSwitch';
import { StudentIcon } from '../shared/icons/StudentIcon';
import { TeacherIcon } from '../shared/icons/TeacherIcon';
import MenuIcon from '@mui/icons-material/Menu';
import MobileNavDrawer from './MobileNavDrawer/MobileNavDrawer';

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
  const { userRole, refetch, loading, networkStatus } = useCurrentUser();
  const { data: session } = useSession();
  const maxWidth424 = useMediaQuery('(max-width:424px)');
  
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [anchorElUserManagement, setAnchorElUserManagement] = useState<null | HTMLElement>(null);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);

  useEffect(() => {
    if (session) {
      refetch();
    }
  }, [session, refetch]);

  useEffect(() => {
    !maxWidth424 && setOpenDrawer(false);
  }, [maxWidth424]);

  const navigationUser = (url: string) => {
    router.push(url);
    setAnchorElUserManagement(null);
  }

  const navigationMyInfo = (url: string) => {
    router.push(url);
    setAnchorElUser(null);
  }

  if (!session) {
    return <></>;
  }

  const getDisplay = (show: boolean) => {
    if (loading || networkStatus === NetworkStatus.refetch) return 'inline-flex';
    if (show) return 'block';
    return 'none';
  }

  const logOut = async () => {
    setLogoutLoading(true);
    await signOut({ callbackUrl: '/signin' });
    setLogoutLoading(false);
    setAnchorElUser(null);
  }
  
  return (
    <>
      <AppBar position="static" sx={{ mb: 2 }}>
        <Container sx={{ maxWidth: 'unset !important' }}>
          <Toolbar disableGutters>
            {
              maxWidth424 &&
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={() => setOpenDrawer(!openDrawer)}
              >
                <MenuIcon />
              </IconButton>
            }
            <Typography
              variant="h6"
              noWrap
              component={Link}
              href={'/home'}
              onClick={() => setOpenDrawer(false)}
              sx={{
                mr: 2,
                display: 'flex',
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                cursor: 'pointer',
                textDecoration: 'none',
              }}
            >
              Home
            </Typography>
            <Box sx={{ flexGrow: 1, display: 'flex' }}>
              <Button
                sx={{ 
                  my: 2, 
                  color: 'white', 
                  display: maxWidth424 ? 'none' : 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '0px',
                  borderBottom: `2px solid ${pathname === '/vocabulary-list' ? 'rgba(255, 255, 255, 0.5)' : 'transparent'}`,
                }}
                component={Link}
                href={'/vocabulary-list'}
              >
                단어장
              </Button>
              {
                (session.user.role !== 'STUDENT' || userRole !== 'STUDENT') &&
                <Button
                  sx={{ 
                    my: 2, 
                    color: 'white', 
                    display: maxWidth424 ? 'none' : getDisplay(!!userRole && userRole !== 'STUDENT'),
                    borderRadius: '0px',
                    borderBottom: `2px solid ${pathname === '/request-management' ? 'rgba(255, 255, 255, 0.5)' : 'transparent'}`,
                  }}
                  loading={loading}
                  component={Link}
                  href={'/request-management'}
                >
                  요청 관리
                </Button>
              }
              {
                (session.user.role !== 'STUDENT' || userRole !== 'STUDENT') && 
                <Button
                  sx={{ 
                    my: 2, 
                    color: 'white', 
                    display: maxWidth424 ? 'none' : getDisplay(!!userRole && userRole !== 'STUDENT'),
                    borderRadius: '0px',
                    borderBottom: `2px solid ${pathname.includes('/students') || pathname.includes('/teachers') || pathname.includes('/admins') ? 'rgba(255, 255, 255, 0.5)' : 'transparent'}`,
                  }}
                  loading={loading}
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
                <MenuItem 
                  sx={{ backgroundColor: pathname.includes('/students') ? theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : '#00000026' : 'transparent' }}
                  onClick={() => navigationUser('/students')}
                >
                  <Typography 
                    sx={{ 
                      textAlign: 'center', 
                      color: 'inherit', 
                      cursor: 'pointer',
                    }} 
                    display={'flex'}
                    alignItems={'center'}
                  >
                    <StudentIcon style={{ height: '24px', width: '24px', marginRight: '4px' }}/>학생
                  </Typography>
                </MenuItem>
                {
                  userRole && (userRole === 'SUPERADMIN' || userRole === 'ADMIN') &&
                  <MenuItem 
                    sx={{ backgroundColor: pathname.includes('/teachers') ? theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : '#00000026' : 'transparent' }}
                    onClick={() => navigationUser('/teachers')}
                  >
                    <Typography 
                      sx={{ 
                        textAlign: 'center', 
                        color: 'inherit', 
                        cursor: 'pointer',
                      }} 
                      display={'flex'}
                      alignItems={'center'}
                    >
                      <TeacherIcon style={{ height: '24px', width: '24px', marginRight: '4px' }}/>선생님
                    </Typography>
                  </MenuItem>
                }
                {
                  userRole && (userRole === 'SUPERADMIN' || userRole === 'ADMIN') &&
                  <MenuItem 
                    sx={{ backgroundColor: pathname.includes('/admins') ? theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : '#00000026' : 'transparent' }}
                    onClick={() => navigationUser('/admins')}
                  >
                    <Typography 
                      sx={{ 
                        textAlign: 'center', 
                        color: 'inherit', 
                        cursor: 'pointer',
                      }}
                      display={'flex'}
                      alignItems={'center'}
                    >
                      <AdminPanelSettings sx={{ mr: '4px' }}/>관리자
                    </Typography>
                  </MenuItem>
                }
              </Menu>
            </Box>
            <Box sx={{ flexGrow: 0 }}>
              <ColourModeSwitch margin='0 16px 0 0'/>
              <IconButton 
                onClick={(e) => {
                  setOpenDrawer(false);
                  setAnchorElUser(e.currentTarget);
                }} 
                sx={{ p: 0 }}
              >
                <AccountCircle />
              </IconButton>
              <Menu
                sx={{ mt: '45px' }}
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
                <MenuItem 
                  sx={{ backgroundColor: pathname === '/profile' ? theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : '#00000026' : 'transparent' }}
                  onClick={() => navigationMyInfo('/profile')}
                
                >
                  <Typography 
                    sx={{ 
                      textAlign: 'center', 
                      color: 'inherit', 
                      cursor: 'pointer' 
                    }}
                    display={'flex'}
                    alignItems={'center'}
                  >
                    <Portrait sx={{ mr: '4px' }}/>프로필
                  </Typography>
                </MenuItem>
                <MenuItem 
                  sx={{ backgroundColor: pathname === '/password-change' ? theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : '#00000026' : 'transparent' }}
                  onClick={() => navigationMyInfo('/password-change')}
                
                >
                  <Typography 
                    sx={{ 
                      textAlign: 'center', 
                      color: 'inherit', 
                      cursor: 'pointer' 
                    }}
                    display={'flex'}
                    alignItems={'center'}
                  >
                    <VpnKey sx={{ mr: '4px' }}/>비밀번호 변경
                  </Typography>
                </MenuItem>
                <MenuItem 
                  sx={{ backgroundColor: pathname === '/my-requests' ? theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : '#00000026' : 'transparent' }}
                  onClick={() => navigationMyInfo('/my-requests')}
                
                >
                  <Typography 
                    sx={{ 
                      textAlign: 'center', 
                      color: 'inherit', 
                      cursor: 'pointer',
                    }}
                    display={'flex'}
                    alignItems={'center'}
                  >
                    <Checklist sx={{ mr: '4px' }}/>나의 요청
                  </Typography>
                </MenuItem>
                {
                  session &&
                  <MenuItem onClick={logOut}>
                    {
                      logoutLoading ?
                      <CircularProgress color='inherit' sx={{ width: '20px !important', height: '20px !important' }}/> :
                      <Typography 
                        sx={{ textAlign: 'center' }}
                        display={'flex'}
                        alignItems={'center'}
                      >
                        <Logout sx={{ mr: '4px' }}/>로그아웃
                      </Typography>
                    }
                  </MenuItem>
                }
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      {
        maxWidth424 && 
        <MobileNavDrawer 
          openDrawer={openDrawer} 
          setOpenDrawer={setOpenDrawer} 
          loading={loading} 
          session={session} 
          userRole={userRole} 
          networkStatus={networkStatus}
          pathname={pathname}
          theme={theme}
        />
      }
    </>
  );
}

export default NavigationBar;