import { GridToolbarColumnsButton, GridToolbarContainer, GridToolbarExport } from "@mui/x-data-grid";

const CustomExportToolbar = ({
  displayExport,
} : {
  displayExport?: boolean;
}) => {
  return (
    <GridToolbarContainer>
      <GridToolbarColumnsButton/>
      {displayExport && <GridToolbarExport printOptions={{ disableToolbarButton: true }}/>}
    </GridToolbarContainer>
  );
}

export default CustomExportToolbar;