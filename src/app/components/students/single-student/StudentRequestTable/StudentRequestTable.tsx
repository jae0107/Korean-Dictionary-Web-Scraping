import { StudentRequestItemsFragment, WordStatus } from "@/app/generated/gql/graphql";
import usePaginationModel from "@/app/hooks/usePaginationModel";
import { useSnackbar } from "@/app/hooks/useSnackbar";
import { useQuery } from "@apollo/client";
import { useRouter, useSearchParams } from "next/navigation";
import { SyntheticEvent, useState } from "react";
import { getStudentRequestsQuery } from "./query";
import { DataGrid, GridActionsCellItem, GridColDef, GridPagination, GridRenderCellParams } from "@mui/x-data-grid";
import { Box, Stack, Tab, Tooltip } from "@mui/material";
import { CheckCircleOutline, DeleteForever, HighlightOff } from "@mui/icons-material";
import korDicLogo from "../../../../../assets/images/korDicLogo.png";
import naverLogo from "../../../../../assets/images/naverLogo.png";
import { TabContext, TabList } from "@mui/lab";
import CustomNoRowsOverlay from "@/app/components/shared/CustomNoRowsOverlay";
import MuiPagination from '@mui/material/Pagination';

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
  
  const { data, loading } =
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
      />
    </Stack>
  );
}

export default StudentRequestTable;