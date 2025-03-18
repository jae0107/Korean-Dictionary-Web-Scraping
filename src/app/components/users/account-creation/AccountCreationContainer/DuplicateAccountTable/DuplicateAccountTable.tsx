import CustomNoRowsOverlay from "@/app/components/shared/CustomNoRowsOverlay";
import { DataGrid, GridColDef, GridColumnVisibilityModel, GridRenderCellParams } from "@mui/x-data-grid";
import usePaginationModel from "@/app/hooks/usePaginationModel";
import { ExtendedUserInput } from "@/app/account-creation/type";
import { useEffect, useState } from "react";
import { Button, useMediaQuery } from "@mui/material";
import AccountDetailPopUp from "../AccountDetailPopUp/AccountDetailPopUp";

const DuplicateAccountTable = ({
  loading,
  getData,
} : {
  loading: boolean;
  getData: ExtendedUserInput[];
}) => {
  const { paginationModel, setPaginationModel } = usePaginationModel();
  const maxWidth445 = useMediaQuery('(max-width:445px)');

  const [openAccountDetailPopUp, setOpenAccountDetailPopUp] = useState<boolean>(false);
  const [selectedData, setSelectedData] = useState<ExtendedUserInput | null>(null);
  const [columnVisibilityModel, setColumnVisibilityModel] = useState<GridColumnVisibilityModel>({
    accountId: true,
    name: true,
    year: !maxWidth445,
    class: !maxWidth445,
    number: !maxWidth445,
    password: !maxWidth445,
    detail: maxWidth445,
  });
    
  useEffect(() => {
    setColumnVisibilityModel({
      accountId: true,
      name: true,
      year: !maxWidth445,
      class: !maxWidth445,
      number: !maxWidth445,
      password: !maxWidth445,
      detail: maxWidth445,
    });
  }, [maxWidth445]);
  
  const columns: GridColDef[] = maxWidth445 ? [
    { field: 'accountId', headerName: '아이디', flex: 1, filterable: false, sortable: false },
    { field: 'name', headerName: '이름', flex: 1, filterable: false, sortable: false },
    { 
      field: 'detail', 
      headerName: '더보기', 
      width: 120, 
      filterable: false, 
      sortable: false,
      flex: maxWidth445 ? 1 : 0,
      renderCell: (params: GridRenderCellParams<ExtendedUserInput>) => {
        return (
          <Button 
            variant='text' 
            color='primary'
            onClick={() => {
              setSelectedData(params.row);
              setOpenAccountDetailPopUp(true);
            }}
          >
            더보기 클릭
          </Button>
        );
      }
    },
  ] : [
    { field: 'accountId', headerName: '아이디', flex: 1, filterable: false, sortable: false },
    { field: 'name', headerName: '이름', flex: 1, filterable: false, sortable: false },
    { field: 'year', headerName: '학년', flex: 1, filterable: false, sortable: false },
    { field: 'class', headerName: '반', flex: 1, filterable: false, sortable: false },
    { field: 'number', headerName: '번호', flex: 1, filterable: false, sortable: false },
    { field: 'password', headerName: '비밀번호', flex: 1, filterable: false, sortable: false },
  ];

  return (
    <>
      <DataGrid
        pagination
        disableColumnMenu
        disableRowSelectionOnClick
        loading={loading}
        rows={getData}
        columns={columns}
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
          '@media (max-width:445px)': {
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
      {
        selectedData &&
        <AccountDetailPopUp
          openAccountDetailPopUp={openAccountDetailPopUp}
          selectedData={selectedData}
          setOpenAccountDetailPopUp={setOpenAccountDetailPopUp}
          setSelectedData={setSelectedData}
        />
      }
    </>
  );
}

export default DuplicateAccountTable;