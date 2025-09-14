import { ExistingVocabularyItemsFragment, GetExistingVocabulariesQuery } from "@/app/generated/gql/graphql";
import { Autocomplete, CircularProgress, IconButton, InputAdornment, TextField } from "@mui/material";
import { Dispatch, ReactNode, SetStateAction, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { ListboxComponent } from "./list-box-component";
import { Cancel, Search } from "@mui/icons-material";

const DictionarySearch = ({
  existingWordData,
  loading,
  isLoading,
  form,
  options,
  selectedExistingWord,
  setSelectedExistingWord,
} : {
  existingWordData: GetExistingVocabulariesQuery | undefined;
  loading: boolean;
  isLoading: boolean;
  form:  UseFormReturn<{kWord: string}>;
  options: ExistingVocabularyItemsFragment[];
  selectedExistingWord: ExistingVocabularyItemsFragment | null;
  setSelectedExistingWord: Dispatch<SetStateAction<ExistingVocabularyItemsFragment | null>>;
}) => {
  const { setValue, watch } = form;

  return (
    <Autocomplete
      loading={loading}
      sx={{ flex: 1 }}
      noOptionsText="검색 결과가 없습니다."
      options={options}
      disableListWrap
      getOptionKey={(option) => option.id}
      getOptionLabel={(option) => option.title}
      slotProps={{
        listbox: {
          component: ListboxComponent
        },
      }}
      renderGroup={(params) => params as unknown as React.ReactNode}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder="검색어를 입력하세요."
          slotProps={{
            input: {
              ...params.InputProps,
              // endAdornment: (
              //   <>
              //     {loading ? <CircularProgress color="inherit" size={20} /> : null}
              //     {params.InputProps.endAdornment}
              //   </>
              // ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton 
                    loading={loading || isLoading} 
                    onClick={() => {
                      setValue('kWord', '');
                      setSelectedExistingWord(null);
                    }} 
                    sx={{ 
                      mr: 1,
                      padding: '12px',
                      fontSize: '1.75rem',
                    }}
                  >
                    <Cancel sx={{ width: '15px', height: '15px' }}/>
                  </IconButton>
                  <span
                    style={{
                      cursor:
                        watch('kWord') === '' ? 'not-allowed' : 'default',
                    }}
                  >
                    <IconButton 
                      loading={loading || isLoading} 
                      disabled={watch('kWord') === ''}
                      sx={{ 
                        padding: '12px',
                        fontSize: '1.75rem',
                      }}
                      type="submit"
                    >
                      <Search />
                    </IconButton>
                  </span>
                </InputAdornment>
              ),
              sx: {
                '@media (max-width:600px)': {
                  fontSize: '0.8rem'
                },
                '&.MuiInputBase-root': {
                  paddingRight: '14px !important',
                  alignSelf: 'center',
                },
                flex: 1,
                maxWidth: '700px',
              }
            },
          }}
        />
      )}
      value={selectedExistingWord}
      onInputChange={(_, newInputValue) => {
        setValue('kWord', newInputValue || '');
      }}
      onChange={(_, value) => {
        setValue('kWord', value?.title || '');
        setSelectedExistingWord(value);
      }}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      renderOption={(props, option, state) => {
        return [props, option, state] as ReactNode;
      }}
    />
  );
}

export default DictionarySearch;