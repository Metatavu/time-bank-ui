/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { Accordion, AccordionSummary, Box, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import { DataGrid, GridColDef, GridRowsProp } from "@mui/x-data-grid";
import useEditorContentStyles from "styles/editor-content/editor-content";
import theme from "theme/theme";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CreateIcon from '@mui/icons-material/Create';
import { fontSize, fontStyle } from '@mui/system';
import { columnGroupsStateInitializer } from '@mui/x-data-grid/internals';
import { useParams } from 'react-router-dom';
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

const renderVacationRequests = () => {
  const classes = useEditorContentStyles();
  const id = useParams();
  const request = vacationRequests.find((r: { id: number; }) => r.id === id)

  const [requests, setRequests] = useState([])

  useEffect(() => {


  }, [])
  console.log(vacationRequests);

  return (
    <Accordion className={classes.vacationDaysAccordion}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        className={classes.vacationDaysSummary}
      >
        <Typography variant="h2" padding={theme.spacing(2)}>
          {`Requests`}
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

export default renderVacationRequests;
/**
 * 
      <Table style={{ marginBottom: "1em" }}>
        <TableHead>
          <TableRow>
            <TableCell sx={{fontSize: "20px"}}>My Requests</TableCell>
            <TableCell>Employee</TableCell>
            <TableCell>Days</TableCell>
            <TableCell>Start Date</TableCell>
            <TableCell>End Date</TableCell>
            <TableCell>Status</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.values(vacationRequests).map((request) => (
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
 */

