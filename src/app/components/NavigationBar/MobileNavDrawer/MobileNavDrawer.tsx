import { AdminPanelSettings, Chat, Groups, MenuBook, Quiz, RestartAlt, Storage } from "@mui/icons-material";
import { Box, Divider, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Theme } from "@mui/material";
import { Session } from "next-auth";
import Link from "next/link";
import { StudentIcon } from "../../shared/icons/StudentIcon";
import { TeacherIcon } from "../../shared/icons/TeacherIcon";
import { ExamIcon } from "../../shared/icons/ExamIcon";
import { TestIcon } from "../../shared/icons/TestIcon";

const MobileNavDrawer = ({
  openDrawer,
  setOpenDrawer,
  session,
  pathname,
  theme,
} : {
  openDrawer: boolean;
  setOpenDrawer: (open: boolean) => void;
  session: Session;
  pathname: string;
  theme: Theme;
}) => {
  return (
    <Drawer 
      open={openDrawer} 
      onClose={() => setOpenDrawer(false)} 
      sx={{ 
        marginTop: '56px',
        '& .MuiDrawer-paper': { 
          marginTop: '56px' 
        },
        '& .MuiModal-backdrop': {
          opacity: '0 !important',
          marginTop: '56px',  
        },
        '@media (max-width: 815px)': {
          '& .MuiDrawer-paper': { 
            marginTop: '64px' 
          }
        },
        '@media (max-width: 599px)': {
          '& .MuiDrawer-paper': { 
            marginTop: '56px' 
          }
        }
      }}
    >
      <Box role="presentation" onClick={() => setOpenDrawer(false)}>
        <List>
          <ListItem disablePadding sx={{ backgroundColor: pathname === '/vocabulary-list' ? theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : '#00000026' : 'transparent' }}>
            <ListItemButton LinkComponent={Link} href={'/vocabulary-list'} sx={{ pb: '2px', pt: '2px' }}>
              <ListItemIcon>
                <MenuBook/>
              </ListItemIcon>
              <ListItemText primary={'단어장'}/>
            </ListItemButton>
          </ListItem>
        </List>
        <Divider />
        <List>
          <ListItem disablePadding>
            <ListItemButton LinkComponent={Link} href={'/mock-test'} sx={{ pb: '2px', pt: '2px' }}>
              <ListItemIcon>
                <TestIcon style={{ height: '24px', width: '24px' }}/>
              </ListItemIcon>
              <ListItemText primary={'테스트'} />
            </ListItemButton>
          </ListItem>
          <List disablePadding>
            <ListItem disablePadding sx={{backgroundColor: pathname.includes('/mock-test') ? theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : '#00000026' : 'transparent' }}>
              <ListItemButton LinkComponent={Link} href={'/mock-test'} sx={{ pl: '40px !important', pb: '2px', pt: '2px' }}>
                <ListItemIcon>
                  <Quiz/>
                </ListItemIcon>
                <ListItemText primary={'모의 테스트'} />
              </ListItemButton>
            </ListItem>
          </List>
          <List disablePadding>
            <ListItem disablePadding sx={{backgroundColor: pathname.includes('/test-venues') ? theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : '#00000026' : 'transparent' }}>
              <ListItemButton LinkComponent={Link} href={'/test-venues'} sx={{ pl: '40px !important', pb: '2px', pt: '2px' }}>
                <ListItemIcon>
                  <ExamIcon style={{ height: '26px', width: '26px' }}/>
                </ListItemIcon>
                <ListItemText primary={'실전 테스트'} />
              </ListItemButton>
            </ListItem>
          </List>
        </List>
        <Divider />
        {
          (session.user.role !== 'STUDENT') &&
          <>
            <List>
              <ListItem disablePadding sx={{ backgroundColor: pathname === '/request-management' ? theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : '#00000026' : 'transparent' }}>
                <ListItemButton LinkComponent={Link} href={'/request-management'} sx={{ pb: '2px', pt: '2px' }}>
                  <ListItemIcon>
                    <Chat/>
                  </ListItemIcon>
                  <ListItemText primary={'요청 관리'} />
                </ListItemButton>
              </ListItem>
            </List>
            <Divider />
            <List>
              <ListItem disablePadding>
                <ListItemButton LinkComponent={Link} href={'/students'} sx={{ pb: '2px', pt: '2px' }}>
                  <ListItemIcon>
                    <Groups/>
                  </ListItemIcon>
                  <ListItemText primary={'사용자 관리'} />
                </ListItemButton>
              </ListItem>
              <List disablePadding>
                <ListItem disablePadding sx={{backgroundColor: pathname.includes('/students') ? theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : '#00000026' : 'transparent' }}>
                  <ListItemButton LinkComponent={Link} href={'/students'} sx={{ pl: '40px !important', pb: '2px', pt: '2px' }}>
                    <ListItemIcon>
                      <StudentIcon style={{ height: '24px', width: '24px' }}/>
                    </ListItemIcon>
                    <ListItemText primary={'학생'} />
                  </ListItemButton>
                </ListItem>
                {
                  (session.user.role === 'SUPERADMIN' || session.user.role === 'ADMIN') &&
                  <ListItem disablePadding sx={{ backgroundColor: pathname.includes('/teachers') ? theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : '#00000026' : 'transparent' }}>
                    <ListItemButton LinkComponent={Link} href={'/teachers'} sx={{ pl: '40px !important', pb: '2px', pt: '2px' }}>
                      <ListItemIcon>
                        <TeacherIcon style={{ height: '24px', width: '24px' }}/>
                      </ListItemIcon>
                      <ListItemText primary={'선생님'} />
                    </ListItemButton>
                  </ListItem>
                }
               { 
                  (session.user.role === 'SUPERADMIN' || session.user.role === 'ADMIN') &&
                  <ListItem disablePadding sx={{ backgroundColor: pathname.includes('/admins') ? theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : '#00000026' : 'transparent' }}>
                    <ListItemButton LinkComponent={Link} href={'/admins'} sx={{ pl: '40px !important', pb: '2px', pt: '2px' }}>
                      <ListItemIcon>
                        <AdminPanelSettings style={{ height: '24px', width: '24px' }}/>
                      </ListItemIcon>
                      <ListItemText primary={'관리자'} />
                    </ListItemButton>
                  </ListItem>
                }
              </List>
            </List>
            <Divider />
            <List>
              <ListItem disablePadding sx={{ backgroundColor: pathname === '/password-reset-request-management' ? theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : '#00000026' : 'transparent' }}>
                <ListItemButton LinkComponent={Link} href={'/password-reset-request-management'} sx={{ pb: '2px', pt: '2px' }}>
                  <ListItemIcon>
                    <RestartAlt/>
                  </ListItemIcon>
                  <ListItemText primary={'비밀번호 재설정 요청 관리'} />
                </ListItemButton>
              </ListItem>
            </List>
            {
              session.user.role === "SUPERADMIN" &&
              <>
                <Divider />
                <List>
                  <ListItem disablePadding sx={{ backgroundColor: pathname === '/data-migration' ? theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : '#00000026' : 'transparent' }}>
                    <ListItemButton LinkComponent={Link} href={'/data-migration'} sx={{ pb: '2px', pt: '2px' }}>
                      <ListItemIcon>
                        <Storage/>
                      </ListItemIcon>
                      <ListItemText primary={'데이터 마이그레이션'} />
                    </ListItemButton>
                  </ListItem>
                </List>
              </>
            }
          </>
        }
      </Box>
    </Drawer>
  );
}

export default MobileNavDrawer;