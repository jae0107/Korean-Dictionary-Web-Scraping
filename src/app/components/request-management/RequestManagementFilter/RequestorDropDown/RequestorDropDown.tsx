import { Autocomplete, CircularProgress, TextField } from '@mui/material';
import { ListboxComponent } from './list-box-component';
import { useQuery } from '@apollo/client';
import { getWordRequestsQuery } from './query';
import usePaginationModel from '@/app/hooks/usePaginationModel';
import { useSnackbar } from '@/app/hooks/useSnackbar';
import { ReactNode, useState } from 'react';
import { RequestorDropDownItemsFragment } from '@/app/generated/gql/graphql';

const RequestorDropDown = ({
  setRequestorId,
} : {
  setRequestorId: (value: string) => void;
}) => {
  const { paginationModel, setPaginationModel } = usePaginationModel();
  const { dispatchCurrentSnackBar } = useSnackbar();
  const [nameKeyword, setNameKeyword] = useState<string>('');
  const [selectedRequestors, setSelectedRequestors] = useState<RequestorDropDownItemsFragment | null>(null);
  
  const { data, loading } =
    useQuery(getWordRequestsQuery, {
      fetchPolicy: 'network-only',
      variables: {
        paginationOptions: {
          limit: paginationModel.pageSize,
          pageNum: paginationModel.page,
        },
        filterOptions: {
          userName: nameKeyword,
        },
      },
      onError: (error) => {
        dispatchCurrentSnackBar({
          payload: {
            open: true,
            type: 'error',
            message: error.message,
          },
        });
      },
    });

  const options = data?.getRequestors.records || [];
  
  return (
    <Autocomplete
      loading={loading}
      sx={{ flex: 1 }}
      noOptionsText="검색 결과가 없습니다."
      options={options}
      disableListWrap
      getOptionKey={(option) => option.id}
      getOptionLabel={(option) => option.name}
      slotProps={{
        listbox: {
          component: ListboxComponent
        }
      }}
      renderGroup={(params) => params as unknown as React.ReactNode}
      renderInput={(params) => (
        <TextField
          {...params}
          label="요청자"
          placeholder="요청자를 선택하세요."
          slotProps={{
            input: {
              ...params.InputProps,
              endAdornment: (
                <>
                  {loading ? <CircularProgress color="inherit" size={20} /> : null}
                  {params.InputProps.endAdornment}
                </>
              ),
              sx: {
                '@media (max-width:600px)': {
                  fontSize: '0.8rem'
                }
              }
            },
          }}
        />
      )}
      value={selectedRequestors}
      onChange={(event, value) => {
        setSelectedRequestors(value);
        setRequestorId(value?.id || '');
        // setRequestorId(value.map((v) => v.id));
      }}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      renderOption={(props, option, state) => {
        return [props, option, state] as ReactNode;
      }}
    />
  );
}

export default RequestorDropDown;