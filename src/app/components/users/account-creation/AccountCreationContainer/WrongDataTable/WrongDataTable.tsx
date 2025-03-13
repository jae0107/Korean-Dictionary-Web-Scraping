import { RawJsonDataProps } from "@/app/account-creation/type";
import CustomNoRowsOverlay from "@/app/components/shared/CustomNoRowsOverlay";
import usePaginationModel from "@/app/hooks/usePaginationModel";
import { Typography } from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";

const WrongDataTable = ({
  loading,
  getData,
} : {
  loading: boolean;
  getData: RawJsonDataProps[];
}) => {
  const { paginationModel, setPaginationModel } = usePaginationModel();

  const getCellNumberValue = (value: number) => {
    if (!value) {
      return <Typography display={'flex'} width={'100%'} justifyContent={'center'} alignItems={'center'} color='error' fontWeight={'bold'}>-</Typography>;
    } else if (isNaN(Number(value))) {
      return (
        <Typography 
          display={'flex'}
          width={'100%'} 
          alignItems={'center'} 
          color='error' 
          fontWeight={'bold'}
          sx={{
            '@media (max-width:750px)': {
              justifyContent: 'center',
            }
          }}
        >
          {value}
        </Typography>
      );
    }
    return value;
  }

  const getCellStringValue = (value: string) => {
    if (!value || (value && typeof value === 'string' && value.trim() === '')) {
      return <Typography display={'flex'} width={'100%'} justifyContent={'center'} alignItems={'center'} color='error' fontWeight={'bold'}>-</Typography>;
    } else if (typeof value !== 'string' || !isNaN(Number(value))) {
      return (
        <Typography 
          display={'flex'}
          width={'100%'} 
          alignItems={'center'} 
          color='error' 
          fontWeight={'bold'}
          sx={{
            '@media (max-width:750px)': {
              justifyContent: 'center',
            }
          }}
        >
          {value}
        </Typography>
      );
    }
    return value;
  }

  const columns: GridColDef[] = [
    { 
      field: 'name', 
      headerName: '이름', 
      flex: 1,
      filterable: false, 
      sortable: false,
      renderCell: (params: GridRenderCellParams<RawJsonDataProps>) => {
        return getCellStringValue(params.row.name);
      },
    },
    { 
      field: 'year', 
      headerName: '학년', 
      flex: 1,
      filterable: false, 
      sortable: false,
      renderCell: (params: GridRenderCellParams<RawJsonDataProps>) => {
        return getCellNumberValue(params.row.year);
      },
    },
    { 
      field: 'class', 
      headerName: '반', 
      flex: 1,
      filterable: false, 
      sortable: false,
      renderCell: (params: GridRenderCellParams<RawJsonDataProps>) => {
        return getCellNumberValue(params.row.class);
      },
    },
    { 
      field: 'number', 
      headerName: '번호', 
      flex: 1,
      filterable: false, 
      sortable: false,
      renderCell: (params: GridRenderCellParams<RawJsonDataProps>) => {
        return getCellNumberValue(params.row.number);
      },
    },
  ];

  return (
    <DataGrid
      pagination
      disableColumnMenu
      disableRowSelectionOnClick
      keepNonExistentRowsSelected
      loading={loading}
      columns={columns}
      rows={getData}
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
      getRowHeight={() => 43}
      slots={{
        noRowsOverlay: CustomNoRowsOverlay,
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
  );
}

export default WrongDataTable;