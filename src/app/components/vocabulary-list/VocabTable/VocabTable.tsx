import { VocabularyItemsFragment } from "@/app/generated/gql/graphql";
import { DataGrid, GridColDef, GridPagination, GridRenderCellParams } from "@mui/x-data-grid";
import korDicLogo from "../../../../assets/images/korDicLogo.png";
import naverLogo from "../../../../assets/images/naverLogo.png";
import csvLogo from "../../../../assets/images/csvLogo.png";
import { Box, Typography } from "@mui/material";
import MuiPagination from '@mui/material/Pagination';
import CustomNoRowsOverlay from "../../shared/CustomNoRowsOverlay";
import CustomExportToolbar from "../../shared/CustomExportToolbar";
import { Dispatch, SetStateAction } from "react";

const VocabTable = ({
  loading,
  words,
  pageCount,
  page,
  paginationModel,
  setPaginationModel,
}: {
  loading: boolean;
  words: VocabularyItemsFragment[];
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
}) => {
  const columns: GridColDef[] = [
    { 
      field: 'page', 
      headerName: '페이지', 
      width: 60, 
      filterable: false, 
      sortable: false,
      renderCell: (params: GridRenderCellParams<VocabularyItemsFragment>) => {
        return (
          params.row.page ? params.row.page : <Typography display={'flex'} width={'100%'} justifyContent={'center'} alignItems={'center'}>-</Typography>
        );
      }
    },
    { field: 'title', headerName: '단어', width: 120, filterable: false, sortable: false },
    { 
      field: 'korDicResults', 
      headerName: '국립국어원', 
      flex: 1, 
      filterable: false, 
      sortable: false,
      renderHeader: () => {
        return (
          <>
            <img src={korDicLogo.src} style={{ width: '20px', height: '20px', background: 'white', borderRadius: '50%', marginRight: '4px' }}/>
            국립국어원
          </>
        );
      },
      valueGetter: (value, row: VocabularyItemsFragment) => {
        return (
          row.korDicResults && row.korDicResults.length > 0 ? row.korDicResults.map((result, i) => {
            return row.korDicResults && row.korDicResults.length > 1 ? `${i+1}. ${result}\n` : result;
          }).join("\n") : '-'
        );
      },
      renderCell: (params: GridRenderCellParams<VocabularyItemsFragment>) => {
        return (
          params.row.korDicResults && params.row.korDicResults.length > 0 ? params.row.korDicResults.map((result, i) => {
            return params.row.korDicResults && params.row.korDicResults.length > 1 ? `${i+1}. ${result}\n` : result;
          }) : <Typography display={'flex'} width={'100%'} justifyContent={'center'} alignItems={'center'}>-</Typography>
        );
      }
    },
    { 
      field: 'naverDicResults', 
      headerName: '네이버', 
      flex: 1, 
      filterable: false, 
      sortable: false,
      renderHeader: () => {
        return (
          <>
            <img src={naverLogo.src} style={{ width: '20px', height: '20px', background: 'white', borderRadius: '50%', marginRight: '4px' }}/>
            네이버
          </>
        );
      },
      valueGetter: (value, row: VocabularyItemsFragment) => {
        return (
          row.naverDicResults && row.naverDicResults.length > 0 ? row.naverDicResults.map((result, i) => {
            return row.naverDicResults && row.naverDicResults.length > 1 ? `${i+1}. ${result}\n` : result;
          }).join("\n") : '-'
        );
      },
      renderCell: (params: GridRenderCellParams<VocabularyItemsFragment>) => {
        return (
          params.row.naverDicResults && params.row.naverDicResults.length > 0 ? params.row.naverDicResults.map((result, i) => {
            return params.row.naverDicResults && params.row.naverDicResults.length > 1 ? `${i+1}. ${result}\n` : result;
          }) : <Typography display={'flex'} width={'100%'} justifyContent={'center'} alignItems={'center'}>-</Typography>
        );
      }
    },
    { 
      field: 'example',
      headerName: '예문', 
      flex: 1, 
      filterable: false, 
      sortable: false,
      renderCell: (params: GridRenderCellParams<VocabularyItemsFragment>) => {
        return (
          params.row.example ? params.row.example : <Typography display={'flex'} width={'100%'} justifyContent={'center'} alignItems={'center'}>-</Typography>
        );
      }
    },
  ];
  
  return (
    <Box display={'flex'} flexDirection={'column'} width={'90%'}>
      <DataGrid
        pagination
        disableColumnMenu
        keepNonExistentRowsSelected
        loading={loading}
        columns={columns}
        rows={words}
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
        getRowHeight={() => 'auto'}
        slots={{
          toolbar: CustomExportToolbar,
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

export default VocabTable;