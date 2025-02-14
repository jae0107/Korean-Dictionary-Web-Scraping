import { useThemeContext } from "@/app/components/Providers/Providers";
import { AdminIcon } from "@/app/components/shared/icons/AdminIcon";
import { HipTeacherIcon } from "@/app/components/shared/icons/HipTeacherIcon";
import { StudentIcon } from "@/app/components/shared/icons/StudentIcon";
import { UserRole } from "@/app/generated/gql/graphql";
import { AccountBox } from "@mui/icons-material";
import { Box, Button, Skeleton, Stack, Typography } from "@mui/material";

const DummyUserForm = ({
  userType,
  loading,
  role,
} : {
  userType: string;
  loading: boolean;
  role: UserRole;
}) => {
  const theme = useThemeContext();
  
  const getIcon = () => {
    if (userType === '학생') {
      return (
        <Box 
          display={'flex'} 
          alignItems={'center'} 
          justifyContent={'center'}
          bgcolor={theme?.palette.mode === 'dark'  ? theme?.palette.info.dark : theme?.palette.info.light}
          borderRadius={'5px'}
          marginRight={1}
        >
          <StudentIcon style={{ width: '40px', height: '40px', color: '#fff' }}/>
        </Box>
      );
    } else if (userType === '선생님') {
      return (
        <Box 
          display={'flex'} 
          alignItems={'center'} 
          justifyContent={'center'}
          bgcolor={theme?.palette.mode === 'dark'  ? theme?.palette.info.dark : theme?.palette.info.light}
          borderRadius={'5px'}
          marginRight={1}
        >
          <HipTeacherIcon style={{ width: '40px', height: '40px', color: '#fff', padding: '5px' }}/>
        </Box>
      );
    } else if (userType === '관리자') {
      return (
        <Box 
          display={'flex'} 
          alignItems={'center'} 
          justifyContent={'center'}
          bgcolor={theme?.palette.mode === 'dark'  ? theme?.palette.info.dark : theme?.palette.info.light}
          borderRadius={'5px'}
          marginRight={1}
        >
          <AdminIcon style={{ width: '40px', height: '40px', color: '#fff', padding: '3px' }}/>
        </Box>
      );
    }
    return <AccountBox color='info' sx={{ width: '40px', height: '40px' }}/>;
  }

  return (
    <Stack spacing={4} width={'300px'} mt={2} alignSelf={'center'}>  
      <Box display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'}>
        <Box display={'flex'} flexDirection={'row'} alignItems={'center'}>
          {getIcon()}
          <Typography variant="h5">{`${userType} 프로필`}</Typography>
        </Box>
      </Box>
      {loading && 
        <Stack spacing={2}>
          <Skeleton variant="rounded" height={56} />
          <Skeleton variant="rounded" height={56} />
          <Skeleton variant="rounded" height={56} />
          <Skeleton variant="rounded" height={56} />
          <Skeleton variant="rounded" height={56} />
          {role === 'STUDENT' && <Skeleton variant="rounded" height={56} />}
        </Stack>
      }
    </Stack>
  );
}

export default DummyUserForm;