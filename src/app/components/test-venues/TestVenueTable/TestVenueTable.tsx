import { Box, CircularProgress, Tooltip, Typography, useMediaQuery } from "@mui/material";
import { DataGrid, GridActionsCellItem, GridColDef, GridPagination, GridRenderCellParams, GridRowParams } from "@mui/x-data-grid";
import CustomNoRowsOverlay from "../../shared/CustomNoRowsOverlay";
import MuiPagination from '@mui/material/Pagination';
import { TestVenueInput, TestVenueItemsFragment, TestVenueStatus } from "@/app/generated/gql/graphql";
import { Dispatch, SetStateAction, useState } from "react";
import { Cancel, DeleteForever, Edit, Login, Restore, Start } from "@mui/icons-material";
import { useMutation } from "@apollo/client";
import { closeTestVenueMutation, deleteTestVenueMutation, openTestVenueMutation, restoreTestVenueMutation, updateTestVenueMutation } from "./query";
import { useSnackbar } from "@/app/hooks/useSnackbar";
import ConfirmDialog from "../../shared/ConfirmDialog";
import TestVenueUpdatePopUp from "../TestVenueUpdatePopUp/TestVenueUpdatePopUp";
import { useRouter } from "next/navigation";

const TestVenueTable = ({
  loading,
  testVenues,
  pageCount,
  page,
  paginationModel,
  setPaginationModel,
  testVenueStatus,
  refetch,
  myYear,
  myClass,
  myRole,
} : {
  loading: boolean;
  testVenues: TestVenueItemsFragment[];
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
  testVenueStatus: TestVenueStatus;
  refetch: () => void;
  myYear: number | undefined;
  myClass: string | undefined;
  myRole: "STUDENT" | "TEACHER" | "ADMIN" | "SUPERADMIN" | undefined;
}) => {
  const maxWidth490 = useMediaQuery('(max-width:490px)');
  const { dispatchCurrentSnackBar } = useSnackbar();
  const router = useRouter();

  const [getTestVenue, setTestVenue] = useState<TestVenueItemsFragment | null>(null);
  const [selectedTestVenueId, setSelectedTestVenueId] = useState<string>('');
  const [getUpdateLoader, setUpdateLoader] = useState<{ [key: string]: boolean }>({});
  const [getOpenLoader, setOpenLoader] = useState<{ [key: string]: boolean }>({});
  const [getCloseLoader, setCloseLoader] = useState<{ [key: string]: boolean }>({});
  const [getDeleteLoader, setDeleteLoader] = useState<{ [key: string]: boolean }>({});
  const [getRecoverLoader, setRecoverLoader] = useState<{ [key: string]: boolean }>({});
  const [openConfirmDialog, setOpenConfirmDialog] = useState<boolean>(false);
  const [openTestVenueUpdatePopUp, setOpenTestVenueUpdatePopUp] = useState<boolean>(false);

  const [updateTestVenue] = useMutation(updateTestVenueMutation);
  const [openTestVenue] = useMutation(openTestVenueMutation);
  const [closeTestVenue] = useMutation(closeTestVenueMutation);
  const [restoreTestVenue] = useMutation(restoreTestVenueMutation);
  const [deleteTestVenue] = useMutation(deleteTestVenueMutation);

  const onOpen = (id: string) => {
    setOpenLoader({[id]: true});
    openTestVenue({
      variables: {
        openTestVenueId: id,
      },
      onError: (error) => {
        setOpenLoader({[id]: false});
        dispatchCurrentSnackBar({
          payload: {
            open: true,
            type: 'error',
            message: error.message,
          },
        });
      },
      onCompleted: () => {
        refetch();
        setOpenLoader({[id]: false});
        dispatchCurrentSnackBar({
          payload: {
            open: true,
            type: 'success',
            message: '성공적으로 열렸습니다.',
          },
        });
      },
    });
  }

  const onClose = (id: string) => {
    setCloseLoader({[id]: true});
    closeTestVenue({
      variables: {
        closeTestVenueId: id,
      },
      onError: (error) => {
        setCloseLoader({[id]: false});
        dispatchCurrentSnackBar({
          payload: {
            open: true,
            type: 'error',
            message: error.message,
          },
        });
      },
      onCompleted: () => {
        refetch();
        setCloseLoader({[id]: false});
        dispatchCurrentSnackBar({
          payload: {
            open: true,
            type: 'success',
            message: '성공적으로 닫혔습니다.',
          },
        });
      },
    });
  }

  const onRestore = (id: string) => {
    setRecoverLoader({[id]: true});
    restoreTestVenue({
      variables: {
        restoreTestVenueId: id,
      },
      onError: (error) => {
        setRecoverLoader({[id]: false});
        dispatchCurrentSnackBar({
          payload: {
            open: true,
            type: 'error',
            message: error.message,
          },
        });
      },
      onCompleted: () => {
        refetch();
        setRecoverLoader({[id]: false});
        dispatchCurrentSnackBar({
          payload: {
            open: true,
            type: 'success',
            message: '성공적으로 복구되었습니다.',
          },
        });
      },
    });
  }

  const onUpdate = (input: TestVenueInput) => {
    setUpdateLoader({[selectedTestVenueId]: true});
    updateTestVenue({
      variables: {
        updateTestVenueId: selectedTestVenueId,
        input: {
          ...input,
          year: Number(input.year),
          class: String(input.class),
          pageFrom: input.pageFrom && input.pageFrom > 0 ? Number(input.pageFrom) : null,
          pageTo: input.pageTo && input.pageTo > 0 ?  Number(input.pageTo) : null,
        },
      },
      onError: (error) => {
        setUpdateLoader({[selectedTestVenueId]: false});
        dispatchCurrentSnackBar({
          payload: {
            open: true,
            type: 'error',
            message: error.message,
          },
        });
      },
      onCompleted: () => {
        refetch();
        setUpdateLoader({[selectedTestVenueId]: false});
        setOpenTestVenueUpdatePopUp(false);
        dispatchCurrentSnackBar({
          payload: {
            open: true,
            type: 'success',
            message: '성공적으로 수정되었습니다.',
          },
        });
      },
    });
  }

  const handleCloseConfirmDialog = (isConfirm: boolean) => {
    setOpenConfirmDialog(false);
    if (isConfirm) {
      setDeleteLoader({[selectedTestVenueId]: true});
      deleteTestVenue({
        variables: {
          deleteTestVenueId: selectedTestVenueId,
        },
        onError: (error) => {
          setDeleteLoader({[selectedTestVenueId]: false});
          dispatchCurrentSnackBar({
            payload: {
              open: true,
              type: 'error',
              message: error.message,
            },
          });
        },
        onCompleted: () => {
          refetch();
          setDeleteLoader({[selectedTestVenueId]: false});
          dispatchCurrentSnackBar({
            payload: {
              open: true,
              type: 'success',
              message: '성공적으로 삭제되었습니다.',
            },
          });
        },
      });
      setSelectedTestVenueId('');
    }
  }

  const getActionWidth = () => {
    if (testVenueStatus === TestVenueStatus.Open) {
      if (myRole === 'STUDENT') {
        return 40;
      }
      if (maxWidth490) {
        return 40;
      }
      return 120;
    } else if (testVenueStatus === TestVenueStatus.Closed && myRole !== 'STUDENT') {
      if (maxWidth490) {
        return 40;
      }
      return 80;
    } else if (testVenueStatus === TestVenueStatus.Ready && myRole !== 'STUDENT') {
      if (maxWidth490) {
        return 40;
      }
      return 120;
    }
    return 0;
  }

  const actions: GridColDef = {
    field: 'actions',
    type: 'actions',
    headerName: '작업',
    renderHeader: () => null,
    width: getActionWidth(),
    getActions: (params: GridRowParams<TestVenueItemsFragment>) => {
      if (testVenueStatus === TestVenueStatus.Open) {
        return myRole === 'STUDENT' ? [
          <GridActionsCellItem
            key="enter"
            icon={
              <Tooltip title={'입장'}>
                <Login color={params.row.year !== myYear || params.row.class !== myClass ? 'disabled' : 'primary'}/>
              </Tooltip>
            }
            label="입장"
            disabled={params.row.year !== myYear || params.row.class !== myClass}
            showInMenu={false}
            onClick={() => router.push(`/test-venues/${params.row.id}`)}
          />
        ] : [
          <GridActionsCellItem
            key="enter"
            icon={
              <Tooltip title={'입장'}>
                <Login color='primary'/>
              </Tooltip>
            }
            label="입장"
            showInMenu={maxWidth490}
            onClick={() => router.push(`/test-venues/${params.row.id}`)}
          />,
          <GridActionsCellItem
            key="edit"
            icon={
              getUpdateLoader[params.row.id] ?
              <CircularProgress style={{ width: '20px', height: '20px' }}/>  
              : 
              <Tooltip title={'수정'}>
                <Edit />
              </Tooltip>
            }
            label="수정"
            showInMenu={maxWidth490}
            onClick={() => {
              setSelectedTestVenueId(params.row.id);
              setTestVenue(params.row);
              setOpenTestVenueUpdatePopUp(true);
            }}
          />,
          <GridActionsCellItem
            key="close"
            icon={
              getCloseLoader[params.row.id] ?
              <CircularProgress style={{ width: '20px', height: '20px' }}/>  
              : 
              <Tooltip title={'닫기'}>
                <Cancel color="error" />
              </Tooltip>
            }
            label="닫기"
            showInMenu={maxWidth490}
            onClick={() => onClose(params.row.id)}
          />,
        ];
      } else if (testVenueStatus === TestVenueStatus.Closed && myRole !== 'STUDENT') {
        return [
          <GridActionsCellItem
            key="restore"
            icon={
              getRecoverLoader[params.row.id] ?
              <CircularProgress style={{ width: '20px', height: '20px' }}/>  
              : 
              <Tooltip title={'복구'}>
                <Restore color='primary' />
              </Tooltip>
            }
            label="복구"
            showInMenu={maxWidth490}
            onClick={() => onRestore(params.row.id)}
          />,
          <GridActionsCellItem
            key="delete"
            icon={
              getDeleteLoader[params.row.id] ?
              <CircularProgress style={{ width: '20px', height: '20px' }}/>  
              : 
              <Tooltip title={'삭제'}>
                <DeleteForever color="error" />
              </Tooltip>
            }
            label="삭제"
            showInMenu={maxWidth490}
            onClick={() => {
              setSelectedTestVenueId(params.row.id);
              setOpenConfirmDialog(true);
            }}
          />,
        ];
      } else if (testVenueStatus === TestVenueStatus.Ready && myRole !== 'STUDENT') {
        return [
          <GridActionsCellItem
            key="open"
            icon={
              getOpenLoader[params.row.id] ?
              <CircularProgress style={{ width: '20px', height: '20px' }}/>  
              : 
              <Tooltip title={'열기'}>
                <Start color='primary' />
              </Tooltip>
            }
            label="열기"
            showInMenu={maxWidth490}
            onClick={() => onOpen(params.row.id)}
          />,
          <GridActionsCellItem
            key="edit"
            icon={
              getUpdateLoader[params.row.id] ?
              <CircularProgress style={{ width: '20px', height: '20px' }}/>  
              : 
              <Tooltip title={'수정'}>
                <Edit />
              </Tooltip>
            }
            label="수정"
            showInMenu={maxWidth490}
            onClick={() => {
              setSelectedTestVenueId(params.row.id);
              setTestVenue(params.row);
              setOpenTestVenueUpdatePopUp(true);
            }}
          />,
          <GridActionsCellItem
            key="close"
            icon={
              getCloseLoader[params.row.id] ?
              <CircularProgress style={{ width: '20px', height: '20px' }}/>  
              : 
              <Tooltip title={'닫기'}>
                <Cancel color="error" />
              </Tooltip>
            }
            label="닫기"
            showInMenu={maxWidth490}
            onClick={() => onClose(params.row.id)}
          />,
        ];
      }
      return [];
    }
  };

  const columns: GridColDef[] = [
    { field: 'year', headerName: '학년', flex: 1, filterable: false, sortable: false },
    { field: 'class', headerName: '반', flex: 1, filterable: false, sortable: false },
    { 
      field: 'pageFrom', 
      headerName: '시작 페이지', 
      flex: 1, 
      filterable: false, 
      sortable: false,
      renderCell: (params: GridRenderCellParams<TestVenueItemsFragment>) => {
        if (!params.row.pageFrom || params.row.pageFrom === 0) {
          return <Typography display={'flex'} width={'100%'} justifyContent={'center'} alignItems={'center'}>-</Typography>;
        }
        return params.row.pageFrom;
      }
    },
    { 
      field: 'pageTo', 
      headerName: '끝 페이지', 
      flex: 1, 
      filterable: false, 
      sortable: false,
      renderCell: (params: GridRenderCellParams<TestVenueItemsFragment>) => {
        if (!params.row.pageTo || params.row.pageTo === 0) {
          return <Typography display={'flex'} width={'100%'} justifyContent={'center'} alignItems={'center'}>-</Typography>;
        }
        return params.row.pageTo;
      }
    },
    actions,
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
        rows={testVenues}
        pageSizeOptions={[10, 20, 50, 100]}
        paginationModel={paginationModel}
        onPaginationModelChange={(values, details) => {
          if (!details.reason) return;
          setPaginationModel(values);
        }}
        getRowHeight={() => 43}
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
                  siblingCount={1}
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
          '@media (max-width:750px)': {
            '&.MuiDataGrid-root .MuiDataGrid-main .MuiDataGrid-virtualScroller .MuiDataGrid-topContainer .MuiDataGrid-columnHeaders .MuiDataGrid-columnHeader .MuiDataGrid-columnHeaderDraggableContainer .MuiDataGrid-columnHeaderTitleContainer': {
              display: 'flex',
              justifyContent: 'center',
            },
            '&.MuiDataGrid-root .MuiDataGrid-main .MuiDataGrid-virtualScroller .MuiDataGrid-virtualScrollerContent .MuiDataGrid-virtualScrollerRenderZone .MuiDataGrid-row .MuiDataGrid-cell': {
              display: 'flex',
              justifyContent: 'center',
            }
          },
        }}
      />
      <ConfirmDialog
        open={openConfirmDialog}
        handleClose={handleCloseConfirmDialog}
        title={'주의'}
        content={'정말 삭제하시겠습니까? 삭제된 데이터는 복구할 수 없습니다.'}
      />
      {
        getTestVenue && selectedTestVenueId &&
        <TestVenueUpdatePopUp
          open={openTestVenueUpdatePopUp}
          setOpen={setOpenTestVenueUpdatePopUp}
          getTestVenue={getTestVenue}
          onUpdate={onUpdate}
          getLoader={getUpdateLoader[selectedTestVenueId]}
        />
      }
    </Box>
  );
}

export default TestVenueTable;