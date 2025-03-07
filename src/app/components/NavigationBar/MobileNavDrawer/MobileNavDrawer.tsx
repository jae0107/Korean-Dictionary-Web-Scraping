import { NetworkStatus } from "@apollo/client";
import { AdminPanelSettings, Chat, Groups, MenuBook, RestartAlt } from "@mui/icons-material";
import { Box, CircularProgress, Divider, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Skeleton, Theme } from "@mui/material";
import { Session } from "next-auth";
import Link from "next/link";
import { StudentIcon } from "../../shared/icons/StudentIcon";
import { TeacherIcon } from "../../shared/icons/TeacherIcon";

const MobileNavDrawer = ({
  openDrawer,
  setOpenDrawer,
  loading,
  session,
  myRole,
  networkStatus,
  pathname,
  theme,
} : {
  openDrawer: boolean;
  setOpenDrawer: (open: boolean) => void;
  loading: boolean;
  session: Session;
  myRole: string;
  networkStatus: number;
  pathname: string;
  theme: Theme;
}) => {
  const getDisplay = (show: boolean) => {
    return loading || networkStatus === NetworkStatus.refetch || show ? 'block' : 'none';
  }

  return (
    <Drawer 
      open={openDrawer} 
      onClose={() => setOpenDrawer(false)} 
      sx={{ 
        marginTop: '56px',
        '& .MuiDrawer-paper': { marginTop: '56px' },
        '& .MuiModal-backdrop': {
          opacity: '0 !important',
          marginTop: '56px',  
        },
      }}
    >
      <Box role="presentation" onClick={() => setOpenDrawer(false)}>
        <List>
          <ListItem disablePadding sx={{ backgroundColor: pathname === '/vocabulary-list' ? theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : '#00000026' : 'transparent' }}>
            <ListItemButton LinkComponent={Link} href={'/vocabulary-list'}>
              <ListItemIcon>
                <MenuBook/>
              </ListItemIcon>
              <ListItemText primary={'단어장'} />
            </ListItemButton>
          </ListItem>
        </List>
        <Divider />
        {
          (session.user.role !== 'STUDENT' || myRole !== 'STUDENT') &&
          <>
            <List sx={{ display: getDisplay(!!myRole && myRole !== 'STUDENT') }}>
              <ListItem disablePadding sx={{ backgroundColor: pathname === '/request-management' ? theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : '#00000026' : 'transparent' }}>
                <ListItemButton LinkComponent={Link} href={'/request-management'}>
                  <ListItemIcon>
                    {loading ? <CircularProgress color='inherit' sx={{ width: '20px !important', height: '20px  !important' }}/> : <Chat/>}
                  </ListItemIcon>
                  {loading ? <Skeleton variant="rounded" height={'24px'} width={'74.55px'}/> : <ListItemText primary={'요청 관리'} />}
                </ListItemButton>
              </ListItem>
            </List>
            <Divider />
            <List sx={{ display: getDisplay(!!myRole && myRole !== 'STUDENT') }}>
              <ListItem disablePadding>
                <ListItemButton LinkComponent={Link} href={'/students'}>
                  <ListItemIcon>
                    {loading ? <CircularProgress color='inherit' sx={{ width: '20px !important', height: '20px  !important' }}/> : <Groups/>}
                  </ListItemIcon>
                  {loading ? <Skeleton variant="rounded" height={'24px'} width={'74.55px'}/> : <ListItemText primary={'사용자 관리'} />}
                </ListItemButton>
              </ListItem>
              <List disablePadding>
                <ListItem disablePadding sx={{backgroundColor: pathname.includes('/students') ? theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : '#00000026' : 'transparent' }}>
                  <ListItemButton LinkComponent={Link} href={'/students'} sx={{ pl: '40px !important' }}>
                    <ListItemIcon>
                      {loading ? <CircularProgress color='inherit' sx={{ width: '20px !important', height: '20px  !important' }}/> : <StudentIcon style={{ height: '24px', width: '24px' }}/>}
                    </ListItemIcon>
                    {loading ? <Skeleton variant="rounded" height={'24px'} width={'50.55px'}/> : <ListItemText primary={'학생'} />}
                  </ListItemButton>
                </ListItem>
                {
                  myRole && (myRole === 'SUPERADMIN' || myRole === 'ADMIN') &&
                  <ListItem disablePadding sx={{ backgroundColor: pathname.includes('/teachers') ? theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : '#00000026' : 'transparent' }}>
                    <ListItemButton LinkComponent={Link} href={'/teachers'} sx={{ pl: '40px !important' }}>
                      <ListItemIcon>
                        {loading ? <CircularProgress color='inherit' sx={{ width: '20px !important', height: '20px  !important' }}/> : <TeacherIcon style={{ height: '24px', width: '24px' }}/>}
                      </ListItemIcon>
                      {loading ? <Skeleton variant="rounded" height={'24px'} width={'50.55px'}/> : <ListItemText primary={'선생님'} />}
                    </ListItemButton>
                  </ListItem>
                }
               { 
                  myRole && (myRole === 'SUPERADMIN' || myRole === 'ADMIN') &&
                  <ListItem disablePadding sx={{ backgroundColor: pathname.includes('/admins') ? theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : '#00000026' : 'transparent' }}>
                    <ListItemButton LinkComponent={Link} href={'/admins'} sx={{ pl: '40px !important' }}>
                      <ListItemIcon>
                        {loading ? <CircularProgress color='inherit' sx={{ width: '20px !important', height: '20px  !important' }}/> : <AdminPanelSettings style={{ height: '24px', width: '24px' }}/>}
                      </ListItemIcon>
                      {loading ? <Skeleton variant="rounded" height={'24px'} width={'50.55px'}/> : <ListItemText primary={'관리자'} />}
                    </ListItemButton>
                  </ListItem>
                }
              </List>
            </List>
            <Divider />
            <List>
              <ListItem disablePadding sx={{ backgroundColor: pathname === '/password-reset-request-management' ? theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : '#00000026' : 'transparent' }}>
                <ListItemButton LinkComponent={Link} href={'/password-reset-request-management'}>
                  <ListItemIcon>
                    <RestartAlt/>
                  </ListItemIcon>
                  <ListItemText primary={'비밀번호 재설정 요청 관리'} />
                </ListItemButton>
              </ListItem>
            </List>
          </>
        }
      </Box>
    </Drawer>
  );
}

export default MobileNavDrawer;