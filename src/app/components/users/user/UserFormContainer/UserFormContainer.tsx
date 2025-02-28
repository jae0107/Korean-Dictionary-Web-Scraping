import { AccountBox } from "@mui/icons-material";
import { Box, Stack, Typography } from "@mui/material";
import UserForm from "./UserForm/UserForm";
import { UserInput, UserRole } from "@/app/generated/gql/graphql";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { StudentIcon } from "@/app/components/shared/icons/StudentIcon";
import { useThemeContext } from "@/app/components/Providers/Providers";
import { HipTeacherIcon } from "@/app/components/shared/icons/HipTeacherIcon";
import { AdminIcon } from "@/app/components/shared/icons/AdminIcon";

const UserFormContainer = ({
  id,
  defaultValues,
  userType,
  refetch,
} : {
  id: string;
  defaultValues: UserInput;
  userType: string;
  refetch: () => void;
}) => {
  const theme = useThemeContext();
  
  const [editMode, setEditMode] = useState(false);
  const [getRole, setRole] = useState<UserRole>(defaultValues.role || UserRole.Student);

  const schema = z.object({
    name: z.string().nonempty({ message: "이름을 작성하십시오." }),
    accountId: z
      .string()
      .nonempty({ message: "아이디를 작성하십시오." })
      .min(4, { message: "아이디는 최소 4자 이상이어야 합니다." })
      .max(20, { message: "아이디는 최대 20자 이하여야 합니다." })
      .regex(/^[a-zA-Z0-9_]+$/, { message: "아이디는 영문, 숫자, 밑줄(_)만 포함할 수 있습니다." }),
    email: z.string().optional()
      .refine((email) => {
        if (getRole !== UserRole.Student) {
          if (email === null || email === undefined || email.trim() === "") {
            return false;
          }
        }
        return true;
      },{ message: "이메일을 작성하십시오."})
      .refine((email) => {
        if (getRole !== UserRole.Student && email) {
          if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
            return false;
          }
        }
        return true;
      },{ message: "이메일 형식이 올바르지 않습니다." }),
    year: z.number({ message: "학년은 숫자여야 합니다." }).optional()
      .refine((year) => {
        if (getRole === UserRole.Student) {
          if (year === null || year === undefined || year <= 0) {
            return false;
          }
        }
        return true
      },{ message: "학년은 숫자여야 합니다." }),
    class: z.string().nonempty({ message: "반을 입력하십시오." }).optional()
      .refine((classValue) => {
        if (getRole === UserRole.Student) {
          if (classValue === null || classValue === undefined || classValue === "0" || classValue.trim() === "") {
            return false;
          }
        }
        return true;
      },{ message: "반을 입력하십시오." }),
    number: z.number({ message: "번호는 숫자여야 합니다." }).optional()
      .refine((number) => {
        if (getRole === UserRole.Student) {
          if (number === null || number === undefined || number <= 0) {
            return false;
          }
        }
        return true;
      },{ message: "번호는 숫자여야 합니다." }),
    role: z.string().nonempty({ message: "역할을 작성하십시오." }),
  });

  const form = useForm({
    defaultValues,
    resolver: zodResolver(schema),
  });

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
    return <AccountBox color='info' sx={{ width: '40px', height: '40px', mr: 1 }}/>;
  }
  
  return (
    <Stack spacing={4} width={'300px'} mt={2} mb={2} alignSelf={'center'}>  
      <Box display={'flex'} flexDirection={'row'} alignItems={'center'}>
        {getIcon()}
        <Typography variant="h5">{`${userType} 프로필`}</Typography>
      </Box>
      <UserForm id={id} editMode={editMode} setEditMode={setEditMode} form={form} setRole={setRole} refetch={refetch} defaultValues={defaultValues}/>
    </Stack>
  );
}

export default UserFormContainer;