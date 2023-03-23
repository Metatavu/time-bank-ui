/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { Accordion, AccordionSummary, alpha, Box, Button, Dialog, Modal, styled, Typography } from "@mui/material";
import { DataGrid, GridCellParams, gridClasses, GridColDef} from "@mui/x-data-grid";
import useEditorContentStyles from "styles/editor-content/editor-content";
import theme from "theme/theme";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CreateIcon from '@mui/icons-material/Create';
import { fontSize, fontStyle } from '@mui/system';
import { columnGroupsStateInitializer } from '@mui/x-data-grid/internals';
import { useParams } from 'react-router-dom';
import myVacationRequests from './myVacationMockData.json';
import BasicModal from './testVacationEditModal';


const columns: GridColDef[] = [
  {
    field: "comment", headerName: "My Requests", flex: 3, hideSortIcons: true
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
    field: "status", headerName: "Status", flex: 2, hideSortIcons: true
  },
  {
    field: 'action',
    headerName: '',
    width: 100,
    sortable: false,
    //disableClickEventBubbling: true,

    renderCell: (params) => {
      const onClick = () => {
        const currentRow = params.row;
        console.log(params.id);
        
        return alert(JSON.stringify(currentRow, null, 4));
      };

      return (
        <Button onClick={onClick}><CreateIcon/></Button>
      );
    },
  }
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

  //console.log(vacationRequests);

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
      </Box>
    </Accordion>
  );
};

export default renderVacationRequests;
