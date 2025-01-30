import { MyRequestItemsFragment, WordStatus } from "@/app/generated/gql/graphql";
import { Cancel } from "@mui/icons-material";
import { Box, Button, Tooltip } from "@mui/material";
import { DataGrid, GridActionsCellItem, GridColDef, GridPagination, GridRenderCellParams } from "@mui/x-data-grid";
import { Dispatch, SetStateAction } from "react";
import korDicLogo from "../../../../assets/images/korDicLogo.png";
import naverLogo from "../../../../assets/images/naverLogo.png";
import CustomNoRowsOverlay from "../../shared/CustomNoRowsOverlay";
import MuiPagination from '@mui/material/Pagination';

const MyRequestTable = ({
  loading,
  words,
  pageCount,
  page,
  paginationModel,
  setPaginationModel,
  wordRequestStatus,
}: {
  loading: boolean;
  words: MyRequestItemsFragment[];
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
  wordRequestStatus: WordStatus;
}) => {
  const columns: GridColDef[] = [
    { field: 'page', headerName: '페이지', width: 60, filterable: false, sortable: false },
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
      renderCell: (params: GridRenderCellParams<MyRequestItemsFragment>) => {
        return (
          params.row.korDicResults && params.row.korDicResults.map((result, i) => {
            return `${i+1}. ${result}\n`;
          })
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
      renderCell: (params: GridRenderCellParams<MyRequestItemsFragment>) => {
        return (
          params.row.naverDicResults && params.row.naverDicResults.map((result, i) => {
            return `${i+1}. ${result}\n`;
          })
        );
      }
    },
    { field: 'example', headerName: '예문', flex: 1, filterable: false, sortable: false },
    // { 
    //   field: 'status', 
    //   headerName: '상태', 
    //   width: 105, 
    //   filterable: false, 
    //   sortable: false,
    //   renderCell: (params: GridRenderCellParams<MyRequestItemsFragment>) => {
    //     const status = params.row.status === 'APPROVED' ? '승인' : params.row.status === 'PENDING' ? '승인 대기중' : '거절';
    //     return (
    //       <Button 
    //         variant="outlined" 
    //         color={params.row.status === 'APPROVED' ? 'success' : params.row.status === 'PENDING' ? 'primary' : 'error'} 
    //         size="small"
    //         sx={{ cursor: 'default' }}
    //       >
    //         {status}
    //       </Button>
    //     );
    //   },
    // },
  ];

  if (wordRequestStatus === 'PENDING') {
    columns.filter((column) => column.field !== 'deniedReason');
    columns.push({
      field: 'actions',
      type: 'actions',
      width: 40,
      getActions: (params) => [
        <GridActionsCellItem
          key="approve"
          icon={
            <Tooltip title={'취소'}>
              <Cancel color="error" />
            </Tooltip>
          }
          label="취소"
          showInMenu={false}
          sx={{ '&:hover': { background: 'none' } }}
        />
      ]
    });
  } else if (wordRequestStatus === 'DENIED') {
    columns.filter((column) => column.type !== 'actions');
    columns.push({
      field: 'deniedReason',
      headerName: '거절 사유',
      flex: 1,
      filterable: false,
      sortable: false,
    });
  } else {
    columns.filter((column) => column.field !== "deniedReason" && column.type !== "actions");
  }

  return (
    <Box display={'flex'} flexDirection={'column'} width={'90%'}>
      <DataGrid
        pagination
        disableColumnMenu
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
      />
    </Box>
  );
}

export default MyRequestTable;