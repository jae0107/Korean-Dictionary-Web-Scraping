import { UserRequestItemsFragment, WordRequestItemsFragment, WordStatus } from "@/app/generated/gql/graphql";
import { useSnackbar } from "@/app/hooks/useSnackbar";
import { useMutation } from "@apollo/client";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, SyntheticEvent, useEffect, useState } from "react";
import { DataGrid, GridActionsCellItem, GridColDef, GridColumnVisibilityModel, GridPagination, GridRenderCellParams, GridRowParams } from "@mui/x-data-grid";
import { Box, Button, CircularProgress, Stack, Tab, Tooltip, Typography, useMediaQuery } from "@mui/material";
import { CheckCircleOutline, Create, DeleteForever, HighlightOff, Restore, Search } from "@mui/icons-material";
import korDicLogo from "../../../../../assets/images/korDicLogo.png";
import naverLogo from "../../../../../assets/images/naverLogo.png";
import { TabContext, TabList } from "@mui/lab";
import CustomNoRowsOverlay from "@/app/components/shared/CustomNoRowsOverlay";
import MuiPagination from '@mui/material/Pagination';
import { approveWordRequestMutation, deleteWordRequestMutation, denyWordRequestMutation, recoverWordRequestMutation, updateDeniedReasonMutation } from "@/app/components/request-management/RequestManagementTable/query";
import ConfirmDialog from "@/app/components/shared/ConfirmDialog";
import RequestManagementBulkAction from "@/app/components/request-management/RequestManagementTable/RequestManagementBulkAction/RequestManagementBulkAction";
import DeniedReasonPopUp from "@/app/components/shared/DeniedReasonPopUp";
import CustomExportToolbar from "@/app/components/shared/CustomExportToolbar";
import RequestDetailPopUp from "@/app/components/request-management/RequestManagementTable/RequestDetailPopUp/RequestDetailPopUp";
import DuplicatedRequestPopUp from "@/app/components/request-management/RequestManagementTable/DuplicatedRequestPopUp/DuplicatedRequestPopUp";

const a11yProps = (index: string) => {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
};

const UserContainer = ({
  wordRequestStatus,
  setWordRequestStatus,
  paginationModel,
  setPaginationModel,
  refetch,
  userRequests,
  pageInfo,
  loading,
} : {
  wordRequestStatus: WordStatus;
  setWordRequestStatus: (value: WordStatus) => void;
  paginationModel: {
    page: number;
    pageSize: number;
  };
  setPaginationModel: Dispatch<SetStateAction<{
    page: number;
    pageSize: number;
  }>>;
  refetch: () => void;
  userRequests: UserRequestItemsFragment[];
  pageInfo: {
    totalRowCount: number,
    pageCount: number,
  };
  loading: boolean;
}) => {
  const router = useRouter();
  const { dispatchCurrentSnackBar } = useSnackbar();
  const maxWidth360 = useMediaQuery('(max-width:360px)');
  const maxWidth495 = useMediaQuery('(max-width:495px)');
  const maxWidth545 = useMediaQuery('(max-width:545px)');
  const maxWidth750 = useMediaQuery('(max-width:750px)');
  const maxWidth850 = useMediaQuery('(max-width:850px)');
  const maxWidth1000 = useMediaQuery('(max-width:1000px)');
  
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
  const [selectedRequests, setSelectedRequests] = useState<string[]>([]);
  const [openRequestDetailPopUp, setOpenRequestDetailPopUp] = useState<boolean>(false);
  const [openDuplicatedRequestPopUp, setOpenDuplicatedRequestPopUp] = useState<boolean>(false);
  const [getWordRequest, setWordRequest] = useState<WordRequestItemsFragment | null>(null);
  const [columnVisibilityModel, setColumnVisibilityModel] = useState<GridColumnVisibilityModel>({
    pages: !maxWidth850,
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
      pages: !maxWidth850,
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

  const handleTabChange = (event: SyntheticEvent, newValue: WordStatus) => {
    setWordRequestStatus(newValue);
    setSelectedRequests([]);
    router.push(`?status=${newValue}`);
  };

  const actions: GridColDef = {
    field: 'actions',
    type: 'actions',
    headerName: '작업',
    renderHeader: () => null,
    width: wordRequestStatus !== WordStatus.Pending || maxWidth360 ? 40 : 80,
    getActions: (params: GridRowParams<UserRequestItemsFragment>) => {
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
  };
      
  const columns: GridColDef[] = maxWidth750 ? [
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
      width: 65, 
      filterable: false, 
      sortable: false,
      renderCell: (params: GridRenderCellParams<UserRequestItemsFragment>) => {
        if (!params.row.pages || params.row.pages.length === 0) {
          return <Typography display={'flex'} width={'100%'} justifyContent={'center'} alignItems={'center'}>-</Typography>;
        }
        if (params.row.pages.length === 1) {
          return params.row.pages[0];
        }
        return params.row.pages.map((page) => `• ${page}\n`);
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
      renderCell: (params: GridRenderCellParams<UserRequestItemsFragment>) => {
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
      renderCell: (params: GridRenderCellParams<UserRequestItemsFragment>) => {
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
      flex: 1, 
      filterable: false, 
      sortable: false,
      renderCell: (params: GridRenderCellParams<UserRequestItemsFragment>) => {
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
    actions,
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
    <Box display={'flex'} alignItems={'center'} flexDirection={'column'} width={'100%'} mt={4}>
      <Stack 
        width={'90%'} 
        spacing={2} 
        mb={2}
        sx={{
          '@media (max-width:545px)': {
            width: '95% !important',
          }
        }}
      >
        <TabContext value={wordRequestStatus}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList onChange={handleTabChange}>
              <Tab
                label="승인"
                value={WordStatus.Approved}
                {...a11yProps(WordStatus.Approved)}
                sx={{
                  '@media (max-width:420px)': {
                    minWidth: 'unset',
                  }
                }}
              />
              <Tab
                label="승인 대기중"
                value={WordStatus.Pending}
                {...a11yProps(WordStatus.Pending)}
                sx={{
                  '@media (max-width:420px)': {
                    flex: 2,
                    minWidth: 'unset',
                  }
                }}
              />
              <Tab
                label="중복"
                value={WordStatus.Duplicated}
                {...a11yProps(WordStatus.Duplicated)}
                sx={{
                  '@media (max-width:420px)': {
                    minWidth: 'unset',
                  }
                }}
              />
              <Tab
                label="거절"
                value={WordStatus.Denied}
                {...a11yProps(WordStatus.Denied)}
                sx={{
                  '@media (max-width:420px)': {
                    minWidth: 'unset',
                  }
                }}
              />
            </TabList>
          </Box>
        </TabContext>
        <Box>
          <RequestManagementBulkAction
            ids={selectedRequests}
            setSelectedRequests={setSelectedRequests}
            status={wordRequestStatus}
            refetch={refetch}
          />
          <DataGrid
            pagination
            disableColumnMenu
            checkboxSelection={wordRequestStatus !== WordStatus.Duplicated}
            disableRowSelectionOnClick
            keepNonExistentRowsSelected={wordRequestStatus !== WordStatus.Duplicated}
            onRowSelectionModelChange={(newRowSelectionModel) => {
              setSelectedRequests(newRowSelectionModel as string[]);
            }}
            rowSelectionModel={selectedRequests || []}
            loading={loading}
            columns={columns}
            rows={userRequests || []}
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
                      siblingCount={1}
                      showFirstButton
                      showLastButton
                      count={pageInfo.pageCount || 0}
                      page={paginationModel.page+1}
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
        </Box>
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
            refetch={refetch}
          />
        }
      </Stack>
    </Box>
  );
}

export default UserContainer;