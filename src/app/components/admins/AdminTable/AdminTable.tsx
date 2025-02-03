import { AdminItemsFragment, UserStatus } from "@/app/generated/gql/graphql";
import { CheckCircleOutline, DeleteForever, HighlightOff, Visibility } from "@mui/icons-material";
import { Box, Tooltip, Typography } from "@mui/material";
import { DataGrid, GridActionsCellItem, GridColDef, GridPagination, GridRenderCellParams } from "@mui/x-data-grid";
import { Dispatch, SetStateAction } from "react";
import CustomNoRowsOverlay from "../../shared/CustomNoRowsOverlay";
import MuiPagination from '@mui/material/Pagination';
import { useRouter } from "next/navigation";

const AdminTable = ({
  loading,
  admins,
  pageCount,
  page,
  paginationModel,
  setPaginationModel,
  adminStatus,
}: {
  loading: boolean;
  admins: AdminItemsFragment[];
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
  adminStatus: UserStatus;
}) => {
  const router = useRouter();
  
  const columns: GridColDef[] = [
    { field: 'name', headerName: '이름', flex: 2, filterable: false, sortable: false },
    { field: 'email', headerName: '이메일', flex: 3, filterable: false, sortable: false },
    { 
      field: 'year', 
      headerName: '학년', 
      flex: 1, 
      filterable: false, 
      sortable: false,
      renderCell: (params: GridRenderCellParams<AdminItemsFragment>) => {
        return params.row.year ? params.row.year : <Typography display={'flex'} width={'100%'} justifyContent={'center'} alignItems={'center'}>-</Typography>;
      },
    },
    { 
      field: 'class', 
      headerName: '반', 
      flex: 1, 
      filterable: false, 
      sortable: false,
      renderCell: (params: GridRenderCellParams<AdminItemsFragment>) => {
        return params.row.class ? params.row.class : <Typography display={'flex'} width={'100%'} justifyContent={'center'} alignItems={'center'}>-</Typography>;
      },
    },
    {
      field: 'actions',
      type: 'actions',
      width: adminStatus === UserStatus.Pending ? 120 : 80,
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
              onClick={() => router.push(`/admins/${params.row.id}`)}
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
            showInMenu={false}
            onClick={() => router.push(`/admins/${params.row.id}`)}
          />,
          <GridActionsCellItem
            key="approve"
            icon={
              <Tooltip title={'승인'}>
                <CheckCircleOutline color="success" />
              </Tooltip>
            }
            label="승인"
            showInMenu={false}
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
          />
        ]
      }
    }
  ];
  
  return (
    <Box display={'flex'} flexDirection={'column'} width={'90%'}>
      <DataGrid
        pagination
        disableColumnMenu
        checkboxSelection
        keepNonExistentRowsSelected
        loading={loading}
        columns={columns}
        rows={admins}
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
    </Box>
  );
}

export default AdminTable;