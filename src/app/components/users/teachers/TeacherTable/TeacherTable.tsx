import { TeacherItemsFragment, UserStatus } from "@/app/generated/gql/graphql";
import { CheckCircleOutline, DeleteForever, HighlightOff, Restore, Visibility } from "@mui/icons-material";
import { Box, CircularProgress, Tooltip, Typography } from "@mui/material";
import { DataGrid, GridActionsCellItem, GridColDef, GridPagination, GridRenderCellParams } from "@mui/x-data-grid";
import { Dispatch, SetStateAction, useState } from "react";
import CustomNoRowsOverlay from "../../../shared/CustomNoRowsOverlay";
import MuiPagination from '@mui/material/Pagination';
import { useRouter } from "next/navigation";
import { useSnackbar } from "@/app/hooks/useSnackbar";
import { useMutation } from "@apollo/client";
import { approveUserMutation, deleteUserMutation, denyUserMutation, recoverUserMutation } from "../../query";
import UserManagementBulkAction from "../../UserManagementBulkAction/UserManagementBulkAction";
import ConfirmDialog from "@/app/components/shared/ConfirmDialog";

const TeacherTable = ({
  loading,
  teachers,
  pageCount,
  page,
  paginationModel,
  setPaginationModel,
  teacherStatus,
  refetch,
  selectedTeachers,
  setSelectedTeachers,
}: {
  loading: boolean;
  teachers: TeacherItemsFragment[];
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
  teacherStatus: UserStatus;
  refetch: () => void;
  selectedTeachers: string[];
  setSelectedTeachers: (value: string[]) => void;
}) => {
  const router = useRouter();
  const { dispatchCurrentSnackBar } = useSnackbar();

  const [getApprovalLoader, setApprovalLoader] = useState<{ [key: string]: boolean }>({});
  const [getDenyLoader, setDenyLoader] = useState<{ [key: string]: boolean }>({});
  const [getRecoverLoader, setRecoverLoader] = useState<{ [key: string]: boolean }>({});
  const [getDeleteLoader, setDeleteLoader] = useState<{ [key: string]: boolean }>({});
  const [openConfirmDialog, setOpenConfirmDialog] = useState<boolean>(false);
  const [selectedUserId, setSelectedUserId] = useState<string>('');

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
        setSelectedTeachers([]);
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
        setSelectedTeachers([]);
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
        setSelectedTeachers([]);
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
    { field: 'name', headerName: '이름', flex: 2, filterable: false, sortable: false },
    { field: 'email', headerName: '이메일', flex: 3, filterable: false, sortable: false },
    { 
      field: 'year', 
      headerName: '학년', 
      flex: 1, 
      filterable: false, 
      sortable: false,
      renderCell: (params: GridRenderCellParams<TeacherItemsFragment>) => {
        return params.row.year ? params.row.year : <Typography display={'flex'} width={'100%'} justifyContent={'center'} alignItems={'center'}>-</Typography>;
      },
    },
    { 
      field: 'class', 
      headerName: '반', 
      flex: 1, 
      filterable: false, 
      sortable: false,
      renderCell: (params: GridRenderCellParams<TeacherItemsFragment>) => {
        return params.row.class ? params.row.class : <Typography display={'flex'} width={'100%'} justifyContent={'center'} alignItems={'center'}>-</Typography>;
      },
    },
    {
      field: 'actions',
      type: 'actions',
      width: teacherStatus === UserStatus.Pending ? 120 : 80,
      getActions: (params) => {
        if (params.row.status === 'APPROVED') {
          return [
            <GridActionsCellItem
              key="view"
              icon={
                <Tooltip title={'프로필 보기'}>
                  <Visibility color='action' />
                </Tooltip>
              }
              label="프로필 보기"
              showInMenu={false}
              onClick={() => router.push(`/teachers/${params.row.id}`)}
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
              onClick={() => onDeny(params.row.id)}
            />
          ];
        } else if (params.row.status === 'DENIED') {
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
              showInMenu={false}
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
              showInMenu={false}
              onClick={() => {
                setSelectedUserId(params.row.id);
                setOpenConfirmDialog(true);
              }}
            />,
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
            showInMenu={false}
            onClick={() => router.push(`/teachers/${params.row.id}`)}
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
            showInMenu={false}
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
            showInMenu={false}
            onClick={() => onDeny(params.row.id)}
          />
        ]
      }
    }
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
          setSelectedTeachers([]);
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
    setSelectedUserId('');
  }
  
  return (
    <Box display={'flex'} flexDirection={'column'} width={'90%'}>
      <UserManagementBulkAction
        ids={selectedTeachers}
        setSelectedUsers={setSelectedTeachers}
        status={teacherStatus}
        refetch={refetch}
      />
      <DataGrid
        pagination
        disableColumnMenu
        checkboxSelection
        disableRowSelectionOnClick
        keepNonExistentRowsSelected
        onRowSelectionModelChange={(newRowSelectionModel) => {
          setSelectedTeachers(newRowSelectionModel as string[]);
        }}
        rowSelectionModel={selectedTeachers || []}
        loading={loading}
        columns={columns}
        rows={teachers}
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
      <ConfirmDialog
        open={openConfirmDialog}
        handleClose={handleCloseConfirmDialog}
        title={'주의'}
        content={'정말 삭제하시겠습니까? 삭제된 데이터는 복구할 수 없습니다.'}
      />
    </Box>
  );
}

export default TeacherTable;