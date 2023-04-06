/* eslint-disable */
import React from 'react';
import { Accordion, AccordionSummary, Collapse, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import useEditorContentStyles from "styles/editor-content/editor-content";
import theme from "theme/theme";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import myVacationRequests from './myVacationMockData.json';
import DeleteIcon from '@mui/icons-material/Delete';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { request } from 'http';

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

/**
 * 
 * Renders vacation request table
 */

const renderVacationRequests = () => {
  const classes = useEditorContentStyles();
  const [open, setOpen] = React.useState(false);
  const [openRows, setOpenRows] = React.useState<boolean[]>([]);

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
      <React.Fragment>
      <TableContainer style={{ height: 300, width: "100%" }}>
        <Table aria-label="collapsible table" style={{ marginBottom: "1em" }}>
          <TableHead>
            <TableRow>
              <TableCell style={{ paddingLeft: "3em" }}>Vacation type</TableCell>
              <TableCell>Employee</TableCell>
              <TableCell>Days</TableCell>
              <TableCell>Start Date</TableCell>
              <TableCell>End Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell/>
            </TableRow>
          </TableHead>
          <TableBody>
          {Object.values(myVacationRequests).map((request: Request, index: number) => (
              <>
                <TableRow key={request.id}>
                  <TableCell style={{ paddingLeft: "3em" }}>{request.vacationType}</TableCell>
                  <TableCell>{request.employee} </TableCell>
                  <TableCell>{request.days}</TableCell>
                  <TableCell>{request.startDate}</TableCell>
                  <TableCell>{request.endDate}</TableCell>
                  <TableCell>{request.status}</TableCell>
                  <TableCell>
                  <IconButton
                    aria-label="expand row"
                    size="small"
                    onClick={() => {
                      const newOpenRows = [...openRows];
                      newOpenRows[index] = !newOpenRows[index];
                      setOpenRows(newOpenRows);
                    }}
                  >
                    {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                  </IconButton>
                  </TableCell>
                </TableRow>
                <TableRow>             
                    <Collapse in={openRows[index]} timeout="auto" unmountOnExit>
                        <IconButton><DeleteIcon/></IconButton>
                    </Collapse>
                </TableRow>
              </>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      </React.Fragment>
    </Accordion>
  );
};

export default renderVacationRequests;