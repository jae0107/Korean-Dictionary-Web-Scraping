import { ExtendedUserInput, RawJsonDataProps } from "@/app/account-creation/type";
import { TabContext, TabList } from "@mui/lab";
import { Box, Stack, Tab } from "@mui/material";
import { SyntheticEvent, useState } from "react";
import DuplicateAccountTable from "./DuplicateAccountTable/DuplicateAccountTable";
import WrongDataTable from "./WrongDataTable/WrongDataTable";

const a11yProps = (index: string) => {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
};

const AccountCreationContainer = ({
  loading,
  getDuplicateAccounts,
  getWrongData,
} : {
  loading: boolean;
  getDuplicateAccounts: ExtendedUserInput[];
  getWrongData: RawJsonDataProps[];
}) => {
  const [getDataType, setDataType] = useState<'duplicatedAccounts' | 'wrongData'>('duplicatedAccounts');

  const handleTabChange = (event: SyntheticEvent, newValue: 'duplicatedAccounts' | 'wrongData') => {
    setDataType(newValue);
  };

  return (
    <Stack 
      spacing={2} 
      width={'90%'}
      sx={{
        '@media (max-width:475px)': {
          width: '95% !important',
        }
      }}
    >
      <TabContext value={getDataType}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleTabChange}>
            <Tab
              label="중복 아이디"
              value={'duplicatedAccounts'}
              {...a11yProps('duplicatedAccounts')}
            />
            <Tab
              label="잘못된 데이터"
              value={'wrongData'}
              {...a11yProps('wrongData')}
            />
          </TabList>
        </Box>
      </TabContext>
      {
        getDataType === 'duplicatedAccounts' ? (
          <DuplicateAccountTable
            loading={loading}
            getData={getDuplicateAccounts}
          />
        ) : (
          <WrongDataTable
            loading={loading}
            getData={getWrongData}
          />
        )
      }
    </Stack>
  );
}

export default AccountCreationContainer;