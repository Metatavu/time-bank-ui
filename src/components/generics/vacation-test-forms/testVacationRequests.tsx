/* eslint-disable */ 
import React, { useState } from 'react';
import { Accordion, AccordionSummary, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import { DataGrid, GridColDef, GridRowsProp } from "@mui/x-data-grid";
import useEditorContentStyles from "styles/editor-content/editor-content";
import theme from "theme/theme";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CreateIcon from '@mui/icons-material/Create';
import { fontSize, fontStyle } from '@mui/system';

const rows: GridRowsProp = [
  {
    id: 1, col1: "Hello", col2: "World"
  },
  {
    id: 2, col1: "DataGridPro", col2: "is Awesome"
  },
  {
    id: 3, col1: "MUI", col2: "is Amazing"
  }
];

const columns: GridColDef[] = [
  {
    field: "col1", headerName: "My Requests", width: 300
  },
  {
    field: "col2", headerName: "Employee", width: 150
  },
  {
    field: "col3", headerName: "Days", width: 150
  },
  {
    field: "col4", headerName: "Start Date", width: 150
  },
  {
    field: "col5", headerName: "End Date", width: 150
  },
  {
    field: "col6", headerName: "Status", width: 150
  },
  {
    field: "col7", headerName: "", width: 150
  },
];
interface Props {
  requests: Request[]
}
const requests= [
  {
      "id": 6958226,
      "comment": "<div><br/></div>",
      "employee": "A. Anonyme",
      "days": 0,
      "startDate": "2023-02-02T00:00:00.000Z",
      "EndDate": "2023-03-03T00:00:00.000Z",
      "status": "PENDING"
  },
  {
      "id": 8297984,
      "comment": "<div>I need some time off<br/></div>",
      "employee": "B. Anonyme",
      "days": 30,
      "startDate": "2023-02-02T00:00:00.000Z",
      "EndDate": "2023-03-03T00:00:00.000Z",
      "status": "PENDING"
  }
]
const renderVacationRequests = () => {
  const classes = useEditorContentStyles();
  
  return (
    <Accordion className={classes.vacationDaysAccordion}>
      <AccordionSummary
        expandIcon={ <ExpandMoreIcon/> }
        aria-controls="panel1a-content"
        className={ classes.vacationDaysSummary }
      >
        <Typography variant="h2" padding={theme.spacing(2)}>
          {`Requests`}
        </Typography>
      </AccordionSummary>
      <Table style={{ marginBottom: "1em" }}>
        <TableHead>
          <TableRow>
            <TableCell sx={{fontSize: "20px"}}>My Requests</TableCell>
            <TableCell>Employee</TableCell>
            <TableCell>Days</TableCell>
            <TableCell>Start Date</TableCell>
            <TableCell>End Date</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.values(requests).map((request) => (
            <TableRow key={request.id}>
              <TableCell>{request.comment}</TableCell>
              <TableCell>{request.employee}</TableCell>
              <TableCell>{request.days}</TableCell>
              <TableCell>{request.startDate}</TableCell>
              <TableCell>{request.EndDate}</TableCell>
              <TableCell>{request.status}</TableCell>
              <TableCell><CreateIcon/></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Accordion>
  );
};

export default renderVacationRequests;
/**
 * <div style={{ height: 300, width: "100%" }}>
        <DataGrid rows={rows} columns={columns}/>
      </div>
 */