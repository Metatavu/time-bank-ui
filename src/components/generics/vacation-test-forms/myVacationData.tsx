/* eslint-disable */
import React, { FC, useEffect } from "react";
import { DataGrid, GridColDef, gridClasses } from "@mui/x-data-grid";
import useEditorContentStyles from "styles/editor-content/editor-content";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import vacationData from "./vacationTestMockData.json";
import myVacation from "./myVacationMockData.json"
import { alpha, styled } from '@mui/material/styles';
import { Box, TextField, MenuItem, Typography, Button, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";

interface Props {

}

const renderMyVacationData: FC<Props> = ({

}) => {

const classes = useEditorContentStyles();
const [ rowsHeight, setRowsHeight ] = React.useState<number>(50);
const [rows, setRows] = React.useState<any[]>([])
const columns: GridColDef[] = [
    {
        field: "comment",
        headerName: "comment",
        flex: 10,
        hideSortIcons: true,
        headerClassName: classes.hideRightSeparator
    },
    {
        field: "employee",
        headerName: "employee",
        flex: 3,
        hideSortIcons: true,
        headerClassName: classes.hideRightSeparator
    },
    {
        field: "days",
        headerName: "days",
        flex: 2,
        hideSortIcons: true,
        headerClassName: classes.hideRightSeparator
    },
    {
        field: "startDate",
        headerName: "startDate",
        flex: 2,
        hideSortIcons: true,
        headerClassName: classes.hideRightSeparator
    },
    {
        field: "endDate",
        headerName: "endDate",
        flex: 2,
        hideSortIcons: true,
        headerClassName: classes.hideRightSeparator
    },
    {
        field: "status",
        headerName: "status",
        flex: 2,
        hideSortIcons: true,
        headerClassName: classes.hideRightSeparator
    },
    {
        field:"expand",
        headerName: "",
        flex: 1,
        hideSortIcons: true,
        headerClassName: classes.hideRightSeparator
    },
]
const ODD_OPACITY = 0.2;

const StripedDataGrid = styled(DataGrid)(({ theme }) => ({
  [`& .${gridClasses.row}.even`]: {
    backgroundColor: theme.palette.grey[200],
    '&:hover, &.Mui-hovered': {
      backgroundColor: alpha(theme.palette.primary.main, ODD_OPACITY),
      '@media (hover: none)': {
        backgroundColor: 'transparent',
      },
    },
    '&.Mui-selected': {
      backgroundColor: alpha(
        theme.palette.primary.main,
        ODD_OPACITY + theme.palette.action.selectedOpacity,
      ),
      '&:hover, &.Mui-hovered': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          ODD_OPACITY +
            theme.palette.action.selectedOpacity +
            theme.palette.action.hoverOpacity,
        ),
        // Reset on touch devices, it doesn't add specificity
        '@media (hover: none)': {
          backgroundColor: alpha(
            theme.palette.primary.main,
            ODD_OPACITY + theme.palette.action.selectedOpacity,
          ),
        },
      },
    },
  },
}));


const renderMyVacations = () => {
    console.log(rows)
    return(
        <Accordion
            elevation={3}
            className={classes.myVacationData}
          >
        <AccordionSummary 
        expandIcon={ <ExpandMoreIcon/> }
        aria-controls="panel1a-content"
        className={ classes.vacationDaysSummary }
      >
        <Typography variant="h2">
        { `My Vacations` }
        </Typography>
        </AccordionSummary>
            <StripedDataGrid
            getRowClassName={(params) => 
            params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
            }
            autoHeight={true}
            rows={myVacation}
            rowHeight={rowsHeight}
            columns={columns}
            hideFooter={true}
            initialState={{
                pagination: {
                    paginationModel: {
                        pageSize: 6,
                    },
                },
            }}
            pageSizeOptions={[6]}
            disableColumnMenu={true}
            disableColumnSelector={true}
            />
          </Accordion>
    )
}
return (
    <>
    {renderMyVacations()}
    </>
)
}
export default renderMyVacationData;