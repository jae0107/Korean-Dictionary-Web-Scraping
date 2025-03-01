import { MyRequestItemsFragment, WordStatus } from "@/app/generated/gql/graphql";
import { Cancel } from "@mui/icons-material";
import { Box, Button, CircularProgress, Tooltip, Typography, useMediaQuery } from "@mui/material";
import { DataGrid, GridActionsCellItem, GridColDef, GridColumnVisibilityModel, GridPagination, GridRenderCellParams } from "@mui/x-data-grid";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import korDicLogo from "../../../../assets/images/korDicLogo.png";
import naverLogo from "../../../../assets/images/naverLogo.png";
import CustomNoRowsOverlay from "../../shared/CustomNoRowsOverlay";
import MuiPagination from '@mui/material/Pagination';
import ConfirmDialog from "../../shared/ConfirmDialog";
import { useMutation } from "@apollo/client";
import { deleteWordRequestMutation } from "../../request-management/RequestManagementTable/query";
import { useSnackbar } from "@/app/hooks/useSnackbar";
import MyRequestBulkAction from "./MyRequestBulkAction/MyRequestBulkAction";
import CustomExportToolbar from "../../shared/CustomExportToolbar";

const MyRequestTable = ({
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
}: {
  loading: boolean;
  words: MyRequestItemsFragment[];
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
  const maxWidth750 = useMediaQuery('(max-width:750px)');
  const maxWidth475 = useMediaQuery('(max-width:475px)');
  const maxWidth435 = useMediaQuery('(max-width:435px)');
  
  const [openConfirmDialog, setOpenConfirmDialog] = useState<boolean>(false);
  const [getDeleteLoader, setDeleteLoader] = useState<{ [key: string]: boolean }>({});
  const [selectedWordId, setSelectedWordId] = useState<string>('');
  const [columnVisibilityModel, setColumnVisibilityModel] = useState<GridColumnVisibilityModel>({
    pages: !maxWidth475,
    naverDicResults: !maxWidth750,
    example: !maxWidth435,
    title: true,
    korDicResults: true,
  });
  
  useEffect(() => {
    setColumnVisibilityModel({
      pages: !maxWidth475,
      naverDicResults: !maxWidth750,
      example: !maxWidth435,
      title: columnVisibilityModel.title,
      korDicResults: columnVisibilityModel.korDicResults,
    });
  }, [maxWidth435, maxWidth475, maxWidth750]);

  const [deleteWordRequest] = useMutation(deleteWordRequestMutation);
  
  const columns: GridColDef[] = [
    { 
      field: 'pages', 
      headerName: '페이지', 
      width: 60, 
      filterable: false, 
      sortable: false,
      renderCell: (params: GridRenderCellParams<MyRequestItemsFragment>) => {
        if (!params.row.pages || params.row.pages.length === 0) {
          return <Typography display={'flex'} width={'100%'} justifyContent={'center'} alignItems={'center'}>-</Typography>;
        }
        return params.row.pages.map((page) => `${page}\n`);
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
      renderCell: (params: GridRenderCellParams<MyRequestItemsFragment>) => {
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
      renderCell: (params: GridRenderCellParams<MyRequestItemsFragment>) => {
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
      flex: 1, 
      filterable: false, 
      sortable: false,
      renderCell: (params: GridRenderCellParams<MyRequestItemsFragment>) => {
        return (
          params.row.example ? params.row.example : <Typography display={'flex'} width={'100%'} justifyContent={'center'} alignItems={'center'}>-</Typography>
        );
      }
    },
  ];

  if (wordRequestStatus === 'PENDING') {
    columns.filter((column) => column.field !== 'deniedReason');
    columns.push({
      field: 'actions',
      type: 'actions',
      headerName: '작업',
      renderHeader: () => null,
      width: 40,
      getActions: (params) => [
        <GridActionsCellItem
          key="cancel"
          icon={
            getDeleteLoader[params.row.id] ?
            <CircularProgress style={{ width: '20px', height: '20px' }}/>  
            : 
            <Tooltip title={'취소'}>
              <Cancel color="error" />
            </Tooltip>
          }
          label="취소"
          showInMenu={false}
          onClick={() => {
            setSelectedWordId(params.row.id);
            setOpenConfirmDialog(true);
          }}
        />
      ]
    });
  } else if (wordRequestStatus === 'DENIED') {
    columns.filter((column) => column.type !== 'actions');
    columns.push({
      field: 'deniedReason',
      headerName: '거절 사유',
      flex: 1,
      filterable: false,
      sortable: false,
    });
  } else {
    columns.filter((column) => column.field !== "deniedReason" && column.type !== "actions");
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
              message: '성공적으로 취소되었습니다.',
            },
          });
        },
      });
    }
    setSelectedWordId('');
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
        wordRequestStatus === WordStatus.Pending && 
        <MyRequestBulkAction
          ids={selectedRequests}
          setSelectedRequests={setSelectedRequests}
          status={wordRequestStatus}
          refetch={refetch}
        />
      }
      <DataGrid
        pagination
        disableColumnMenu
        checkboxSelection={wordRequestStatus === WordStatus.Pending}
        disableRowSelectionOnClick
        keepNonExistentRowsSelected={wordRequestStatus === WordStatus.Pending}
        onRowSelectionModelChange={(newRowSelectionModel) => {
          setSelectedRequests(newRowSelectionModel as string[]);
        }}
        rowSelectionModel={selectedRequests || []}
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
          toolbar: () => <CustomExportToolbar/>,
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
          toolbarColumns: '열 선택',
          columnsManagementShowHideAllText: '모든 열 보기/숨기기',
          columnsManagementReset: '초기화',
        }}
      />
      <ConfirmDialog
        open={openConfirmDialog}
        handleClose={handleClose}
        title={'주의'}
        content={'정말 취소하시겠습니까? 취소된 요청은 삭제되며 복구할 수 없습니다.'}
      />
    </Box>
  );
}

export default MyRequestTable;