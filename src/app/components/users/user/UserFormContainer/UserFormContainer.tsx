import { AccountBox } from "@mui/icons-material";
import { Box, Stack, Typography } from "@mui/material";
import UserForm from "./UserForm/UserForm";
import { UserInput, UserRole } from "@/app/generated/gql/graphql";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

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
  const [editMode, setEditMode] = useState(false);
  const [getRole, setRole] = useState<UserRole>(defaultValues.role || UserRole.Student);

  const schema = z.object({
    name: z.string().nonempty({ message: "이름을 작성하십시오." }),
    email: z.string().nonempty({ message: "이메일을 작성하십시오." }).email({ message: "잘못된 이메일 형식입니다." }),
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
  
  return (
    <Stack spacing={4} width={'300px'} mt={2} alignSelf={'center'}>  
      <Box display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'}>
        <Box display={'flex'} flexDirection={'row'} alignItems={'center'}>
          <AccountBox color='info' sx={{ width: '40px', height: '40px' }}/>
          <Typography variant="h5">{`${userType} 프로필`}</Typography>
        </Box>
      </Box>
      <UserForm id={id} editMode={editMode} setEditMode={setEditMode} form={form} setRole={setRole} refetch={refetch} />
    </Stack>
  );
}

export default UserFormContainer;