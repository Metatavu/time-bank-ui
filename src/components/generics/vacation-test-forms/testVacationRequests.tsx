/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { Accordion, AccordionSummary, alpha, Box, Button, Collapse, Dialog, IconButton, Modal, styled, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import { DataGrid, GridCellParams, gridClasses, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import useEditorContentStyles from "styles/editor-content/editor-content";
import theme from "theme/theme";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CreateIcon from '@mui/icons-material/Create';
import { fontSize, fontStyle } from '@mui/system';
import { columnGroupsStateInitializer } from '@mui/x-data-grid/internals';
import { useParams } from 'react-router-dom';
import myVacationRequests from './myVacationMockData.json';

interface Request {
  id: number;
  vacationType: string;
  comment: string;
  employee: string;
  days: number;
  startDate: string;
  endDate: string;
  status: string;
}

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

const renderVacationRequests = () => {
  const classes = useEditorContentStyles();
  const id = useParams();
  const request = myVacationRequests.find((r: { id: number; }) => r.id === id)
  //const [requests, setRequests] = useState([])

  const columns: GridColDef[] = [
    {
      field: "vacationType", headerName: "Vacation type", flex: 2, hideSortIcons: true,
    },
    {
      field: "employee", headerName: "Employee", flex: 2.5, hideSortIcons: true,
    },
    {
      field: "days", headerName: "Days", flex: 1, hideSortIcons: true,
    },
    {
      field: "startDate", headerName: "Start Date", flex: 2, hideSortIcons: true,
    },
    {
      field: "endDate", headerName: "End Date", flex: 2, hideSortIcons: true,
    },
    {
      field: "status", headerName: "Status", flex: 1.5, hideSortIcons: true
    },
    {
      field: "id",
      headerName: "",
      width: 100,
  
      renderCell: (params) => {
        const handleOpen = () => {
          const currentRow = params.row;
          console.log(params.id);
          
          return alert(JSON.stringify(currentRow, null, 4));
        }
        return (
          <IconButton aria-label="create" onClick={handleOpen}><CreateIcon/></IconButton>
        );
      }
    }
  ];

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
      <Table aria-label="collapsible table" style={{ marginBottom: "1em" }}>
        <TableHead>
          <TableRow>
            <TableCell style={{ paddingLeft: "3em" }}>Vacation type</TableCell>
            <TableCell>Employee</TableCell>
            <TableCell>Days</TableCell>
            <TableCell>Start Date</TableCell>
            <TableCell>End Date</TableCell>
            <TableCell>Status</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.values(myVacationRequests).map((request: Request) => (
            <TableRow key={request.id}>
              <TableCell style={{ paddingLeft: "3em" }}>{request.vacationType}</TableCell>
              <TableCell>{request.employee}</TableCell>
              <TableCell>{request.days}</TableCell>
              <TableCell>{request.startDate}</TableCell>
              <TableCell>{request.endDate}</TableCell>
              <TableCell>{request.status}</TableCell>
              <TableCell>
                <IconButton><CreateIcon/></IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      </Box>
    </Accordion>
  );
};

export default renderVacationRequests;

/*
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
          rows={myVacationRequests}
          columns={columns}
          pageSizeOptions={[6]}
          getRowClassName={(params) =>
            params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
          }
        />
        */