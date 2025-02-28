import { PasswordResetRequestItemsFragment, PasswordResetRequestorItemsFragment } from "@/app/generated/gql/graphql";
import { useSnackbar } from "@/app/hooks/useSnackbar";
import { Box, Chip, CircularProgress, Tooltip, Typography } from "@mui/material";
import { DataGrid, GridActionsCellItem, GridColDef, GridPagination, GridRenderCellParams, GridRowParams } from "@mui/x-data-grid";
import { Dispatch, SetStateAction, useState } from "react";
import CustomNoRowsOverlay from "../../shared/CustomNoRowsOverlay";
import MuiPagination from '@mui/material/Pagination';
import { Remove, RestartAlt } from "@mui/icons-material";
import UserInfoPopUp from "../../request-management/RequestManagementTable/UserInfoPopUp/UserInfoPopUp";
import { useMutation } from "@apollo/client";
import { passwordResetMutation } from "./query";
import PasswordResetRequestManagementBulkAction from "./PasswordResetRequestManagementBulkAction/PasswordResetRequestManagementBulkAction";

const PasswordResetRequestManagementTable = ({
  loading,
  passwordResetRequests,
  pageCount,
  page,
  paginationModel,
  setPaginationModel,
  refetch,
} : {
  loading: boolean;
  passwordResetRequests: PasswordResetRequestItemsFragment[];
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
  refetch: () => void;
}) => {
  const { dispatchCurrentSnackBar } = useSnackbar();

  const [getRequestor, setRequestor] = useState<PasswordResetRequestorItemsFragment | null>(null);
  const [openUserInfoPopUp, setOpenUserInfoPopUp] = useState<boolean>(false);
  const [selectedPasswordResetRequests, setSelectedPasswordResetRequests] = useState<string[]>([]);
  const [getPasswordResetLoader, setPasswordResetLoader] = useState<{ [key: string]: boolean }>({});

  const [passwordReset] = useMutation(passwordResetMutation);

  const onSubmit = async (id: string, requestorId: string) => {
      setPasswordResetLoader({[id]: true});
      passwordReset({
        variables: {
          passwordResetId: requestorId,
        },
        onError: (error) => {
          setPasswordResetLoader({[id]: false});
          dispatchCurrentSnackBar({
            payload: {
              open: true,
              type: 'error',
              message: error.message,
            },
          });
        },
        onCompleted: () => {
          setPasswordResetLoader({[id]: false});
          refetch();
          dispatchCurrentSnackBar({
            payload: {
              open: true,
              type: 'success',
              message: '비밀번호 초기화가 완료되었습니다.',
            },
          });
        },
      });
    };

  const columns: GridColDef[] = [
    { 
      field: 'requestor', 
      headerName: '요청자', 
      headerClassName: 'requestor-header',
      cellClassName: 'requestor-cell',
      flex: 1,
      filterable: false, 
      sortable: false,
      renderCell: (params: GridRenderCellParams<PasswordResetRequestItemsFragment>) => {
        return (
          params.row.requestor ?
          <Box display={'flex'} width={'100%'} justifyContent={'center'} alignItems={'center'}>
            <Chip 
              label={params.row.requestor.name} 
              color="primary" 
              variant="outlined" 
              onClick={() => {
                params.row.requestor && setRequestor(params.row.requestor);
                setOpenUserInfoPopUp(true);
              }} 
            /> 
          </Box> : 
          <Box display={'flex'} width={'100%'} justifyContent={'center'} alignItems={'center'}>
            <Remove/>
          </Box>
        );
      },
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: '작업',
      renderHeader: () => null,
      width: 40,
      getActions: (params: GridRowParams<PasswordResetRequestItemsFragment>) => {
        return [
          <GridActionsCellItem
            key="deny"
            icon={
              getPasswordResetLoader[params.row.id] ?
              <CircularProgress style={{ width: '20px', height: '20px' }}/>  
              : 
              <Tooltip title={'비밀번호 초기화'}>
                <RestartAlt />
              </Tooltip>
            }
            label="초기화"
            showInMenu={false}
            disabled={!params.row.requestor}
            onClick={() => {
              onSubmit(params.row.id, params.row.requestor?.id || '');
            }}
          />
        ];
      }
    }
  ];
  
  return (
    <Box 
      display={'flex'} 
      flexDirection={'column'} 
      alignItems={'center'}
      width={'90%'}
      sx={{
        '@media (max-width:545px)': {
          width: '95% !important',
        }
      }}
    >
      <Box 
        width={'511px'}
        sx={{
          '@media (max-width:535px)': {
            width: '100% !important',
          }
        }}
      >
        <PasswordResetRequestManagementBulkAction
          ids={selectedPasswordResetRequests}
          setSelectedPasswordResetRequests={setSelectedPasswordResetRequests}
          refetch={refetch}
        />
        <DataGrid
          pagination
          disableColumnMenu
          checkboxSelection
          keepNonExistentRowsSelected
          onRowSelectionModelChange={(newRowSelectionModel) => {
            setSelectedPasswordResetRequests(newRowSelectionModel as string[]);
          }}
          rowSelectionModel={selectedPasswordResetRequests || []}
          disableRowSelectionOnClick
          loading={loading}
          columns={columns}
          rows={passwordResetRequests}
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
          localeText={{
            footerRowSelected: count => `${count.toLocaleString()}개 선택됨`,
            footerTotalRows: '총 행 수:',
            MuiTablePagination: {
              labelRowsPerPage: '페이지 당 행 수:',
            },
            toolbarColumns: '열 선택',
            columnsManagementShowHideAllText: '모든 열 보기/숨기기',
            columnsManagementReset: '초기화',
            checkboxSelectionHeaderName: '선택',
          }}
          sx={{
            '&.MuiDataGrid-root .MuiDataGrid-main .MuiDataGrid-virtualScroller .MuiDataGrid-topContainer .MuiDataGrid-columnHeaders .MuiDataGrid-columnHeader .MuiDataGrid-columnHeaderDraggableContainer .MuiDataGrid-columnHeaderTitleContainer': {
              display: 'flex',
              justifyContent: 'center',
            },
          }}
        />
      </Box>
      <UserInfoPopUp
        getRequestor={getRequestor}
        setRequestor={setRequestor}
        setOpenUserInfoPopUp={setOpenUserInfoPopUp}
        openUserInfoPopUp={openUserInfoPopUp}
      />
    </Box>
  );
}

export default PasswordResetRequestManagementTable;