import { MyVocabularyItemsFragment, SortOptions } from "@/app/generated/gql/graphql";
import { Box, Typography, useMediaQuery } from "@mui/material";
import { DataGrid, GridColDef, GridColumnVisibilityModel, GridPagination, GridRenderCellParams } from "@mui/x-data-grid";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import CustomExportToolbar from "../../shared/CustomExportToolbar";
import CustomNoRowsOverlay from "../../shared/CustomNoRowsOverlay";
import MuiPagination from '@mui/material/Pagination';
import korDicLogo from "../../../../assets/images/korDicLogo.png";
import naverLogo from "../../../../assets/images/naverLogo.png";
import csvLogo from "../../../../assets/images/csvLogo.png";

const MyVocabTable = ({
  loading,
  words,
  pageCount,
  page,
  paginationModel,
  setPaginationModel,
  setTitleSort,
}: {
  loading: boolean;
  words: MyVocabularyItemsFragment[];
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
  setTitleSort: Dispatch<SetStateAction<SortOptions | null>>;
}) => {
  const maxWidth750 = useMediaQuery('(max-width:750px)');
  const maxWidth475 = useMediaQuery('(max-width:475px)');
  const maxWidth435 = useMediaQuery('(max-width:435px)');

  const [columnVisibilityModel, setColumnVisibilityModel] = useState<GridColumnVisibilityModel>({
    pages: !maxWidth475,
    naverDicResults: !maxWidth750,
    examples: !maxWidth435,
    title: true,
    korDicResults: true,
  });

  useEffect(() => {
    setColumnVisibilityModel({
      pages: !maxWidth475,
      naverDicResults: !maxWidth750,
      examples: !maxWidth435,
      title: columnVisibilityModel.title,
      korDicResults: columnVisibilityModel.korDicResults,
    });
  }, [maxWidth435, maxWidth475, maxWidth750]);

  const columns: GridColDef[] = [
    { 
      field: 'pages', 
      headerClassName: 'page-header',
      cellClassName: 'page-cell',
      headerName: '페이지', 
      width: 65, 
      filterable: false, 
      sortable: false,
      valueGetter: (value, row: MyVocabularyItemsFragment) => {
        if (!row.pages || row.pages.length === 0) {
          return '';
        }
        if (row.pages.length === 1) {
          return row.pages[0];
        }
        return row.pages.map((page) => `• ${page}\n`);
      },
      renderCell: (params: GridRenderCellParams<MyVocabularyItemsFragment>) => {
        if (!params.row.pages || params.row.pages.length === 0) {
          return <Typography display={'flex'} width={'100%'} justifyContent={'center'} alignItems={'center'}>-</Typography>;
        }
        if (params.row.pages.length === 1) {
          return params.row.pages[0];
        }
        return params.row.pages.map((page) => `• ${page}\n`);
      }
    },
    { field: 'title', headerName: '단어', width: 120, filterable: false },
    { 
      field: 'korDicResults', 
      headerClassName: 'korDic-header',
      cellClassName: 'korDic-cell',
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
      valueGetter: (value, row: MyVocabularyItemsFragment) => {
        return (
          row.korDicResults && row.korDicResults.length > 0 ? row.korDicResults.map((result, i) => {
            return row.korDicResults && row.korDicResults.length > 1 ? `${i+1}. ${result}\n` : result;
          }).join("\n") : ''
        );
      },
      renderCell: (params: GridRenderCellParams<MyVocabularyItemsFragment>) => {
        return (
          params.row.korDicResults && params.row.korDicResults.length > 0 ? params.row.korDicResults.map((result, i) => {
            return params.row.korDicResults && params.row.korDicResults.length > 1 ? `${i+1}. ${result}\n` : result;
          }) : <Typography display={'flex'} width={'100%'} justifyContent={'center'} alignItems={'center'}>-</Typography>
        );
      }
    },
    { 
      field: 'naverDicResults', 
      headerClassName: 'naver-header',
      cellClassName: 'naver-cell',
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
      valueGetter: (value, row: MyVocabularyItemsFragment) => {
        return (
          row.naverDicResults && row.naverDicResults.length > 0 ? row.naverDicResults.map((result, i) => {
            return row.naverDicResults && row.naverDicResults.length > 1 ? `${i+1}. ${result}\n` : result;
          }).join("\n") : ''
        );
      },
      renderCell: (params: GridRenderCellParams<MyVocabularyItemsFragment>) => {
        return (
          params.row.naverDicResults && params.row.naverDicResults.length > 0 ? params.row.naverDicResults.map((result, i) => {
            return params.row.naverDicResults && params.row.naverDicResults.length > 1 ? `${i+1}. ${result}\n` : result;
          }) : <Typography display={'flex'} width={'100%'} justifyContent={'center'} alignItems={'center'}>-</Typography>
        );
      }
    },
    { 
      field: 'examples',
      headerClassName: 'example-header',
      cellClassName: 'example-cell',
      headerName: '예문', 
      flex: 1, 
      filterable: false, 
      sortable: false,
      valueGetter: (value, row: MyVocabularyItemsFragment) => {
        const filteredExamples = (row.examples || []).filter((example) => example.trim() !== '');
        if (filteredExamples.length === 0) {
          return '';
        }
        if (filteredExamples.length === 1) {
          return filteredExamples[0];
        }
        return filteredExamples.map((example, i) => `${i+1}. ${example}\n`);
      },
      renderCell: (params: GridRenderCellParams<MyVocabularyItemsFragment>) => {
        const filteredExamples = (params.row.examples || []).filter((example) => example.trim() !== '');
        if (filteredExamples.length === 0) {
          return <Typography display={'flex'} width={'100%'} justifyContent={'center'} alignItems={'center'}>-</Typography>;
        }
        if (filteredExamples.length === 1) {
          return filteredExamples[0];
        }
        return (
          filteredExamples.map((example, i) => `${i+1}. ${example}\n`)
        );
      }
    },
  ];
  
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
      <DataGrid
        pagination
        disableColumnMenu
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
          toolbar: () => <CustomExportToolbar displayExport={true}/>,
          noRowsOverlay: CustomNoRowsOverlay,
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
          toolbarExport: '다운로드',
          toolbarExportCSV: <><img src={csvLogo.src} style={{ width: '25px', height: '25px', marginRight: '4px' }}/>CSV</>,
          toolbarColumns: '열 선택',
          columnsManagementShowHideAllText: '모든 열 보기/숨기기',
          columnsManagementReset: '초기화',
        }}
      />
    </Box>
  );
}

export default MyVocabTable;