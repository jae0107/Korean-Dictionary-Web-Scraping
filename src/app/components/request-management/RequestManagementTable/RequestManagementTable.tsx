import { Box, Button, Chip, CircularProgress, Tooltip, Typography, useMediaQuery } from "@mui/material";
import { DataGrid, GridActionsCellItem, GridColDef, GridColumnVisibilityModel, GridPagination, GridRenderCellParams, GridRowParams } from "@mui/x-data-grid";
import MuiPagination from '@mui/material/Pagination';
import CustomNoRowsOverlay from "../../shared/CustomNoRowsOverlay";
import { CheckCircleOutline, Create, DeleteForever, HighlightOff, Remove, Restore } from "@mui/icons-material";
import { RequestorItemsFragment, WordRequestItemsFragment, WordStatus } from "@/app/generated/gql/graphql";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import korDicLogo from "../../../../assets/images/korDicLogo.png";
import naverLogo from "../../../../assets/images/naverLogo.png";
import UserInfoPopUp from "./UserInfoPopUp/UserInfoPopUp";
import { useMutation } from "@apollo/client";
import { approveWordRequestMutation, deleteWordRequestMutation, denyWordRequestMutation, recoverWordRequestMutation, updateDeniedReasonMutation } from "./query";
import { useSnackbar } from "@/app/hooks/useSnackbar";
import ConfirmDialog from "../../shared/ConfirmDialog";
import RequestManagementBulkAction from "./RequestManagementBulkAction/RequestManagementBulkAction";
import DeniedReasonPopUp from "../../shared/DeniedReasonPopUp";
import CustomExportToolbar from "../../shared/CustomExportToolbar";
import DetailPopUP from "./DetailPopUP/DetailPopUP";

const RequestManagementTable = ({
  loading,
  words,
  pageCount,
  page,
  paginationModel,
  setPaginationModel,
  wordRequestStatus,
  refetch,
  selectedRequests,
  setSelectedRequests,
} : {
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
  refetch: () => void;
  selectedRequests: string[];
  setSelectedRequests: (value: string[]) => void;
}) => {
  const { dispatchCurrentSnackBar } = useSnackbar();
  const maxWidth360 = useMediaQuery('(max-width:360px)');
  const maxWidth495 = useMediaQuery('(max-width:495px)');
  const maxWidth545 = useMediaQuery('(max-width:545px)');
  const maxWidth750 = useMediaQuery('(max-width:750px)');
  const maxWidth850 = useMediaQuery('(max-width:850px)');
  const maxWidth1000 = useMediaQuery('(max-width:1000px)');
  
  const [getRequestor, setRequestor] = useState<RequestorItemsFragment | null>(null);
  const [openUserInfoPopUp, setOpenUserInfoPopUp] = useState<boolean>(false);
  const [getApprovalLoader, setApprovalLoader] = useState<{ [key: string]: boolean }>({});
  const [getDenyLoader, setDenyLoader] = useState<{ [key: string]: boolean }>({});
  const [getRecoverLoader, setRecoverLoader] = useState<{ [key: string]: boolean }>({});
  const [getDeleteLoader, setDeleteLoader] = useState<{ [key: string]: boolean }>({});
  const [getDeniedReasonLoader, setDeniedReasonLoader] = useState<{ [key: string]: boolean }>({});
  const [openConfirmDialog, setOpenConfirmDialog] = useState<boolean>(false);
  const [openDeniedReasonPopUp, setOpenDeniedReasonPopUp] = useState<boolean>(false);
  const [selectedWordId, setSelectedWordId] = useState<string>('');
  const [selectedDeniedReason, setSelectedDeniedReason] = useState<string>('');
  const [openDetailPopUp, setOpenDetailPopUp] = useState<boolean>(false);
  const [getWordRequest, setWordRequest] = useState<WordRequestItemsFragment | null>(null);
  const [columnVisibilityModel, setColumnVisibilityModel] = useState<GridColumnVisibilityModel>({
      page: !maxWidth850,
      requestor: !maxWidth1000,
      example: !maxWidth750,
      title: true,
      korDicResults: !maxWidth750,
      naverDicResults: !maxWidth750,
      detail: maxWidth750,
      deniedReason: wordRequestStatus === WordStatus.Denied || maxWidth545,
    });
  
    useEffect(() => {
      setColumnVisibilityModel({
        page: !maxWidth850,
        requestor: !maxWidth1000,
        example: !maxWidth750,
        title: columnVisibilityModel.title,
        korDicResults: !maxWidth750,
        naverDicResults: !maxWidth750,
        detail: maxWidth750,
        deniedReason: wordRequestStatus === WordStatus.Denied || maxWidth545,
      });
    }, [maxWidth495, maxWidth750, maxWidth850, maxWidth1000]);

  const [approveWordRequest] = useMutation(approveWordRequestMutation);
  const [denyWordRequest] = useMutation(denyWordRequestMutation);
  const [recoverWordRequest] = useMutation(recoverWordRequestMutation);
  const [deleteWordRequest] = useMutation(deleteWordRequestMutation);
  const [updateDeniedReason] = useMutation(updateDeniedReasonMutation);

  const onApproval = (id: string) => {
    setApprovalLoader({[id]: true});
    approveWordRequest({
      variables: {
        approveWordRequestId: id,
      },
      onError: (error) => {
        setApprovalLoader({[id]: false});
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
        setSelectedRequests([]);
        setApprovalLoader({[id]: false});
        dispatchCurrentSnackBar({
          payload: {
            open: true,
            type: 'success',
            message: '성공적으로 승인되었습니다.',
          },
        });
      },
    });
  }

  const onDeny = (id: string, deniedReason: string) => {
    setDenyLoader({[id]: true});
    denyWordRequest({
      variables: {
        denyWordRequestId: id,
        deniedReason: deniedReason,
      },
      onError: (error) => {
        setDenyLoader({[id]: false});
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
        setSelectedRequests([]);
        setDenyLoader({[id]: false});
        dispatchCurrentSnackBar({
          payload: {
            open: true,
            type: 'success',
            message: '성공적으로 거절되었습니다.',
          },
        });
      },
    });
  }

  const onRecover = (id: string) => {
    setRecoverLoader({[id]: true});
    recoverWordRequest({
      variables: {
        recoverWordRequestId: id,
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
        setSelectedRequests([]);
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

  const columns: GridColDef[] = [
    { 
      field: 'page', 
      headerName: '페이지', 
      headerClassName: 'page-header',
      cellClassName: 'page-cell',
      width: 60, 
      filterable: false, 
      sortable: false,
      renderCell: (params: GridRenderCellParams<WordRequestItemsFragment>) => {
        return (
          params.row.page ? params.row.page : <Typography display={'flex'} width={'100%'} justifyContent={'center'} alignItems={'center'}>-</Typography>
        );
      }
    },
    { 
      field: 'title', 
      headerName: '단어', 
      width: 120, 
      filterable: false, 
      sortable: false,
      flex: maxWidth750 ? 1 : 0,
    },
    { 
      field: 'detail', 
      headerName: '더보기', 
      width: 120, 
      filterable: false, 
      sortable: false,
      flex: maxWidth750 ? 1 : 0,
      renderCell: (params: GridRenderCellParams<WordRequestItemsFragment>) => {
        return (
          <Button 
            variant='text' 
            color='info'
            onClick={() => {
              setWordRequest(params.row);
              setOpenDetailPopUp(true);
            }}
          >
            더보기 클릭
          </Button>
        );
      }
    },
    { 
      field: 'korDicResults', 
      headerName: '국립국어원', 
      headerClassName: 'korDic-header',
      cellClassName: 'korDic-cell',
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
          params.row.korDicResults && params.row.korDicResults.length > 0 ? params.row.korDicResults.map((result, i) => {
            return params.row.korDicResults && params.row.korDicResults.length > 1 ? `${i+1}. ${result}\n` : result;
          }) : <Typography display={'flex'} width={'100%'} justifyContent={'center'} alignItems={'center'}>-</Typography>
        );
      }
    },
    { 
      field: 'naverDicResults', 
      headerName: '네이버', 
      headerClassName: 'naver-header',
      cellClassName: 'naver-cell',
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
          params.row.naverDicResults && params.row.naverDicResults.length > 0 ? params.row.naverDicResults.map((result, i) => {
            return params.row.naverDicResults && params.row.naverDicResults.length > 1 ? `${i+1}. ${result}\n` : result;
          }) : <Typography display={'flex'} width={'100%'} justifyContent={'center'} alignItems={'center'}>-</Typography>
        );
      }
    },
    { 
      field: 'example',
      headerName: '예문', 
      headerClassName: 'example-header',
      cellClassName: 'example-cell',
      flex: 1, 
      filterable: false, 
      sortable: false,
      renderCell: (params: GridRenderCellParams<WordRequestItemsFragment>) => {
        return (
          params.row.example ? params.row.example : <Typography display={'flex'} width={'100%'} justifyContent={'center'} alignItems={'center'}>-</Typography>
        );
      }
    },
    { 
      field: 'requestor', 
      headerName: '요청자', 
      headerClassName: 'requestor-header',
      cellClassName: 'requestor-cell',
      width: 100, 
      filterable: false, 
      sortable: false,
      renderCell: (params: GridRenderCellParams<WordRequestItemsFragment>) => {
        return (
          params.row.requestor ?
          <Box display={'flex'} width={'100%'} justifyContent={'center'} alignItems={'center'}>
            <Chip 
              label={params.row.requestor.name} 
              color="primary" 
              variant="outlined" 
              onClick={() => {
                setRequestor(params.row.requestor);
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
      width: wordRequestStatus !== WordStatus.Pending || maxWidth360 ? 40 : 80,
      getActions: (params: GridRowParams<WordRequestItemsFragment>) => {
        if (params.row.status === 'APPROVED') {
          return [
            <GridActionsCellItem
              key="deny"
              icon={
                getDenyLoader[params.row.id] ?
                <CircularProgress style={{ width: '20px', height: '20px' }}/>  
                : 
                <Tooltip title={'거절'}>
                  <HighlightOff color="error" />
                </Tooltip>
              }
              label="거절"
              showInMenu={false}
              onClick={() => {
                setSelectedWordId(params.row.id);
                setOpenDeniedReasonPopUp(true);
              }}
            />
          ];
        } else if (params.row.status === 'DENIED') {
          if (getRecoverLoader[params.row.id] || getDeleteLoader[params.row.id] || getDeniedReasonLoader[params.row.id]) {
            return [
              <GridActionsCellItem
                key="more"
                icon={<CircularProgress style={{ width: '20px', height: '20px' }}/>}
                label="더보기"
                showInMenu={false}
              />
            ];
          }
          return [
            <GridActionsCellItem
              key="recover"
              icon={
                getRecoverLoader[params.row.id] ?
                <CircularProgress style={{ width: '20px', height: '20px' }}/>  
                : 
                <Restore color='primary' />
              }
              label="복구"
              showInMenu={true}
              onClick={() => onRecover(params.row.id)}
              dense={maxWidth495}
            />,
            <GridActionsCellItem
              key="delete"
              icon={
                getDeleteLoader[params.row.id] ?
                <CircularProgress style={{ width: '20px', height: '20px' }}/>  
                : 
                <DeleteForever color="error" />
              }
              label="삭제"
              showInMenu={true}
              onClick={() => {
                setSelectedWordId(params.row.id);
                setOpenConfirmDialog(true);
              }}
              dense={maxWidth495}
            />,
            <GridActionsCellItem
              key="reason"
              icon={
                getDeniedReasonLoader[params.row.id] ?
                <CircularProgress style={{ width: '20px', height: '20px' }}/>  
                : 
                <Create color='action'/>
              }
              label="거절 사유"
              showInMenu={true}
              onClick={() => {
                setSelectedWordId(params.row.id);
                setSelectedDeniedReason(params.row.deniedReason || '');
                setOpenDeniedReasonPopUp(true);
              }}
              dense={maxWidth495}
            />
          ];
        }
        if (maxWidth360 && (getApprovalLoader[params.row.id] || getDenyLoader[params.row.id])) {
          return [
            <GridActionsCellItem
              key="more"
              icon={<CircularProgress style={{ width: '20px', height: '20px' }}/>}
              label="더보기"
              showInMenu={false}
            />
          ];
        }
        return [
          <GridActionsCellItem
            key="approve"
            icon={
              getApprovalLoader[params.row.id] ?
              <CircularProgress style={{ width: '20px', height: '20px' }}/>  
              : 
              <Tooltip title={'승인'}>
                <CheckCircleOutline color="success" />
              </Tooltip>
            }
            label="승인"
            showInMenu={maxWidth360}
            dense={maxWidth360}
            onClick={() => onApproval(params.row.id)}
          />,
          <GridActionsCellItem
            key="deny"
            icon={
              getDenyLoader[params.row.id] ?
              <CircularProgress style={{ width: '20px', height: '20px' }}/>  
              : 
              <Tooltip title={'거절'}>
                <HighlightOff color="error" />
              </Tooltip>
            }
            label="거절"
            showInMenu={maxWidth360}
            dense={maxWidth360}
            onClick={() => {
              setSelectedWordId(params.row.id);
              setOpenDeniedReasonPopUp(true);
            }}
          />
        ]
      }
    }
  ];

  if (wordRequestStatus === 'DENIED' && !maxWidth545) {
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

  const handleCloseConfirmDialog = (isConfirm: boolean) => {
    setOpenConfirmDialog(false);
    if (isConfirm) {
      setDeleteLoader({[selectedWordId]: true});
      deleteWordRequest({
        variables: {
          deleteWordRequestId: selectedWordId,
        },
        onError: (error) => {
          setDeleteLoader({[selectedWordId]: false});
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
          setSelectedRequests([]);
          setDeleteLoader({[selectedWordId]: false});
          dispatchCurrentSnackBar({
            payload: {
              open: true,
              type: 'success',
              message: '성공적으로 삭제되었습니다.',
            },
          });
        },
      });
    }
    setSelectedWordId('');
  }

  const handleCloseDeniedReasonPopUp = (isConfirm: boolean, deniedReason: string) => {
    setOpenDeniedReasonPopUp(false);
    if (isConfirm) {
      if (wordRequestStatus === WordStatus.Denied) {
        setDeniedReasonLoader({[selectedWordId]: true});
        updateDeniedReason({
          variables: {
            updateDeniedReasonId: selectedWordId,
            deniedReason: deniedReason,
          },
          onError: (error) => {
            setDeniedReasonLoader({[selectedWordId]: false});
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
            setSelectedRequests([]);
            setDeniedReasonLoader({[selectedWordId]: false});
            dispatchCurrentSnackBar({
              payload: {
                open: true,
                type: 'success',
                message: '성공적으로 거절 사유가 제출되었습니다.',
              },
            });
          },
        });
      } else {
        onDeny(selectedWordId, deniedReason);
      }
    }
      
    setSelectedWordId('');
    setSelectedDeniedReason('');
  }
  
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
      <RequestManagementBulkAction
        ids={selectedRequests}
        setSelectedRequests={setSelectedRequests}
        status={wordRequestStatus}
        refetch={refetch}
      />
      <DataGrid
        pagination
        disableColumnMenu
        checkboxSelection
        keepNonExistentRowsSelected
        onRowSelectionModelChange={(newRowSelectionModel) => {
          setSelectedRequests(newRowSelectionModel as string[]);
        }}
        rowSelectionModel={selectedRequests || []}
        disableRowSelectionOnClick
        loading={loading}
        columns={columns}
        rows={words}
        pageSizeOptions={[10, 20, 50, 100]}
        columnVisibilityModel={columnVisibilityModel}
        onColumnVisibilityModelChange={(newModel) => setColumnVisibilityModel(newModel)}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
          columns: {
            columnVisibilityModel: columnVisibilityModel,
          }
        }}
        paginationModel={paginationModel}
        onPaginationModelChange={(values, details) => {
          if (!details.reason) return;
          setPaginationModel(values);
        }}
        getRowHeight={() => 'auto'}
        slots={{
          noRowsOverlay: CustomNoRowsOverlay,
          ...(maxWidth1000 ? { toolbar:() =>  <CustomExportToolbar/> } : {}),
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
          }
        }}
      />
      <UserInfoPopUp
        getRequestor={getRequestor}
        setRequestor={setRequestor}
        setOpenUserInfoPopUp={setOpenUserInfoPopUp}
        openUserInfoPopUp={openUserInfoPopUp}
      />
      <ConfirmDialog
        open={openConfirmDialog}
        handleClose={handleCloseConfirmDialog}
        title={'주의'}
        content={'정말 삭제하시겠습니까? 삭제된 데이터는 복구할 수 없습니다.'}
      />
      <DeniedReasonPopUp
        open={openDeniedReasonPopUp}
        handleClose={handleCloseDeniedReasonPopUp}
        getDeniedReason={selectedDeniedReason}
        setDeniedReason={setSelectedDeniedReason}
      />
      <DetailPopUP
        openDetailPopUp={openDetailPopUp}
        setOpenDetailPopUp={setOpenDetailPopUp}
        getWordRequest={getWordRequest}
        setWordRequest={setWordRequest}
        setRequestor={setRequestor}
        setOpenUserInfoPopUp={setOpenUserInfoPopUp}
      />
    </Box>
  );
}

export default RequestManagementTable;