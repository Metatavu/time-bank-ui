/* eslint-disable */ 
import { Accordion, AccordionSummary, alpha, Box, Button, Container, FormControl, InputLabel, MenuItem, Select, styled, Typography } from "@mui/material";
import { DataGrid, GridColDef, gridClasses, GridCellParams } from "@mui/x-data-grid";
import useEditorContentStyles from "styles/editor-content/editor-content";
import theme from "theme/theme";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import vacationRequests from './testVacationMockData.json';
import { useState } from "react";

const columns: GridColDef[] = [
  {
    field: "vacationType", headerName: "Vacation Type", flex: 2.5, hideSortIcons: true
  },
  {
    field: "employee", headerName: "Employee", flex: 2, hideSortIcons: true
  },
  {
    field: "days", headerName: "Days", flex: 1, hideSortIcons: true
  },
  {
    field: "startDate", headerName: "Start Date", flex: 2, hideSortIcons: true
  },
  {
    field: "endDate", headerName: "End Date", flex: 2, hideSortIcons: true
  },
  {
    field: "remainingDays", headerName: "Remaining Days", flex: 2, hideSortIcons: true
  },
  {
    field: "status", headerName: "Status", flex: 1.5, hideSortIcons: true
  },
  {
    field: 'check',
    headerName: '',
    width: 100,
    sortable: false,

    renderCell: (params) => {
      const onClick = () => {
        const currentRow = params.row;
        console.log(params.id);
        return alert(JSON.stringify(currentRow, null, 4));
      };
      return (
        <Button onClick={onClick}><CheckIcon style={{color: '#45cf36'}}/></Button>
      );
    },
  },
  {
    field: 'close',
    headerName: '',
    width: 100,
    sortable: false,

    renderCell: (params) => {
      const onClick = () => {
        const currentRow = params.row;
        console.log(params.id);
      };
      return (
        <Button onClick={onClick}><CloseIcon style={{color: '#FF493C'}}/></Button>
      );
    },
  }
];

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

interface Request {
  id: number;
  comment: string;
  employee: string;
  days: number;
  startDate: string;
  endDate: string;
  status: string;
}

const renderAllVacationRequests = () => {
  const classes = useEditorContentStyles();
  
  return (
    <Box className={classes.employeeVacationRequests}>
      <Box>
        <Typography variant="h2" padding={theme.spacing(2)}>
            {`Requests`}
        </Typography>
      </Box>
      <Box style={{ height: 300, width: "100%" }}>
        <StripedDataGrid 
          sx={{
            '& .pending': {
              color: '#FF493C'
            },
            '& .accepted': {
              color: '#45cf36'
            }
          }}
          getCellClassName={(params: GridCellParams<any>) => {
            if (params.field != 'status' || params.value == null) {
              return ''
            }
            return params.value === 'ACCEPTED' ? 'accepted' : 'pending'
          }}
          rows={vacationRequests} 
          columns={columns}
          pageSizeOptions={[6]}
          getRowClassName={(params) =>
            params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
          }
        />
      </Box>
    </Box>
  );
};

export default renderAllVacationRequests;

/*
<Accordion className={classes.vacationDaysAccordion}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        className={ classes.vacationDaysSummary }
      >
        <Typography variant="h2" padding={theme.spacing(2)}>
          {`Requests`}
        </Typography>
        <FormControl variant="standard" sx={{ m: 1, minWidth: 120, marginBottom: 3 }}>
          <InputLabel>Vacation type</InputLabel>
          <Select
            //value={vacationType}
            //onChange={handleVacationTypeChange}
            label="Type"
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value={"Paid leave"}>Paid leave</MenuItem>
            <MenuItem value={"Parental leave"}>Parental leave</MenuItem>
            <MenuItem value={"Unpaid leave"}>Unpaid leave</MenuItem>
            <MenuItem value={"Surplus balance"}>Surplus balance</MenuItem>
          </Select>
        </FormControl>
      </AccordionSummary>
      <Box style={{ height: 300, width: "100%" }}>
        <StripedDataGrid 
          sx={{
            '& .pending': {
              color: '#FF493C'
            },
            '& .accepted': {
              color: '#45cf36'
            }
          }}
          getCellClassName={(params: GridCellParams<any>) => {
            if (params.field != 'status' || params.value == null) {
              return ''
            }
            return params.value === 'ACCEPTED' ? 'accepted' : 'pending'
          }}
          rows={vacationRequests} 
          columns={columns}
          pageSizeOptions={[6]}
          getRowClassName={(params) =>
            params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
          }
          />
      </Box>
    </Accordion>
    */