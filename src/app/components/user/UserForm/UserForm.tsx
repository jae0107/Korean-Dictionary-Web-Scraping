import { UserInput } from "@/app/generated/gql/graphql";
import { Controller, useForm } from "react-hook-form";
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormControl, InputLabel, MenuItem, Select, Stack, TextField } from "@mui/material";
import { useCurrentUser } from "@/app/hooks/useCurrentUser";

const schema = z.object({
  name: z.string().nonempty(),
  email: z.string().email().nonempty(),
  year: z.number().int(),
  class: z.string().nonempty(),
  number: z.number().int(),
  role: z.string().nonempty(),
});

const UserForm = ({
  defaultValues,
  editMode,
} : {
  defaultValues: UserInput;
  editMode: boolean;
}) => {
  const { userRole } = useCurrentUser();
  
  const form = useForm({
    defaultValues,
    resolver: zodResolver(schema),
  });
  
  const { register, control } = form;
  
  return (
    <Stack spacing={2}>
      <FormControl component='fieldset'>
        <TextField
          {...register('name')}
          type='text'
          label='이름'
          disabled={!editMode}
        />
      </FormControl>
      <FormControl component='fieldset'>
        <TextField
          {...register('email')}
          type='email'
          label='이메일'
          disabled={!editMode}
        />
      </FormControl>
      <FormControl component='fieldset'>
        <InputLabel>역할</InputLabel>
        <Controller
          control={control}
          name='role'
          render={({ field }) => (
            <Select
              value={field.value}
              label="역할"
              onChange={field.onChange}
              disabled={!editMode || userRole === 'STUDENT' || userRole === 'TEACHER'}
            >
              <MenuItem value={''}><em>-</em></MenuItem>
              <MenuItem value={'STUDENT'}>학생</MenuItem>
              {(userRole === 'SUPERADMIN' || userRole === 'ADMIN' || userRole === 'TEACHER') && <MenuItem value={'TEACHER'}>교사</MenuItem>}
              {(userRole === 'SUPERADMIN' || userRole === 'ADMIN') && <MenuItem value={'ADMIN'}>관리자</MenuItem>}
              {userRole === 'SUPERADMIN' && <MenuItem value={'SUPERADMIN'}>최고 관리자</MenuItem>}
            </Select>
          )}
        />
      </FormControl>
      <FormControl component='fieldset'>
        <InputLabel>학년</InputLabel>
        <Controller
          control={control}
          name='year'
          render={({ field }) => (
            <Select
              value={field.value}
              label="학년"
              onChange={field.onChange}
              disabled={!editMode}
            >
              <MenuItem value={0}><em>-</em></MenuItem>
              <MenuItem value={1}>1학년</MenuItem>
              <MenuItem value={2}>2학년</MenuItem>
              <MenuItem value={3}>3학년</MenuItem>
            </Select>
          )}
        />
      </FormControl>
      <FormControl component='fieldset'>
        <InputLabel>반</InputLabel>
        <Controller
          control={control}
          name='class'
          render={({ field }) => (
            <Select
              value={field.value}
              label="반"
              onChange={field.onChange}
              disabled={!editMode}
            >
              <MenuItem value={'0'}><em>-</em></MenuItem>
              <MenuItem value={'1'}>1반</MenuItem>
              <MenuItem value={'2'}>2반</MenuItem>
              <MenuItem value={'3'}>3반</MenuItem>
              <MenuItem value={'4'}>4반</MenuItem>
              <MenuItem value={'5'}>5반</MenuItem>
              <MenuItem value={'6'}>6반</MenuItem>
              <MenuItem value={'7'}>7반</MenuItem>
              <MenuItem value={'8'}>8반</MenuItem>
              <MenuItem value={'9'}>9반</MenuItem>
              <MenuItem value={'10'}>10반</MenuItem>
            </Select>
          )}
        />
      </FormControl>
      {
        userRole === 'STUDENT' || userRole === 'TEACHER' && 
        <FormControl component='fieldset'>
          <TextField
            {...register('number')}
            type='number'
            label='번호'
            disabled={!editMode}
            slotProps={{
              htmlInput: {
                min: 0
              }
            }}
          />
        </FormControl>
      }
    </Stack>
  )
}

export default UserForm;