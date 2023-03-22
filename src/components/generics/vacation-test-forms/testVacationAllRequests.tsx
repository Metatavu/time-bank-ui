/* eslint-disable */ 
import React, { useState } from 'react';
import { Accordion, AccordionSummary, Box, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import { DataGrid, GridColDef, GridRowsProp } from "@mui/x-data-grid";
import useEditorContentStyles from "styles/editor-content/editor-content";
import theme from "theme/theme";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CreateIcon from '@mui/icons-material/Create';
import { fontSize, fontStyle } from '@mui/system';
import { columnGroupsStateInitializer } from '@mui/x-data-grid/internals';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import vacationRequests from './testVacationMockData.json';

const columns: GridColDef[] = [
  {
    field: "comment", headerName: "My Requests", flex: 3
  },
  {
    field: "employee", headerName: "Employee", flex: 2
  },
  {
    field: "days", headerName: "Days", flex: 1
  },
  {
    field: "startDate", headerName: "Start Date", flex: 2
  },
  {
    field: "endDate", headerName: "End Date", flex: 2
  },
  {
    field: "status", headerName: "Status", flex: 2
  },
];

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
    <Accordion className={classes.vacationDaysAccordion}>
      <AccordionSummary
        expandIcon={ <ExpandMoreIcon/> }
        aria-controls="panel1a-content"
        className={ classes.vacationDaysSummary }
      >
        <Typography variant="h2" padding={theme.spacing(2)}>
          {`All Requests`}
        </Typography>
      </AccordionSummary>
      <Box style={{ height: 300, width: "100%" }}>
        <DataGrid 
          rows={vacationRequests} 
          columns={columns}
          pageSizeOptions={[6]}
          />
      </Box>
    </Accordion>
  );
};

export default renderAllVacationRequests;