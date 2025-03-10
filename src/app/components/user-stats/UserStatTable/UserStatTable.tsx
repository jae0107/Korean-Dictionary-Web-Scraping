import { UserStatItemsFragment } from "@/app/generated/gql/graphql";
import { Box, Typography } from "@mui/material";
import { DataGrid, GridColDef, GridPagination, GridRenderCellParams } from "@mui/x-data-grid";
import { Dispatch, SetStateAction } from "react";
import CustomExportToolbar from "../../shared/CustomExportToolbar";
import CustomNoRowsOverlay from "../../shared/CustomNoRowsOverlay";
import MuiPagination from '@mui/material/Pagination';
import csvLogo from "../../../../assets/images/csvLogo.png";

const UserStatTable = ({
  loading,
  students,
  pageCount,
  page,
  paginationModel,
  setPaginationModel,
  maxNumTest,
} : {
  loading: boolean;
  students: UserStatItemsFragment[];
  pageCount: number;
  page: number;
  paginationModel: {
    page: number;
    pageSize: number;
  };
  setPaginationModel: Dispatch<SetStateAction<{
    page: number;
    pageSize: number;
  }>>;
  maxNumTest: number;
}) => {
  const maxNumTestCols : GridColDef[] = Array.from({length: maxNumTest}, (_, i) => {
    return {
      field: `test${i+1}`,
      headerName: `${i+1}차`,
      flex: 1, 
      filterable: false, 
      sortable: false,
      renderCell: (params: GridRenderCellParams<UserStatItemsFragment>) => {
        if (params.row.testResults && params.row.testResults.length > 0) {
          const j = params.row.testResults.findIndex((test) => test.title === `${i+1}차`);
          if (j !== -1) {
            return params.row.testResults[j].testScore;
          }
          return <Typography display={'flex'} width={'100%'} justifyContent={'center'} alignItems={'center'}>-</Typography>;
        }
        return <Typography display={'flex'} width={'100%'} justifyContent={'center'} alignItems={'center'}>-</Typography>;
      }
    }
  });

  const columns: GridColDef[] = [
    { field: 'name', headerName: '이름', flex: 2, filterable: false, sortable: false },
    { field: 'year', headerName: '학년', flex: 1, filterable: false, sortable: false },
    { field: 'class', headerName: '반', flex: 1, filterable: false, sortable: false },
    { field: 'number', headerName: '번호', flex: 1, filterable: false, sortable: false },
    { field: 'approvedCount', headerName: '승인된 단어', flex: 1, filterable: false, sortable: false },
    { field: 'myVocabCount', headerName: '내 단어장', flex: 1, filterable: false, sortable: false },
    ...maxNumTestCols,
  ];
  
  return (
    <Box 
      display={'flex'} 
      flexDirection={'column'} 
      width={'90%'}
      sx={{
        '@media (max-width:545px)': {
          width: '95% !important',
        }
      }}
    >
      <DataGrid
        pagination
        disableColumnMenu
        disableRowSelectionOnClick
        loading={loading}
        columns={columns}
        rows={students}
        pageSizeOptions={[10, 20, 50, 100]}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
        }}
        paginationModel={paginationModel}
        onPaginationModelChange={(values, details) => {
          if (!details.reason) return;
          setPaginationModel(values);
        }}
        getRowHeight={() => 43}
        slots={{
          toolbar: () => <CustomExportToolbar displayExport={true}/>,
          noRowsOverlay: CustomNoRowsOverlay,
          pagination: () => (
            <GridPagination
              ActionsComponent={({ className }) => (
                <MuiPagination
                  className={className}
                  color="primary"
                  size="small"
                  defaultPage={6}
                  boundaryCount={2}
                  showFirstButton
                  showLastButton
                  count={pageCount}
                  page={page+1}
                  onChange={(event, page) => 
                    setPaginationModel((value) => {
                      return {
                        ...value,
                        page: page - 1,
                      };
                    })
                  }
                />
              )}
            />
          ),
        }}
        localeText={{
          footerRowSelected: count => `${count.toLocaleString()}개 선택됨`,
          footerTotalRows: '총 행 수:',
          MuiTablePagination: {
            labelRowsPerPage: '페이지 당 행 수:',
          },
          toolbarExport: '다운로드',
          toolbarExportCSV: <><img src={csvLogo.src} style={{ width: '25px', height: '25px', marginRight: '4px' }}/>CSV</>,
          toolbarColumns: '열 선택',
          columnsManagementShowHideAllText: '모든 열 보기/숨기기',
          columnsManagementReset: '초기화',
        }}
      />
    </Box>
  );
}

export default UserStatTable;