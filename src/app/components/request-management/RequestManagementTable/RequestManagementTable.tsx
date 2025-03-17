import { Box, Button, Chip, CircularProgress, IconButton, Tooltip, Typography, useMediaQuery } from "@mui/material";
import { DataGrid, GridActionsCellItem, GridColDef, GridColumnVisibilityModel, GridPagination, GridRenderCellParams, GridRowParams } from "@mui/x-data-grid";
import MuiPagination from '@mui/material/Pagination';
import CustomNoRowsOverlay from "../../shared/CustomNoRowsOverlay";
import { CheckCircleOutline, Create, DeleteForever, Groups, HighlightOff, Remove, Restore, Search } from "@mui/icons-material";
import { RequestorItemsFragment, SortOptions, WordRequestItemsFragment, WordStatus } from "@/app/generated/gql/graphql";
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
import RequestDetailPopUp from "./RequestDetailPopUp/RequestDetailPopUp";
import RequestorsPopUp from "./RequestorsPopUp/RequestorsPopUp";
import DuplicatedRequestPopUp from "./DuplicatedRequestPopUp/DuplicatedRequestPopUp";

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
  setTitleSort,
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
  setTitleSort: Dispatch<SetStateAction<SortOptions | null>>;
}) => {
  const { dispatchCurrentSnackBar } = useSnackbar();
  const maxWidth360 = useMediaQuery('(max-width:360px)');
  const maxWidth495 = useMediaQuery('(max-width:495px)');
  const maxWidth545 = useMediaQuery('(max-width:545px)');
  const maxWidth750 = useMediaQuery('(max-width:750px)');
  const maxWidth850 = useMediaQuery('(max-width:850px)');
  const maxWidth1000 = useMediaQuery('(max-width:1000px)');
  
  const [getRequestor, setRequestor] = useState<RequestorItemsFragment | null>(null);
  const [getRequestors, setRequestors] = useState<RequestorItemsFragment[]>([]);
  const [openUserInfoPopUp, setOpenUserInfoPopUp] = useState<boolean>(false);
  const [openRequestorsPopUp, setOpenRequestorsPopUp] = useState<boolean>(false);
  const [openDuplicatedRequestPopUp, setOpenDuplicatedRequestPopUp] = useState<boolean>(false);
  const [getApprovalLoader, setApprovalLoader] = useState<{ [key: string]: boolean }>({});
  const [getDenyLoader, setDenyLoader] = useState<{ [key: string]: boolean }>({});
  const [getRecoverLoader, setRecoverLoader] = useState<{ [key: string]: boolean }>({});
  const [getDeleteLoader, setDeleteLoader] = useState<{ [key: string]: boolean }>({});
  const [getDeniedReasonLoader, setDeniedReasonLoader] = useState<{ [key: string]: boolean }>({});
  const [openConfirmDialog, setOpenConfirmDialog] = useState<boolean>(false);
  const [openDeniedReasonPopUp, setOpenDeniedReasonPopUp] = useState<boolean>(false);
  const [selectedWordId, setSelectedWordId] = useState<string>('');
  const [selectedReferenceWordId, setSelectedReferenceWordId] = useState<string>('');
  const [selectedDeniedReason, setSelectedDeniedReason] = useState<string>('');
  const [openRequestDetailPopUp, setOpenRequestDetailPopUp] = useState<boolean>(false);
  const [getWordRequest, setWordRequest] = useState<WordRequestItemsFragment | null>(null);
  const [columnVisibilityModel, setColumnVisibilityModel] = useState<GridColumnVisibilityModel>({
    pages: !maxWidth850,
    requestor: !maxWidth1000,
    examples: !maxWidth750,
    title: true,
    korDicResults: !maxWidth750,
    naverDicResults: !maxWidth750,
    detail: maxWidth750,
    deniedReason: wordRequestStatus === WordStatus.Denied || maxWidth545,
  });
  
  useEffect(() => {
    setColumnVisibilityModel({
      pages: !maxWidth850,
      requestor: !maxWidth1000,
      examples: !maxWidth750,
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
        handleCloseRequestDetailPopUp();
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
        handleCloseRequestDetailPopUp();
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
        handleCloseRequestDetailPopUp();
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

  const getRequestorChip = (requestors?: RequestorItemsFragment[] | null) => {
    if (!requestors || requestors.length === 0) {
      return <Remove/>;
    } else if (requestors.length === 1) {
      return (
        <Chip 
          label={requestors[0].name} 
          color="primary" 
          variant="outlined" 
          onClick={() => {
            setRequestor(requestors[0]);
            setOpenUserInfoPopUp(true);
          }} 
        /> 
      );
    }
    return (
      <IconButton 
        color='primary' 
        sx={{ border: 'solid 1px' }}
        onClick={() => {
          setRequestors(requestors);
          setOpenRequestorsPopUp(true);
        }}
      >
        <Groups/>
      </IconButton>
    );
  }

  const actions: GridColDef = {
    field: 'actions',
    type: 'actions',
    headerName: '작업',
    renderHeader: () => null,
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
            dense={maxWidth495 ? true : undefined}
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
            dense={maxWidth495 ? true : undefined}
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
            dense={maxWidth495 ? true : undefined}
          />
        ];
      } else if (params.row.status === 'DUPLICATED') {
        return [
          <GridActionsCellItem
            key="detail"
            icon={
              getApprovalLoader[params.row.id] || getDenyLoader[params.row.id] ?
              <CircularProgress style={{ width: '20px', height: '20px' }}/>  
              : 
              <Tooltip title={'더보기'}>
                <Search />
              </Tooltip>
            }
            label="더보기"
            showInMenu={false}
            onClick={() => {
              params.row.wordId && setSelectedReferenceWordId(params.row.wordId);
              setWordRequest(params.row);
              setSelectedWordId(params.row.id);
              setOpenDuplicatedRequestPopUp(true);
            }}
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
          dense={maxWidth360 ? true : undefined}
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
          dense={maxWidth360 ? true : undefined}
          onClick={() => {
            setSelectedWordId(params.row.id);
            setOpenDeniedReasonPopUp(true);
          }}
        />
      ]
    }
  };

  const columns: GridColDef[] = maxWidth750 ? [
    { 
      field: 'title', 
      headerName: '단어', 
      width: 120, 
      filterable: false, 
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
              setSelectedWordId(params.row.id);
              setWordRequest(params.row);
              if (wordRequestStatus !== WordStatus.Duplicated) {
                setOpenRequestDetailPopUp(true);
              } else {
                params.row.wordId && setSelectedReferenceWordId(params.row.wordId);
                setOpenDuplicatedRequestPopUp(true);
              }
            }}
          >
            더보기 클릭
          </Button>
        );
      }
    },
    actions
  ] : [
    { 
      field: 'pages', 
      headerName: '페이지', 
      headerClassName: 'page-header',
      cellClassName: 'page-cell',
      width: 65, 
      filterable: false, 
      sortable: false,
      renderCell: (params: GridRenderCellParams<WordRequestItemsFragment>) => {
        if (!params.row.pages || params.row.pages.length === 0) {
          return <Typography display={'flex'} width={'100%'} justifyContent={'center'} alignItems={'center'}>-</Typography>;
        }
        if (params.row.pages.length === 1) {
          return params.row.pages[0];
        }
        return params.row.pages.map((page) => `• ${page}\n`);
      }
    },
    { 
      field: 'title', 
      headerName: '단어', 
      width: 120, 
      filterable: false, 
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
      field: 'examples',
      headerName: '예문', 
      headerClassName: 'example-header',
      cellClassName: 'example-cell',
      flex: 1, 
      filterable: false, 
      sortable: false,
      renderCell: (params: GridRenderCellParams<WordRequestItemsFragment>) => {
        if (!params.row.examples || params.row.examples.length === 0) {
          return <Typography display={'flex'} width={'100%'} justifyContent={'center'} alignItems={'center'}>-</Typography>;
        }
        if (params.row.examples.length === 1) {
          return params.row.examples[0];
        }
        return (
          params.row.examples.map((example, i) => `${i+1}. ${example}\n`)
        );
      }
    },
    { 
      field: 'requestors', 
      headerName: '요청자', 
      headerClassName: 'requestor-header',
      cellClassName: 'requestor-cell',
      width: 100, 
      filterable: false, 
      sortable: false,
      renderCell: (params: GridRenderCellParams<WordRequestItemsFragment>) => {
        return (
          <Box display={'flex'} width={'100%'} justifyContent={'center'} alignItems={'center'}>
            {getRequestorChip(params.row.requestors)}
          </Box>
        );
      },
    },
    actions
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
          handleCloseRequestDetailPopUp();
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
    !openRequestDetailPopUp && setSelectedWordId('');
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
            handleCloseRequestDetailPopUp();
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
    
    if (!openRequestDetailPopUp) {
      setSelectedWordId('');
      setSelectedDeniedReason('');
    }
  }

  const handleCloseRequestDetailPopUp = () => {
    setOpenRequestDetailPopUp(false);
    setOpenDuplicatedRequestPopUp(false);
    setSelectedWordId('');
    setSelectedReferenceWordId('');
    setWordRequest(null);
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
      {
        wordRequestStatus !== WordStatus.Duplicated && 
        <RequestManagementBulkAction
          ids={selectedRequests}
          setSelectedRequests={setSelectedRequests}
          status={wordRequestStatus}
          refetch={refetch}
        />
      }
      <DataGrid
        pagination
        disableColumnMenu
        hideFooterSelectedRowCount
        checkboxSelection={wordRequestStatus !== WordStatus.Duplicated}
        keepNonExistentRowsSelected={wordRequestStatus !== WordStatus.Duplicated}
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
        onSortModelChange={(newSortModel) => {
          if (newSortModel.length === 0) {
            setTitleSort(null);
          } else if (newSortModel[0].field === 'title') {
            setTitleSort(newSortModel[0].sort === 'asc' ? SortOptions.Asc : SortOptions.Desc);
          }
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
                  siblingCount={1}
                  showFirstButton
                  showLastButton
                  count={pageCount}
                  page={page+1}
                  onChange={(event, page) => 
                    setPaginationModel((value) => {
                      setSelectedRequests([]);
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
      <RequestDetailPopUp
        openRequestDetailPopUp={openRequestDetailPopUp}
        getWordRequest={getWordRequest}
        setRequestor={setRequestor}
        setOpenUserInfoPopUp={setOpenUserInfoPopUp}
        handleClose={handleCloseRequestDetailPopUp}
        selectedWordId={selectedWordId}
        onApproval={onApproval}
        onRecover={onRecover}
        setOpenDeniedReasonPopUp={setOpenDeniedReasonPopUp}
        setOpenConfirmDialog={setOpenConfirmDialog}
        setSelectedDeniedReason={setSelectedDeniedReason}
        getApprovalLoader={getApprovalLoader[selectedWordId]}
        getRecoverLoader={getRecoverLoader[selectedWordId]}
        getDenyLoader={getDenyLoader[selectedWordId]}
        getDeniedReasonLoader={getDeniedReasonLoader[selectedWordId]}
        getDeleteLoader={getDeleteLoader[selectedWordId]}
      />
      <RequestorsPopUp
        getRequestors={getRequestors}
        setRequestors={setRequestors}
        openRequestorsPopUp={openRequestorsPopUp}
        setOpenRequestorsPopUp={setOpenRequestorsPopUp}
      />
      {
        selectedReferenceWordId && getWordRequest &&
        <DuplicatedRequestPopUp
          openDuplicatedRequestPopUp={openDuplicatedRequestPopUp}
          getWordRequest={getWordRequest}
          handleClose={handleCloseRequestDetailPopUp}
          selectedReferenceWordId={selectedReferenceWordId}
          getApprovalLoader={getApprovalLoader[selectedWordId]}
          setApprovalLoader={setApprovalLoader}
          setOpenDeniedReasonPopUp={setOpenDeniedReasonPopUp}
          getDenyLoader={getDenyLoader[selectedWordId]}
          setOpenUserInfoPopUp={setOpenUserInfoPopUp}
          setRequestor={setRequestor}
          refetch={refetch}
        />
      }
    </Box>
  );
}

export default RequestManagementTable;