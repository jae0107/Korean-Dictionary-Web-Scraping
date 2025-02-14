import { UserInput, UserRole } from "@/app/generated/gql/graphql";
import { Controller, UseFormReturn } from "react-hook-form";
import { FormControl, IconButton, InputAdornment, InputLabel, MenuItem, Select, Stack, TextField } from "@mui/material";
import { useCurrentUser } from "@/app/hooks/useCurrentUser";
import { Cancel } from "@mui/icons-material";

const UserForm = ({
  editMode,
  form,
  setRole,
} : {
  editMode: boolean;
  form: UseFormReturn<UserInput>;
  setRole?: (role: UserRole) => void;
}) => {
  const { userRole } = useCurrentUser();
  
  const { register, control, watch, setValue } = form;
  
  return (
    <Stack spacing={2}>
      <FormControl component='fieldset'>
        <TextField
          {...register('name')}
          type='text'
          label='이름'
          disabled={!editMode}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setValue('name', '')} disabled={!editMode} sx={{ display: editMode ? 'inline-flex' : 'none' }}>
                    <Cancel sx={{ width: '15px', height: '15px' }}/>
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />
      </FormControl>
      <FormControl component='fieldset'>
        <TextField
          {...register('email')}
          type='email'
          label='이메일'
          disabled={!editMode}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setValue('email', '')} disabled={!editMode} sx={{ display: editMode ? 'inline-flex' : 'none' }}>
                    <Cancel sx={{ width: '15px', height: '15px' }}/>
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
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
              onChange={(e) => {
                field.onChange(e);
                setRole && setRole(e.target.value as UserRole);
              }}
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
        watch('role') === 'STUDENT' && 
        <FormControl component='fieldset'>
          <TextField
            type='number'
            label='번호'
            disabled={!editMode}
            slotProps={{
              htmlInput: {
                min: 0
              },
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setValue('number', 0)} disabled={!editMode} sx={{ display: editMode ? 'inline-flex' : 'none' }}>
                      <Cancel sx={{ width: '15px', height: '15px' }}/>
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
            value={watch('number')}
            onChange={(e) => setValue('number', parseInt(e.target.value))}
          />
        </FormControl>
      }
    </Stack>
  )
}

export default UserForm;