import { UserRequestItemsFragment, WordStatus } from "@/app/generated/gql/graphql";
import { useSnackbar } from "@/app/hooks/useSnackbar";
import { useMutation } from "@apollo/client";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, SyntheticEvent, useState } from "react";
import { DataGrid, GridActionsCellItem, GridColDef, GridPagination, GridRenderCellParams, GridRowParams } from "@mui/x-data-grid";
import { Box, CircularProgress, Stack, Tab, Tooltip } from "@mui/material";
import { CheckCircleOutline, Create, DeleteForever, HighlightOff, Restore } from "@mui/icons-material";
import korDicLogo from "../../../../assets/images/korDicLogo.png";
import naverLogo from "../../../../assets/images/naverLogo.png";
import { TabContext, TabList } from "@mui/lab";
import CustomNoRowsOverlay from "@/app/components/shared/CustomNoRowsOverlay";
import MuiPagination from '@mui/material/Pagination';
import { approveWordRequestMutation, deleteWordRequestMutation, denyWordRequestMutation, recoverWordRequestMutation, updateDeniedReasonMutation } from "@/app/components/request-management/RequestManagementTable/query";
import ConfirmDialog from "@/app/components/shared/ConfirmDialog";
import RequestManagementBulkAction from "@/app/components/request-management/RequestManagementTable/RequestManagementBulkAction/RequestManagementBulkAction";
import DeniedReasonPopUp from "@/app/components/shared/DeniedReasonPopUp";

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
  
  const [getApprovalLoader, setApprovalLoader] = useState<{ [key: string]: boolean }>({});
  const [getDenyLoader, setDenyLoader] = useState<{ [key: string]: boolean }>({});
  const [getRecoverLoader, setRecoverLoader] = useState<{ [key: string]: boolean }>({});
  const [getDeleteLoader, setDeleteLoader] = useState<{ [key: string]: boolean }>({});
  const [getDeniedReasonLoader, setDeniedReasonLoader] = useState<{ [key: string]: boolean }>({});
  const [openConfirmDialog, setOpenConfirmDialog] = useState<boolean>(false);
  const [openDeniedReasonPopUp, setOpenDeniedReasonPopUp] = useState<boolean>(false);
  const [selectedWordId, setSelectedWordId] = useState<string>('');
  const [selectedDeniedReason, setSelectedDeniedReason] = useState<string>('');
  const [selectedRequests, setSelectedRequests] = useState<string[]>([]);
  
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

  const handleTabChange = (event: SyntheticEvent, newValue: WordStatus) => {
    setWordRequestStatus(newValue);
    setSelectedRequests([]);
    router.push(`?status=${newValue}`);
  };
      
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
      renderCell: (params: GridRenderCellParams<UserRequestItemsFragment>) => {
        return (
          params.row.korDicResults && params.row.korDicResults.map((result, i) => {
            return params.row.korDicResults && params.row.korDicResults.length > 1 ? `${i+1}. ${result}\n` : result;
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
      renderCell: (params: GridRenderCellParams<UserRequestItemsFragment>) => {
        return (
          params.row.naverDicResults && params.row.naverDicResults.map((result, i) => {
            return params.row.naverDicResults && params.row.naverDicResults.length > 1 ? `${i+1}. ${result}\n` : result;
          })
        );
      }
    },
    { field: 'example', headerName: '예문', flex: 1, filterable: false, sortable: false },
    {
      field: 'actions',
      type: 'actions',
      width: wordRequestStatus !== WordStatus.Pending ? 40 : 80,
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
                onClick={() => {onRecover(params.row.id)}}
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
              onClick={() => {onRecover(params.row.id)}}
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
            showInMenu={false}
            onClick={() => {onApproval(params.row.id)}}
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
            showInMenu={false}
            onClick={() => {
              setSelectedWordId(params.row.id);
              setOpenDeniedReasonPopUp(true);
            }}
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
    <Box display={'flex'} alignItems={'center'} flexDirection={'column'} width={'100%'} mt={4}>
      <Stack width={'90%'} spacing={2} mb={2}>
        <TabContext value={wordRequestStatus}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList onChange={handleTabChange}>
              <Tab
                label="승인"
                value={WordStatus.Approved}
                {...a11yProps(WordStatus.Approved)}
              />
              <Tab
                label="승인 대기중"
                value={WordStatus.Pending}
                {...a11yProps(WordStatus.Pending)}
              />
              <Tab
                label="거절"
                value={WordStatus.Denied}
                {...a11yProps(WordStatus.Denied)}
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
            checkboxSelection
            keepNonExistentRowsSelected
            onRowSelectionModelChange={(newRowSelectionModel) => {
              setSelectedRequests(newRowSelectionModel as string[]);
            }}
            rowSelectionModel={selectedRequests || []}
            loading={loading}
            columns={columns}
            rows={userRequests || []}
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
                      count={pageInfo.pageCount || 0}
                      page={paginationModel.page+1}
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
              }
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
      </Stack>
    </Box>
  );
}

export default UserContainer;