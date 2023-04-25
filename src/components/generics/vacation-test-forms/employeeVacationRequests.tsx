import { Box, Button, Collapse, FormControl, IconButton, InputLabel, MenuItem, Select, SelectChangeEvent, styled, Table, TableBody, TableCell, tableCellClasses, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import useEditorContentStyles from "styles/editor-content/editor-content";
import theme from "theme/theme";
import vacationRequests from "./testVacationMockData.json";
import { useState } from "react";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { CalendarPickerView } from "@mui/x-date-pickers";
import strings from "localization/strings";
import DateRangePicker from "../date-range-picker/date-range-picker";
import { FilterScopes } from "types";
import { VacationType } from "generated/client";

/**
 * interface type request
 */
interface Request {
  request: {
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
}

/**
 * Styled expandable table row
 */
const StyledTableRow = styled(TableRow)(() => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0
  }
}));

/**
 * Styled expandable table cell
 */
const StyledTableCell = styled(TableCell)(() => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.white,
    color: theme.palette.common.black
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14
  },
  "& .pending": {
    color: "#FF493C"
  },
  "& .accepted": {
    color: "#45cf36"
  },
  
  // eslint-disable-next-line no-restricted-globals
  ...(status === "ACCEPTED" ? { "&.accepted": {} } : { "&.pending": {} })
}));

/**
 * 
 * @param id
 * @param vacationType
 * @param employee
 * @param days
 * @param startDate
 * @param endDate
 * @param remainingDays
 * @param status
 * @returns Expandable row
 */
const ExpandableRow = (
  { request: { id,
    vacationType,
    employee,
    days,
    startDate,
    endDate,
    remainingDays,
    status } }: Request
) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <StyledTableRow key={ id }>
        <StyledTableCell component="th" scope="row">{ vacationType }</StyledTableCell>
        <StyledTableCell>{ employee }</StyledTableCell>
        <StyledTableCell>{ days }</StyledTableCell>
        <StyledTableCell>{ startDate }</StyledTableCell>
        <StyledTableCell>{ endDate }</StyledTableCell>
        <StyledTableCell>{ remainingDays }</StyledTableCell>
        <StyledTableCell sx={{ "&.pending": { color: "#FF493C" }, "&.accepted": { color: "#45cf36" } }} className={status === "ACCEPTED" ? "accepted" : "pending"}>{ status }</StyledTableCell>
        <StyledTableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}
          </IconButton>
        </StyledTableCell>
      </StyledTableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
          <Collapse in={ open } timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1, width: "100%" }}>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>{ strings.editorContent.comment }</TableCell>
                    <TableCell>{ strings.editorContent.created }</TableCell>
                    <TableCell>{ strings.editorContent.updated }</TableCell>
                    <TableCell>{ strings.editorContent.projectManager }</TableCell>
                    <TableCell>{ strings.editorContent.humanResourcesManager }</TableCell>
                    <TableCell/>
                    <TableCell/>
                    <TableCell/>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.values(vacationRequests).map(request => (
                    <TableRow key={ request.id }>
                      <TableCell component="th" scope="row">{ request.comment }</TableCell>
                      <TableCell>{ request.created }</TableCell>
                      <TableCell>{ request.updated }</TableCell>
                      <TableCell>{ request.projectManager }</TableCell>
                      <TableCell>{ request.humanResourcesManager }</TableCell>
                      <TableCell/>
                      <TableCell align="right"><Button variant="outlined" color="error" sx={{ color: "#F9473B" }}>{ strings.editorContent.declined }</Button></TableCell>
                      <TableCell align="right"><Button variant="outlined" color="success" sx={{ color: "green" }}>{ strings.editorContent.approved }</Button></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

/**
 * renders employee vacation request view
 */
const renderEmployeeVacationRequests = () => {
  const classes = useEditorContentStyles();
  const [ status, setStatus ] = useState("");
  const [ employee, setEmployee ] = useState("");
  const [ vacationType, setVacationType ] = useState("");
  const [ dateFormat ] = useState("yyyy.MM.dd");
  const [ datePickerView ] = useState<CalendarPickerView>("day");
  const [ selectedVacationStartDate, setSelectedVacationStartDate ] = useState(new Date());
  const [ selectedVacationEndDate, setSelectedVacationEndDate ] = useState(new Date());

  /**
   * Handle employee change
   * @param event select employee
   */
  const handleEmployeeChange = (event: SelectChangeEvent) => {
    const contentValue = event.target.value;
    setEmployee(contentValue);
  };

  /**
   * Renders employee selection
   */
  const renderEmployeeSelection = () => (
    <FormControl
      variant="standard"
      sx={{
        margin: 1,
        minWidth: 165,
        marginBottom: 4
      }}
    >
      <InputLabel>{ strings.editorContent.employee }</InputLabel>
      <Select
        value={ employee }
        onChange={ handleEmployeeChange }
        label={ strings.editorContent.employee }
      >
        {Object.values(vacationRequests).map(request => (
          <MenuItem value={ request.employee }>{ request.employee }</MenuItem>
        ))}
      </Select>
    </FormControl>
  );

  /**
   * Method to handle vacation starting date change
   * @param date selected date
   */
  const handleVacationStartDateChange = (date: Date | null) => {
    date && setSelectedVacationStartDate(date);
  };

  /**
   * Method to handle vacation ending date change
   * @param date selected date
   */
  const handleVacationEndDateChange = (date: Date | null) => {
    date && setSelectedVacationEndDate(date);
  };

  /**
   * Handle vacation type 
   */
  const handleVacationTypeChange = (event: SelectChangeEvent) => {
    const contentValue = event.target.value;
    setVacationType(contentValue);
  };

  /**
   * Renders the vacation type selection
   */
  const renderVacationType = () => (
    <FormControl
      variant="standard"
      sx={{
        margin: 1,
        minWidth: 165,
        marginBottom: 4
      }}
    >
      <InputLabel>{ strings.editorContent.vacationType }</InputLabel>
      <Select
        value={ vacationType }
        onChange={ handleVacationTypeChange }
        label={ strings.editorContent.vacationType }
      >
        <MenuItem value={ VacationType.VACATION }>{ strings.editorContent.vacation }</MenuItem>
        <MenuItem value={ VacationType.UNPAID_TIME_OFF}>{ strings.editorContent.unpaidTimeOff }</MenuItem>
        <MenuItem value={ VacationType.SICKNESS}>{ strings.editorContent.sickness }</MenuItem>
        <MenuItem value={ VacationType.PERSONAL_DAYS }>{ strings.editorContent.personalDays }</MenuItem>
        <MenuItem value={ VacationType.MATERNITY_PATERNITY }>{ strings.editorContent.maternityPaternityLeave }</MenuItem>
        <MenuItem value={ VacationType.CHILD_SICKNESS }>{ strings.editorContent.childSickness }</MenuItem>
      </Select>
    </FormControl>
  );

  /**
   * Handle employee change
   */
  const handleStatusChange = (event: SelectChangeEvent) => {
    const contentValue = event.target.value;
    setStatus(contentValue);
  };

  /**
   * Renders the vacation type selection
   */
  const renderRequestStatus = () => (
    <FormControl
      variant="standard"
      sx={{
        m: 1, minWidth: 165, marginBottom: 4
      }}
    >
      <InputLabel>{ strings.editorContent.status }</InputLabel>
      <Select
        value={ status }
        onChange={handleStatusChange}
        label={ strings.editorContent.status }
      >
        <MenuItem value="Pending">{ strings.editorContent.pending }</MenuItem>
        <MenuItem value="Approved">{ strings.editorContent.approved }</MenuItem>
        <MenuItem value="Declined">{ strings.editorContent.declined }</MenuItem>
      </Select>
    </FormControl>
  );

  return (
    <Box className={classes.employeeVacationRequests}>
      <Box>
        <Box sx={{
          float: "left", marginBottom: "10px"
        }}
        >
          <Typography variant="h2" padding={theme.spacing(2)}>
            { strings.header.requests }
          </Typography>
        </Box>
        <Box sx={{
          float: "right",
          paddingRight: "15px",
          marginBottom: "10px"
        }}
        >
          { renderVacationType() }
          { renderEmployeeSelection() }
          { renderRequestStatus() }
          <Box className={ classes.datePickers }>
            <DateRangePicker
              scope={ FilterScopes.DATE }
              dateFormat={ dateFormat }
              selectedStartDate={ selectedVacationStartDate }
              selectedEndDate={ selectedVacationEndDate }
              datePickerView={ datePickerView }
              onStartDateChange={ handleVacationStartDateChange }
              onEndDateChange={ handleVacationEndDateChange }
              onStartWeekChange={() => {
                throw new Error("Function not implemented.");
              } }
              onEndWeekChange={() => {
                throw new Error("Function not implemented.");
              } }
            />
          </Box>
        </Box>
      </Box>
      <Box>
        <TableContainer style={{ height: 300, width: "100%" }}>
          <Table aria-label="customized table" style={{ marginBottom: "1em" }}>
            <TableHead>
              <TableRow>
                <TableCell>{ strings.header.vacationType }</TableCell>
                <TableCell>{ strings.header.employee }</TableCell>
                <TableCell>{ strings.header.days }</TableCell>
                <TableCell>{ strings.header.startDate }</TableCell>
                <TableCell>{ strings.header.endDate }</TableCell>
                <TableCell>{ strings.header.remainingDays }</TableCell>
                <TableCell>{ strings.header.status }</TableCell>
                <TableCell/>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.values(vacationRequests).map(request => (
                <ExpandableRow key={ request.id } request={ request }/>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default renderEmployeeVacationRequests;