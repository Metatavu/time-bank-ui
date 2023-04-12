/* eslint-disable */ 
import { Accordion, AccordionSummary, alpha, Box, Button, Collapse, Container, FormControl, IconButton, InputLabel, MenuItem, Select, SelectChangeEvent, styled, Table, TableBody, TableCell, tableCellClasses, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { DataGrid, GridColDef, gridClasses, GridCellParams } from "@mui/x-data-grid";
import useEditorContentStyles from "styles/editor-content/editor-content";
import theme from "theme/theme";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import vacationRequests from './testVacationMockData.json';
import { useState } from "react";
import React from "react";
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import DateFilterPicker from "../date-range-picker/test-date-range-picker";
import { CalendarPickerView } from "@mui/x-date-pickers";

/**
 * interface type request
 */
interface Request {
  id: number;
  vacationType: string;
  comment: string;
  employee: string;
  days: number;
  startDate: string;
  endDate: string;
  remainingDays: number;
  status: string;
  created: string;
  updated: string;
  projectManager: string;
  humanResourcesManager: string;
}

/**
 * 
 * @param id 
 * @param vacationType 
 * @param comment 
 * @param employee 
 * @param days 
 * @param startDate 
 * @param endDate 
 * @param remainingDays 
 * @param status 
 * @param created 
 * @param updated 
 * @param projectManager 
 * @param humanResourcesManager 
 * @returns 
 */
const createData = (
  id: number,
  vacationType: string,
  comment: string,
  employee: string,
  days: number,
  startDate: string,
  endDate: string,
  remainingDays: number,
  status: string,
  created: string,
  updated: string,
  projectManager: string,
  humanResourcesManager: string
) => {
  return {
    id,
    vacationType,
    comment,
    employee,
    days,
    startDate,
    endDate,
    remainingDays,
    status,
    created,
    updated,
    projectManager,
    humanResourcesManager
  }
};

/**
 * Styled expandable table
 */
const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  }
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.white,
    color: theme.palette.common.black,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
  '& .pending': {
      color: '#FF493C'
  },
  '& .accepted': {
      color: '#45cf36'
  },
  ...(status === 'ACCEPTED' ? { '&.accepted': {} } : { '&.pending': {} })
}));

/**
 * 
 * Expandable row
 */
const ExpandableRow = (props: { request: ReturnType<typeof createData> }) => {
  const { request } = props;
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <StyledTableRow key={request.id}>
        <StyledTableCell component="th" scope="row">{request.vacationType}</StyledTableCell>
        <StyledTableCell>{request.employee}</StyledTableCell>
        <StyledTableCell>{request.days}</StyledTableCell>
        <StyledTableCell>{request.startDate}</StyledTableCell>
        <StyledTableCell>{request.endDate}</StyledTableCell>
        <StyledTableCell>{request.remainingDays}</StyledTableCell>
        <StyledTableCell sx={{ '&.pending': { color: '#FF493C' }, '&.accepted': { color: '#45cf36' } }} className={request.status === 'ACCEPTED' ? 'accepted' : 'pending'}>{request.status}</StyledTableCell>
        <StyledTableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </StyledTableCell>
      </StyledTableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1, width: "100%" }}>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Comment:</TableCell>
                    <TableCell>Created:</TableCell>
                    <TableCell>Updated:</TableCell>
                    <TableCell>Project manager:</TableCell>
                    <TableCell>Human resources manager:</TableCell>
                    <TableCell/>
                    <TableCell/>
                    <TableCell/>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.values(vacationRequests).map((request) => (
                    <TableRow key={request.id}>
                      <TableCell component="th" scope="row">{request.comment}</TableCell>
                      <TableCell>{request.created}</TableCell>
                      <TableCell>{request.updated}</TableCell>
                      <TableCell>{request.projectManager}</TableCell>
                      <TableCell>{request.humanResourcesManager}</TableCell>
                      <TableCell/>
                      <TableCell align="right"><Button variant="outlined" color="error" sx={{color: "#F9473B"}}>DECLINE</Button></TableCell>
                      <TableCell align="right"><Button variant="outlined" color="success" sx={{color: "green"}}>APPROVED</Button></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  )
};

/**
 * 
 * renders employee vacation request view
 */
const renderEmployeeVacationRequests = () => {
  const classes = useEditorContentStyles();
  const [ status, setStatus ] = React.useState("");
  const [ employee, setEmployee ] = React.useState("");
  const [ vacationType, setVacationType ] = React.useState("");
  const [ dateFormat, setDateFormat ] = React.useState<string | undefined>("yyyy.MM.dd");
  const [ datePickerView, setDatePickerView ] = React.useState<CalendarPickerView>("day");
  const [ selectedVacationStartDate, setSelectedVacationStartDate ] = useState<any>(new Date());
  const [ selectedVacationEndDate, setSelectedVacationEndDate ] = useState<any>(new Date())

    /**
   * Handle employee change
   */
  const handleEmployeeChange = (event: SelectChangeEvent) => {
    const contentValue = event.target.value;
    setEmployee(contentValue as string)
  }

  /**
   * Renders employee selection
   */
  const renderEmployeeSelection = () => (
    <FormControl variant="standard" sx={{ m: 1, minWidth: 165, marginBottom: 4 }}>
      <InputLabel>Employee</InputLabel>
      <Select
        value={employee}
        onChange={handleEmployeeChange}
        label="Eployee"
      >
        <MenuItem value="">
          <em>None</em>
        </MenuItem>
        {Object.values(vacationRequests).map((request: Request) => (
          <MenuItem value={request.employee}>{request.employee}</MenuItem>
        ))}
      </Select>
    </FormControl>
  )

  /**
     * Method to handle vacation starting date change
     *
     * @param date selected date
     */
  const handleVacationStartDateChange = (date: unknown) => {
    date && setSelectedVacationStartDate(date);
  };

  /**
   * Method to handle vacation ending date change
   *
   * @param date selected date
   */
  const handleVacationEndDateChange = (date: unknown) => {
    date && setSelectedVacationEndDate(date);
  };

  /**
     * Handle vacation type 
     */
  const handleVacationTypeChange = (event: SelectChangeEvent) => {
    const contentValue = event.target.value;
    setVacationType(contentValue as string)
  }

  /**
   * Renders the vacation type selection
   */
  const renderVacationType = () => (
    <FormControl variant="standard" sx={{ m: 1, minWidth: 165, marginBottom: 4 }}>
      <InputLabel>Vacation type</InputLabel>
      <Select
        value={vacationType}
        onChange={handleVacationTypeChange}
        label="Type"
      >
        <MenuItem value="">
          <em>None</em>
        </MenuItem>
        <MenuItem value={"Paid leave"}>Paid leave</MenuItem>
        <MenuItem value={"Maternity leave"}>Maternity leave</MenuItem>
        <MenuItem value={"Parental leave"}>Parental leave</MenuItem>
        <MenuItem value={"Unpaid leave"}>Unpaid leave</MenuItem>
        <MenuItem value={"Surplus balance"}>Surplus balance</MenuItem>
      </Select>
    </FormControl>
  )

  /**
     * Handle employee change
     */
  const handleStatusChange = (event: SelectChangeEvent) => {
    const contentValue = event.target.value;
    setStatus(contentValue as string)
  }

  /**
   * Renders the vacation type selection
   */
  const renderRequestStatus = () => (
    <FormControl variant="standard" sx={{ m: 1, minWidth: 165, marginBottom: 4 }}>
      <InputLabel>Status</InputLabel>
      <Select
        value={status}
        onChange={handleStatusChange}
        label="Status"
      >
        <MenuItem value="">
          <em>None</em>
        </MenuItem>
        <MenuItem value={"Pending"}>Pending</MenuItem>
        <MenuItem value={"Approved"}>Approved</MenuItem>
        <MenuItem value={"Declined"}>Declined</MenuItem>
      </Select>
    </FormControl>
  )

  return (
    <Box className={classes.employeeVacationRequests}>
      <Box>
        <Typography variant="h2" padding={theme.spacing(2)}>
          {`Requests`}
        </Typography>
        <Box sx={{float: "right", paddingRight: "15px", marginBottom: "10px"}}>
          { renderVacationType() }
          { renderEmployeeSelection() }
          { renderRequestStatus() }
          <DateFilterPicker 
            dateFormat={dateFormat}
            selectedFilteredStartDate={selectedVacationStartDate}
            selectedFilteredEndDate={selectedVacationEndDate}
            datePickerView={datePickerView}
            onStartDateChange={handleVacationStartDateChange}
            onEndDateChange={handleVacationEndDateChange}        
          />
        </Box>
      </Box>
      <Box>
        <TableContainer style={{ height: 300, width: "100%" }}>
          <Table aria-label="customized table" style={{ marginBottom: "1em" }}>
            <TableHead>
              <TableRow>
                <TableCell>Vacation type</TableCell>
                <TableCell>Employee</TableCell>
                <TableCell>Days</TableCell>
                <TableCell>Start Date</TableCell>
                <TableCell>End Date</TableCell>
                <TableCell>Remaining Days</TableCell>
                <TableCell>Status</TableCell>
                <TableCell/>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.values(vacationRequests).map((request: Request) => (
                <ExpandableRow key={request.id} request={request}/>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  )
};

export default renderEmployeeVacationRequests;