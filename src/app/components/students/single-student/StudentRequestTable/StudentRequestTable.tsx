import { StudentRequestItemsFragment, WordStatus } from "@/app/generated/gql/graphql";
import usePaginationModel from "@/app/hooks/usePaginationModel";
import { useSnackbar } from "@/app/hooks/useSnackbar";
import { useMutation, useQuery } from "@apollo/client";
import { useRouter, useSearchParams } from "next/navigation";
import { SyntheticEvent, useState } from "react";
import { getStudentRequestsQuery } from "./query";
import { DataGrid, GridActionsCellItem, GridColDef, GridPagination, GridRenderCellParams } from "@mui/x-data-grid";
import { Box, CircularProgress, Stack, Tab, Tooltip } from "@mui/material";
import { CheckCircleOutline, DeleteForever, HighlightOff } from "@mui/icons-material";
import korDicLogo from "../../../../../assets/images/korDicLogo.png";
import naverLogo from "../../../../../assets/images/naverLogo.png";
import { TabContext, TabList } from "@mui/lab";
import CustomNoRowsOverlay from "@/app/components/shared/CustomNoRowsOverlay";
import MuiPagination from '@mui/material/Pagination';
import { approveWordRequestMutation, deleteWordRequestMutation, denyWordRequestMutation } from "@/app/components/request-management/RequestManagementTable/query";
import ConfirmDialog from "@/app/components/shared/ConfirmDialog";

const a11yProps = (index: string) => {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
};

const StudentRequestTable = ({
  id,
} : {
  id: string;
}) => {
  const router = useRouter();
  const { paginationModel, setPaginationModel } = usePaginationModel();
  const { dispatchCurrentSnackBar } = useSnackbar();
  const searchParams = useSearchParams();

  const [wordRequestStatus, setWordRequestStatus] = useState<WordStatus>(searchParams.get('status') as WordStatus || WordStatus.Approved);
  const [getApprovalLoader, setApprovalLoader] = useState<{ [key: string]: boolean }>({});
  const [getDenyLoader, setDenyLoader] = useState<{ [key: string]: boolean }>({});
  const [getDeleteLoader, setDeleteLoader] = useState<{ [key: string]: boolean }>({});
  const [openConfirmDialog, setOpenConfirmDialog] = useState<boolean>(false);
  const [selectedWordId, setSelectedWordId] = useState<string>('');
  
  const [approveWordRequest] = useMutation(approveWordRequestMutation);
  const [denyWordRequest] = useMutation(denyWordRequestMutation);
  const [deleteWordRequest] = useMutation(deleteWordRequestMutation);
  
  const { data, loading, refetch } =
      useQuery(getStudentRequestsQuery, {
        fetchPolicy: 'network-only',
        variables: {
          paginationOptions: {
            limit: paginationModel.pageSize,
            pageNum: paginationModel.page,
          },
          filterOptions: {
            status: wordRequestStatus,
            requestorId: id,
          },
        },
        onError: (error) => {
          dispatchCurrentSnackBar({
            payload: {
              open: true,
              type: 'error',
              message: error.message,
            },
          });
        },
      });

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

  const onDeny = (id: string) => {
    setDenyLoader({[id]: true});
    denyWordRequest({
      variables: {
        denyWordRequestId: id,
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

  const handleTabChange = (event: SyntheticEvent, newValue: WordStatus) => {
    setWordRequestStatus(newValue);
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
      renderCell: (params: GridRenderCellParams<StudentRequestItemsFragment>) => {
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
      renderCell: (params: GridRenderCellParams<StudentRequestItemsFragment>) => {
        return (
          params.row.naverDicResults && params.row.naverDicResults.map((result, i) => {
            return `${i+1}. ${result}\n`;
          })
        );
      }
    },
    { field: 'example', headerName: '예문', flex: 1, filterable: false, sortable: false },
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
                getDenyLoader[params.row.id] ?
                <CircularProgress style={{ width: '20px', height: '20px' }}/>  
                : 
                <Tooltip title={'거절'}>
                  <HighlightOff color="error" />
                </Tooltip>
              }
              label="거절"
              showInMenu={false}
              onClick={() => {onDeny(params.row.id)}}
            />
          ];
        } else if (params.row.status === 'DENIED') {
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
              showInMenu={false}
              onClick={() => {
                setSelectedWordId(params.row.id);
                setOpenConfirmDialog(true);
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
            onClick={() => {onDeny(params.row.id)}}
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

  const handleClose = (isConfirm: boolean) => {
    setOpenConfirmDialog(false);
    if (isConfirm) {
      setDeleteLoader({[selectedWordId]: true});
      deleteWordRequest({
        variables: {
          deleteWordRequestId: selectedWordId,
        },
        onError: (error) => {
          setSelectedWordId('');
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
          setSelectedWordId('');
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
  }

  return (
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
      <DataGrid
        pagination
        disableColumnMenu
        checkboxSelection
        keepNonExistentRowsSelected
        loading={loading}
        columns={columns}
        rows={data?.getWords.records || []}
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
                  count={data?.getWords.pageInfo.pageCount || 0}
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
      <ConfirmDialog
        open={openConfirmDialog}
        handleClose={handleClose}
        title={'주의'}
        content={'정말 삭제하시겠습니까? 삭제된 데이터는 복구할 수 없습니다.'}
      />
    </Stack>
  );
}

export default StudentRequestTable;