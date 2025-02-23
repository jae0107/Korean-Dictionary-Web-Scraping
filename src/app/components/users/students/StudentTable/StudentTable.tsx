import { StudentItemsFragment, UserStatus } from "@/app/generated/gql/graphql";
import { CheckCircleOutline, DeleteForever, HighlightOff, Restore, Visibility } from "@mui/icons-material";
import { Box, Button, CircularProgress, Tooltip, useMediaQuery } from "@mui/material";
import { DataGrid, GridActionsCellItem, GridColDef, GridPagination, GridRenderCellParams } from "@mui/x-data-grid";
import { Dispatch, SetStateAction, useState } from "react";
import CustomNoRowsOverlay from "../../../shared/CustomNoRowsOverlay";
import MuiPagination from '@mui/material/Pagination';
import { useRouter } from "next/navigation";
import UserManagementBulkAction from "../../UserManagementBulkAction/UserManagementBulkAction";
import ConfirmDialog from "@/app/components/shared/ConfirmDialog";
import { useSnackbar } from "@/app/hooks/useSnackbar";
import { useMutation } from "@apollo/client";
import { approveUserMutation, deleteUserMutation, denyUserMutation, recoverUserMutation } from "../../query";
import StudentDetailPopUp from "../StudentDetailPopUp/StudentDetailPopUp";
import { UserInfoProps } from "../../UserInfo/type";

const StudentTable = ({
  loading,
  students,
  pageCount,
  page,
  paginationModel,
  setPaginationModel,
  studentStatus,
  refetch,
  selectedStudents,
  setSelectedStudents,
}: {
  loading: boolean;
  students: StudentItemsFragment[];
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
  studentStatus: UserStatus;
  refetch: () => void;
  selectedStudents: string[];
  setSelectedStudents: (value: string[]) => void;
}) => {
  const router = useRouter();
  const { dispatchCurrentSnackBar } = useSnackbar();
  const maxWidth360 = useMediaQuery('(max-width:360px)');
  const maxWidth400 = useMediaQuery('(max-width:400px)');
  const maxWidth750 = useMediaQuery('(max-width:750px)');

  const [getApprovalLoader, setApprovalLoader] = useState<{ [key: string]: boolean }>({});
  const [getDenyLoader, setDenyLoader] = useState<{ [key: string]: boolean }>({});
  const [getRecoverLoader, setRecoverLoader] = useState<{ [key: string]: boolean }>({});
  const [getDeleteLoader, setDeleteLoader] = useState<{ [key: string]: boolean }>({});
  const [openConfirmDialog, setOpenConfirmDialog] = useState<boolean>(false);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [openStudentDetailPopUp, setOpenStudentDetailPopUp] = useState<boolean>(false);
  const [getUser, setUser] = useState<UserInfoProps | null>(null);

  const [approveUser] = useMutation(approveUserMutation);
  const [denyUser] = useMutation(denyUserMutation);
  const [recoverUser] = useMutation(recoverUserMutation);
  const [deleteUser] = useMutation(deleteUserMutation);

  const onApproval = (id: string) => {
    setApprovalLoader({[id]: true});
    approveUser({
      variables: {
        approveUserId: id,
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
        handleCloseStudentDetailPopUp();
        setSelectedStudents([]);
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
    denyUser({
      variables: {
        denyUserId: id,
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
        handleCloseStudentDetailPopUp();
        setSelectedStudents([]);
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
    recoverUser({
      variables: {
        recoverUserId: id,
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
        handleCloseStudentDetailPopUp();
        setSelectedStudents([]);
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

  const getActionWidth = () => {
    if (maxWidth360) return 40;
    if (studentStatus === UserStatus.Pending) {
      return maxWidth400 ? 40 : 120;
    };
    return 80;
  }

  const actions: GridColDef = {
    field: 'actions',
    type: 'actions',
    width: getActionWidth(),
    getActions: (params) => {
      if (params.row.status === 'APPROVED') {
        if (maxWidth360 && getDenyLoader[params.row.id]) {
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
            key="view"
            icon={
              <Tooltip title={'프로필 보기'}>
                <Visibility color='action' />
              </Tooltip>
            }
            label="프로필 보기"
            showInMenu={maxWidth360}
            dense={!!maxWidth360}
            onClick={() => router.push(`/students/${params.row.id}`)}
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
            dense={!!maxWidth360}
            onClick={() => onDeny(params.row.id)}
          />
        ];
      } else if (params.row.status === 'DENIED') {
        if (maxWidth360 && (getRecoverLoader[params.row.id] || getDeleteLoader[params.row.id])) {
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
              <Tooltip title={'복구'}>
                <Restore color='primary' />
              </Tooltip>
            }
            label="복구"
            showInMenu={maxWidth360}
            dense={!!maxWidth360}
            onClick={() => onRecover(params.row.id)}
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
            showInMenu={maxWidth360}
            dense={!!maxWidth360}
            onClick={() => {
              setSelectedUserId(params.row.id);
              setOpenConfirmDialog(true);
            }}
          />,
        ];
      }
      if (maxWidth400 && (getApprovalLoader[params.row.id] || getDenyLoader[params.row.id])) {
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
          key="view"
          icon={
            <Tooltip title={'프로필 보기'}>
              <Visibility color='action' />
            </Tooltip>
          }
          label="프로필 보기"
          showInMenu={maxWidth400}
          dense={!!maxWidth400}
          onClick={() => router.push(`/students/${params.row.id}`)}
        />,
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
          showInMenu={maxWidth400}
          dense={!!maxWidth400}
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
          showInMenu={maxWidth400}
          dense={!!maxWidth400}
          onClick={() => onDeny(params.row.id)}
        />
      ]
    },
  };
  
  const columns: GridColDef[] = maxWidth750 ? [
    { field: 'name', headerName: '이름', flex: maxWidth750 ? 1 : 2, filterable: false, sortable: false, },
    { 
      field: 'detail', 
      headerName: '더보기', 
      width: 120, 
      filterable: false, 
      sortable: false,
      flex: maxWidth750 ? 1 : 0,
      renderCell: (params: GridRenderCellParams<StudentItemsFragment>) => {
        return (
          <Button 
            variant='text' 
            color='info'
            onClick={() => {
              setSelectedUserId(params.row.id);
              setUser({
                name: params.row.name,
                year: params.row.year || undefined,
                class: params.row.class || '',
                number: params.row.number || undefined,
                accountId: params.row.accountId,
                role: params.row.role,
                status: params.row.status,
              });
              setOpenStudentDetailPopUp(true);
            }}
          >
            더보기 클릭
          </Button>
        );
      }
    },
    actions
  ] : [
    { field: 'name', headerName: '이름', flex: 2, filterable: false, sortable: false },
    { field: 'accountId', headerName: '아이디', flex: 3, filterable: false, sortable: false },
    { field: 'year', headerName: '학년', flex: 1, filterable: false, sortable: false },
    { field: 'class', headerName: '반', flex: 1, filterable: false, sortable: false },
    { field: 'number', headerName: '번호', flex: 1, filterable: false, sortable: false },
    actions,
  ];

  const handleCloseConfirmDialog = (isConfirm: boolean) => {
    setOpenConfirmDialog(false);
    if (isConfirm) {
      setDeleteLoader({[selectedUserId]: true});
      deleteUser({
        variables: {
          deleteUserId: selectedUserId,
        },
        onError: (error) => {
          setDeleteLoader({[selectedUserId]: false});
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
          handleCloseStudentDetailPopUp();
          setSelectedStudents([]);
          setDeleteLoader({[selectedUserId]: false});
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
    if (!openStudentDetailPopUp) {
      setSelectedUserId('');
    }
  }

  const handleCloseStudentDetailPopUp = () => {
    setOpenStudentDetailPopUp(false);
    setSelectedUserId('');
    setUser(null);
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
      <UserManagementBulkAction
        ids={selectedStudents}
        setSelectedUsers={setSelectedStudents}
        status={studentStatus}
        refetch={refetch}
      />
      <DataGrid
        pagination
        disableColumnMenu
        checkboxSelection
        disableRowSelectionOnClick
        keepNonExistentRowsSelected
        onRowSelectionModelChange={(newRowSelectionModel) => {
          setSelectedStudents(newRowSelectionModel as string[]);
        }}
        rowSelectionModel={selectedStudents || []}
        loading={loading}
        columns={columns}
        rows={students}
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
      <StudentDetailPopUp 
        openStudentDetailPopUp={openStudentDetailPopUp}
        handleClose={handleCloseStudentDetailPopUp}
        user={getUser}
        selectedUserId={selectedUserId}
        getApprovalLoader={getApprovalLoader[selectedUserId]}
        getRecoverLoader={getRecoverLoader[selectedUserId]}
        getDenyLoader={getDenyLoader[selectedUserId]}
        getDeleteLoader={getDeleteLoader[selectedUserId]}
        onApproval={onApproval}
        onRecover={onRecover}
        onDeny={onDeny}
        setOpenConfirmDialog={setOpenConfirmDialog}
      />
    </Box>
  );
}

export default StudentTable;