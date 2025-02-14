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
  return (
    <Stack spacing={4} width={'300px'} mt={2} alignSelf={'center'}>  
      <Box display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'}>
        <Box display={'flex'} flexDirection={'row'} alignItems={'center'}>
          <AccountBox color='info' sx={{ mr: 1, width: '40px', height: '40px' }}/>
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