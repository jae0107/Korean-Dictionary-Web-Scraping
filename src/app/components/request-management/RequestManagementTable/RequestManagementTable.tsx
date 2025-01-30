import { Box, Button, Chip, Tooltip } from "@mui/material";
import { DataGrid, GridActionsCellItem, GridColDef, GridPagination, GridRenderCellParams } from "@mui/x-data-grid";
import MuiPagination from '@mui/material/Pagination';
import CustomNoRowsOverlay from "../../shared/CustomNoRowsOverlay";
import { CheckCircleOutline, DeleteForever, HighlightOff } from "@mui/icons-material";
import { RequestorItemsFragment, WordRequestItemsFragment, WordStatus } from "@/app/generated/gql/graphql";
import { Dispatch, SetStateAction, useState } from "react";
import korDicLogo from "../../../../assets/images/korDicLogo.png";
import naverLogo from "../../../../assets/images/naverLogo.png";
import UserInfoPopUp from "./UserInfoPopUp/UserInfoPopUp";

const RequestManagementTable = ({
  loading,
  words,
  pageCount,
  page,
  paginationModel,
  setPaginationModel,
  wordRequestStatus,
}: {
  loading: boolean;
  words: WordRequestItemsFragment[];
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
  const [getRequestor, setRequestor] = useState<RequestorItemsFragment | null>(null);
  const [openUserInfoPopUp, setOpenUserInfoPopUp] = useState<boolean>(false);

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
      renderCell: (params: GridRenderCellParams<WordRequestItemsFragment>) => {
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
      renderCell: (params: GridRenderCellParams<WordRequestItemsFragment>) => {
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
    //   renderCell: (params: GridRenderCellParams<WordRequestItemsFragment>) => {
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
    { 
      field: 'requestor', 
      headerName: '요청자', 
      width: 100, 
      filterable: false, 
      sortable: false,
      renderCell: (params: GridRenderCellParams<WordRequestItemsFragment>) => {
        return (
          <Chip 
            label={params.row.requestor.name} 
            color="primary" 
            variant="outlined" 
            onClick={() => {
              setRequestor(params.row.requestor);
              setOpenUserInfoPopUp(true);
            }} 
          />
      );
      },
    },
    {
      field: 'actions',
      type: 'actions',
      width: wordRequestStatus === WordStatus.Approved ? 40 : 80,
      getActions: (params) => {
        if (params.row.status === 'APPROVED') {
          return [
            <GridActionsCellItem
              key="deny"
              icon={
                <Tooltip title={'거절'}>
                  <HighlightOff color="error" />
                </Tooltip>
              }
              label="거절"
              showInMenu={false}
              sx={{ '&:hover': { background: 'none' } }}
            />
          ];
        } else if (params.row.status === 'DENIED') {
          return [
            <GridActionsCellItem
              key="approve"
              icon={
                <Tooltip title={'승인'}>
                  <CheckCircleOutline color="success" />
                </Tooltip>
              }
              label="승인"
              showInMenu={false}
              sx={{ '&:hover': { background: 'none' } }}
            />,
            <GridActionsCellItem
              key="delete"
              icon={
                <Tooltip title={'삭제'}>
                  <DeleteForever color="error" />
                </Tooltip>
              }
              label="삭제"
              showInMenu={false}
              sx={{ '&:hover': { background: 'none' } }}
            />
          ];
        }
        return [
          <GridActionsCellItem
            key="approve"
            icon={
              <Tooltip title={'승인'}>
                <CheckCircleOutline color="success" />
              </Tooltip>
            }
            label="승인"
            showInMenu={false}
            sx={{ '&:hover': { background: 'none' } }}
          />,
          <GridActionsCellItem
            key="deny"
            icon={
              <Tooltip title={'거절'}>
                <HighlightOff color="error" />
              </Tooltip>
            }
            label="거절"
            showInMenu={false}
            sx={{ '&:hover': { background: 'none' } }}
          />
        ]
      }
    }
  ];

  if (wordRequestStatus === 'DENIED') {
    columns.splice(columns.length - 1, 0, {
      field: 'deniedReason',
      headerName: '거절 사유',
      flex: 1,
      filterable: false,
      sortable: false,
    });
  } else {
    columns.filter((column) => column.field !== "deniedReason");
  }
  
  return (
    <Box display={'flex'} flexDirection={'column'} width={'90%'}>
      <DataGrid
        pagination
        disableColumnMenu
        checkboxSelection
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
      <UserInfoPopUp
        getRequestor={getRequestor}
        setRequestor={setRequestor}
        setOpenUserInfoPopUp={setOpenUserInfoPopUp}
        openUserInfoPopUp={openUserInfoPopUp}
      />
    </Box>
  );
}

export default RequestManagementTable;