import { AccountCircle, AdminPanelSettings, Assessment, Checklist, Logout, MenuBook, PersonAdd, Portrait, Quiz, VpnKey } from '@mui/icons-material';
import { AppBar, Box, Button, CircularProgress, Container, IconButton, Menu, MenuItem, Theme, Toolbar, Typography, useMediaQuery } from '@mui/material';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import ColourModeSwitch from '../shared/ColourModeSwitch';
import { StudentIcon } from '../shared/icons/StudentIcon';
import { TeacherIcon } from '../shared/icons/TeacherIcon';
import MenuIcon from '@mui/icons-material/Menu';
import MobileNavDrawer from './MobileNavDrawer/MobileNavDrawer';
import { SearchResult } from '@/app/types/types';
import DummyNavigationBar from './DummyNavigationBar/DummyNavigationBar';
import { ExamIcon } from '../shared/icons/ExamIcon';

const NavigationBar = ({
  theme,
  setSearchResults,
} : {
  theme: Theme;
  setSearchResults: Dispatch<SetStateAction<SearchResult | null>>
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const maxWidth720 = useMediaQuery('(max-width:720px)');
  const maxWidth815 = useMediaQuery('(max-width:815px)');
  
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [anchorElUserManagement, setAnchorElUserManagement] = useState<null | HTMLElement>(null);
  const [anchorElTest, setAnchorElTest] = useState<null | HTMLElement>(null);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);

  useEffect(() => {
    (!maxWidth720 || (session?.user.role === 'SUPERADMIN' && !maxWidth815)) && setOpenDrawer(false);
  }, [maxWidth720, maxWidth815]);

  const navigationUser = (url: string) => {
    router.push(url);
    setAnchorElUserManagement(null);
  }

  const navigationMyInfo = (url: string) => {
    router.push(url);
    setAnchorElUser(null);
  }
  
  if (status === 'loading') {
    return <DummyNavigationBar/>;
  } else if (status === 'unauthenticated' || !session || session.user.status !== 'APPROVED') {
    return <></>;
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
              (maxWidth720 || (session?.user.role === 'SUPERADMIN' && maxWidth815)) && session.user.role !== 'STUDENT' &&
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
              onClick={() => {
                setSearchResults(null);
                setOpenDrawer(false);
              }}
              paddingBottom={'2px'}
              sx={{
                mr: 2,
                display: 'flex',
                alignItems: 'center',
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
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '0px',
                  borderBottom: `2px solid ${pathname === '/vocabulary-list' ? 'rgba(255, 255, 255, 0.5)' : 'transparent'}`,
                  [`@media (max-width: ${session.user.role === "SUPERADMIN" ? '815px' : '720px'})`]: {
                    display: session.user.role === 'STUDENT' ? 'flex' : 'none',
                  }
                }}
                component={Link}
                href={'/vocabulary-list'}
              >
                단어장
              </Button>
              <Button
                sx={{ 
                  my: 2, 
                  color: 'white', 
                  borderRadius: '0px',
                  borderBottom: `2px solid ${pathname.includes('/mock-test') || pathname.includes('/test-venues') ? 'rgba(255, 255, 255, 0.5)' : 'transparent'}`,
                  [`@media (max-width: ${session.user.role === "SUPERADMIN" ? '815px' : '720px'})`]: {
                    display: session.user.role === 'STUDENT' ? 'flex' : 'none',
                  }
                }}
                onClick={(e) => setAnchorElTest(e.currentTarget)}
              >
                테스트
              </Button>
              <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElTest}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElTest)}
                onClose={() => setAnchorElTest(null)}
              >
                <MenuItem 
                  sx={{ backgroundColor: pathname.includes('/mock-test') ? theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : '#00000026' : 'transparent' }}
                  onClick={() => navigationUser('/mock-test')}
                  component={Link}
                  href={'/mock-test'}
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
                    <Quiz sx={{ mr: '4px' }}/>모의 테스트
                  </Typography>
                </MenuItem>
                <MenuItem 
                  sx={{ backgroundColor: pathname.includes('/test-venues') ? theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : '#00000026' : 'transparent' }}
                  onClick={() => navigationUser('/test-venues')}
                  component={Link}
                  href={'/test-venues'}
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
                    <ExamIcon style={{ height: '24px', width: '24px', marginRight: '4px' }}/>실전 테스트
                  </Typography>
                </MenuItem>
              </Menu>
              {
                (session.user.role !== 'STUDENT') &&
                <Button
                  sx={{ 
                    my: 2, 
                    color: 'white', 
                    borderRadius: '0px',
                    borderBottom: `2px solid ${pathname === '/request-management' ? 'rgba(255, 255, 255, 0.5)' : 'transparent'}`,
                    [`@media (max-width: ${session.user.role === "SUPERADMIN" ? '815px' : '720px'})`]: {
                      display: 'none',
                    }
                  }}
                  component={Link}
                  href={'/request-management'}
                >
                  요청 관리
                </Button>
              }
              {
                (session.user.role !== 'STUDENT') && 
                <Button
                  sx={{ 
                    my: 2, 
                    color: 'white', 
                    borderRadius: '0px',
                    borderBottom: `2px solid ${pathname.includes('/students') || pathname.includes('/teachers') || pathname.includes('/admins') || pathname.includes('/user-stats') ? 'rgba(255, 255, 255, 0.5)' : 'transparent'}`,
                    [`@media (max-width: ${session.user.role === "SUPERADMIN" ? '815px' : '720px'})`]: {
                      display: 'none',
                    }
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
                <MenuItem 
                  sx={{ backgroundColor: pathname.includes('/students') ? theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : '#00000026' : 'transparent' }}
                  onClick={() => navigationUser('/students')}
                  component={Link}
                  href={'/students'}
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
                  (session.user.role === 'SUPERADMIN' || session.user.role === 'ADMIN') &&
                  <MenuItem 
                    sx={{ backgroundColor: pathname.includes('/teachers') ? theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : '#00000026' : 'transparent' }}
                    onClick={() => navigationUser('/teachers')}
                    component={Link}
                    href={'/teachers'}
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
                  (session.user.role === 'SUPERADMIN' || session.user.role === 'ADMIN') &&
                  <MenuItem 
                    sx={{ backgroundColor: pathname.includes('/admins') ? theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : '#00000026' : 'transparent' }}
                    onClick={() => navigationUser('/admins')}
                    component={Link}
                    href={'/admins'}
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
                <MenuItem 
                  sx={{ backgroundColor: pathname.includes('/account-creation') ? theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : '#00000026' : 'transparent' }}
                  onClick={() => navigationUser('/account-creation')}
                  component={Link}
                  href={'/account-creation'}
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
                    <PersonAdd sx={{ mr: '4px' }}/>학생 계정 만들기
                  </Typography>
                </MenuItem>
                <MenuItem 
                  sx={{ backgroundColor: pathname.includes('/user-stats') ? theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : '#00000026' : 'transparent' }}
                  onClick={() => navigationUser('/user-stats')}
                  component={Link}
                  href={'/user-stats'}
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
                    <Assessment sx={{ mr: '4px' }}/>학생 통계
                  </Typography>
                </MenuItem>
              </Menu>
              {
                (session.user.role !== 'STUDENT') &&
                <Button
                  sx={{ 
                    my: 2, 
                    color: 'white', 
                    borderRadius: '0px',
                    borderBottom: `2px solid ${pathname === '/password-reset-request-management' ? 'rgba(255, 255, 255, 0.5)' : 'transparent'}`,
                    [`@media (max-width: ${session.user.role === "SUPERADMIN" ? '815px' : '720px'})`]: {
                      display: 'none',
                    }
                  }}
                  component={Link}
                  href={'/password-reset-request-management'}
                >
                  비밀번호 재설정 요청 관리
                </Button>
              }
              {
                session.user.role === "SUPERADMIN" &&
                <Button
                  sx={{ 
                    my: 2, 
                    color: 'white', 
                    borderRadius: '0px',
                    borderBottom: `2px solid ${pathname === '/data-migration' ? 'rgba(255, 255, 255, 0.5)' : 'transparent'}`,
                    [`@media (max-width: ${session.user.role === "SUPERADMIN" ? '815px' : '720px'})`]: {
                      display: 'none',
                    }
                  }}
                  component={Link}
                  href={'/data-migration'}
                >
                  데이터 마이그레이션
                </Button>
              }
            </Box>
            <Box display={'flex'} flexDirection={'row'} alignItems={'center'} sx={{ flexGrow: 0 }}>
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
                  sx={{ 
                    backgroundColor: pathname === '/profile' ? theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : '#00000026' : 'transparent',
                    '@media (max-width:720px)': {
                      fontSize: '0.875rem',
                      pt: '4px',
                      pb: '4px',
                      minHeight: '32px'
                    }
                  }}
                  onClick={() => navigationMyInfo('/profile')}
                  component={Link}
                  href={'/profile'}
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
                  sx={{ 
                    backgroundColor: pathname === '/password-change' ? theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : '#00000026' : 'transparent',
                    '@media (max-width:720px)': {
                      fontSize: '0.875rem',
                      pt: '4px',
                      pb: '4px',
                      minHeight: '32px'
                    }
                  }}
                  onClick={() => navigationMyInfo('/password-change')}
                  component={Link}
                  href={'/password-change'}
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
                  sx={{ 
                    backgroundColor: pathname === '/my-vocabulary-list' ? theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : '#00000026' : 'transparent',
                    '@media (max-width:720px)': {
                      fontSize: '0.875rem',
                      pt: '4px',
                      pb: '4px',
                      minHeight: '32px'
                    }
                  }}
                  onClick={() => navigationMyInfo('/my-vocabulary-list')}
                  component={Link}
                  href={'/my-vocabulary-list'}
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
                    <MenuBook sx={{ mr: '4px' }}/>나의 단어장
                  </Typography>
                </MenuItem>
                <MenuItem 
                  sx={{ 
                    backgroundColor: pathname === '/my-requests' ? theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : '#00000026' : 'transparent',
                    '@media (max-width:720px)': {
                      fontSize: '0.875rem',
                      pt: '4px',
                      pb: '4px',
                      minHeight: '32px'
                    }
                  }}
                  onClick={() => navigationMyInfo('/my-requests')}
                  component={Link}
                  href={'/my-requests'}
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
                  <MenuItem 
                    onClick={logOut}
                    sx={{
                      '@media (max-width:720px)': {
                      fontSize: '0.875rem',
                      pt: '4px',
                      pb: '4px',
                      minHeight: '32px'
                    }
                    }}
                  >
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
        (maxWidth720 || maxWidth815) && 
        <MobileNavDrawer 
          openDrawer={openDrawer} 
          setOpenDrawer={setOpenDrawer} 
          session={session} 
          pathname={pathname}
          theme={theme}
        />
      }
    </>
  );
}

export default NavigationBar;