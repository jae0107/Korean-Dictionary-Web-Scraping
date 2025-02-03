import { GridToolbarColumnsButton, GridToolbarContainer, GridToolbarExport } from "@mui/x-data-grid";

const CustomExportToolbar = () => {
  return (
    <GridToolbarContainer>
      <GridToolbarColumnsButton/>
      <GridToolbarExport printOptions={{ disableToolbarButton: true }}/>
    </GridToolbarContainer>
  );
}

export default CustomExportToolbar;