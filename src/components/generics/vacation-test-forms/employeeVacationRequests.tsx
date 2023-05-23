import { Box, Button, Collapse, FormControl, IconButton, InputLabel, MenuItem, Select, SelectChangeEvent, styled, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import useEditorContentStyles from "styles/editor-content/editor-content";
import theme from "theme/theme";
import vacationRequests from "./vacationMockData";
import { useState } from "react";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { CalendarPickerView } from "@mui/x-date-pickers";
import strings from "localization/strings";
import DateRangePicker from "../date-range-picker/date-range-picker";
import { FilterScopes } from "types";
import { VacationRequestStatus, VacationType } from "generated/client";
import { Request } from "types/index";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

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
  "& .pending": {
    color: "#FF493C"
  },
  "& .approved": {
    color: "#45cf36"
  }

}));

interface ExpandableRowProps {
  request: Request;
  
}

/**
 * renders employee vacation request view
 */
const renderEmployeeVacationRequests = () => {
  const classes = useEditorContentStyles();
  const [ status, setStatus ] = useState<VacationRequestStatus>(VacationRequestStatus.PENDING);
  const [ employee, setEmployee ] = useState("");
  const [ vacationType, setVacationType ] = useState<VacationType>(VacationType.VACATION);
  const [ dateFormat ] = useState("yyyy.MM.dd");
  const [ datePickerView ] = useState<CalendarPickerView>("day");
  const [ selectedVacationStartDate, setSelectedVacationStartDate ] = useState(new Date());
  const [ selectedVacationEndDate, setSelectedVacationEndDate ] = useState(new Date());
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  /**
   * Expandable row
   *
   * @param request
   */
  const ExpandableRow = ({ request }: ExpandableRowProps) => {
    const [open, setOpen] = useState(false);

    /**
     * Convert a date string or Date object to ISO format
     * @param dateStringOrDate - The date string or Date object
     * @returns The date in ISO format
     */
    function convertDateToISOFormat(dateStringOrDate: string | Date): string {
      if (typeof dateStringOrDate === "string") {
        const [day, month, year] = dateStringOrDate.split(".");
        const isoDate = `${year}-${month}-${day}`;
        return isoDate;
      }
      return dateStringOrDate.toISOString();
    }

    const sortedVacationRequests = Object.values(vacationRequests).sort((a, b) => {
      if (sortBy === "days") {
        const daysA = Number(a.days);
        const daysB = Number(b.days);
        return sortOrder === "asc" ? daysA - daysB : daysB - daysA;
      }
      if (sortBy === "employee") {
        return sortOrder === "asc"
          ? a.employee.localeCompare(b.employee)
          : b.employee.localeCompare(a.employee);
      }
      if (sortBy === "startDate") {
        const dateA = new Date(convertDateToISOFormat(a.startDate));
        const dateB = new Date(convertDateToISOFormat(b.startDate));
        return sortOrder === "asc" ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
      }
      if (sortBy === "endDate") {
        const dateA = new Date(convertDateToISOFormat(a.endDate));
        const dateB = new Date(convertDateToISOFormat(b.endDate));
        return sortOrder === "asc" ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
      }
      if (sortBy === "vacationType") {
        return sortOrder === "asc"
          ? a.vacationType.localeCompare(b.vacationType)
          : b.vacationType.localeCompare(a.vacationType);
      }
      if (sortBy === "status") {
        return sortOrder === "asc"
          ? a.status.localeCompare(b.status)
          : b.status.localeCompare(a.status);
      }
      return 0; // No sorting applied
    });

    return (
      <>
        <StyledTableRow key={ request.id }>
          <StyledTableCell component="th" scope="row">{ request.vacationType }</StyledTableCell>
          <StyledTableCell>{ request.employee }</StyledTableCell>
          <StyledTableCell>{ request.days }</StyledTableCell>
          <StyledTableCell>{ request.startDate }</StyledTableCell>
          <StyledTableCell>{ request.endDate }</StyledTableCell>
          <StyledTableCell>{ request.remainingDays }</StyledTableCell>
          <StyledTableCell
            sx={{ "&.pending": { color: "#FF493C" }, "&.approved": { color: "#45cf36" } }}
            className={ request.status === "APPROVED" ? "approved" : "pending"}
          >
            { request.status }
          </StyledTableCell>
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
                      <TableCell>{ strings.editorContent.message }</TableCell>
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
                    {sortedVacationRequests.map(item => (
                      <TableRow key={ item.id }>
                        <TableCell>{ item.message }</TableCell>
                        <TableCell>{ item.created }</TableCell>
                        <TableCell>{ item.updated }</TableCell>
                        <TableCell>{ item.projectManager }</TableCell>
                        <TableCell>{ item.humanResourcesManager }</TableCell>
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
          <MenuItem key={request.employee} value={ request.employee }>{ request.employee }</MenuItem>
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
    const contentValue = event.target.value as VacationType;
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
        <MenuItem value={ VacationType.VACATION }>
          { strings.editorContent.vacation }
        </MenuItem>
        <MenuItem value={ VacationType.UNPAID_TIME_OFF}>
          { strings.editorContent.unpaidTimeOff }
        </MenuItem>
        <MenuItem value={ VacationType.SICKNESS}>
          { strings.editorContent.sickness }
        </MenuItem>
        <MenuItem value={ VacationType.PERSONAL_DAYS }>
          { strings.editorContent.personalDays }
        </MenuItem>
        <MenuItem value={ VacationType.MATERNITY_PATERNITY }>
          { strings.editorContent.maternityPaternityLeave }
        </MenuItem>
        <MenuItem value={ VacationType.CHILD_SICKNESS }>
          {strings.editorContent.childSickness }
        </MenuItem>
      </Select>
    </FormControl>
  );

  /**
   * Handle the column header click and update the sorting state
   * @param column 
   */
  const handleSort = (column: string) => {
    if (column === sortBy) {
      // If the same column is clicked again, toggle the sort order
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      // If a different column is clicked, update the sorting column and set the sort order to ascending
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  /**
   * Convert a date string or Date object to ISO format
   * @param dateStringOrDate - The date string or Date object
   * @returns The date in ISO format
   */
  function convertToISOFormat(dateStringOrDate: string | Date): string {
    if (typeof dateStringOrDate === "string") {
      const [day, month, year] = dateStringOrDate.split(".");
      const isoDate = `${year}-${month}-${day}`;
      return isoDate;
    }
    return dateStringOrDate.toISOString();
  }

  const sortedVacationRequests = Object.values(vacationRequests).sort((a, b) => {
    if (sortBy === "days") {
      const daysA = Number(a.days);
      const daysB = Number(b.days);
      return sortOrder === "asc" ? daysA - daysB : daysB - daysA;
    }
    if (sortBy === "employee") {
      return sortOrder === "asc"
        ? a.employee.localeCompare(b.employee)
        : b.employee.localeCompare(a.employee);
    }
    if (sortBy === "startDate") {
      const dateA = new Date(convertToISOFormat(a.startDate));
      const dateB = new Date(convertToISOFormat(b.startDate));
      return sortOrder === "asc" ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
    }
    if (sortBy === "endDate") {
      const dateA = new Date(convertToISOFormat(a.endDate));
      const dateB = new Date(convertToISOFormat(b.endDate));
      return sortOrder === "asc" ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
    }
    if (sortBy === "vacationType") {
      return sortOrder === "asc"
        ? a.vacationType.localeCompare(b.vacationType)
        : b.vacationType.localeCompare(a.vacationType);
    }
    if (sortBy === "status") {
      return sortOrder === "asc"
        ? a.status.localeCompare(b.status)
        : b.status.localeCompare(a.status);
    }
    return 0; // No sorting applied
  });

  /**
   * Handle employee change
   */
  const handleStatusChange = (event: SelectChangeEvent) => {
    const contentValue = event.target.value as VacationRequestStatus;
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
        <MenuItem value={ VacationRequestStatus.PENDING }>
          { strings.editorContent.pending }
        </MenuItem>
        <MenuItem value={ VacationRequestStatus.APPROVED }>
          { strings.editorContent.approved }
        </MenuItem>
        <MenuItem value={ VacationRequestStatus.DECLINED }>
          { strings.editorContent.declined }
        </MenuItem>
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
                <TableCell
                  onClick={() => handleSort("vacationType")}
                  style={{ cursor: "pointer" }}
                >
                  {strings.header.vacationType}
                  {sortBy === "vacationType" && (
                    <Box component="span" ml={1}>
                      {sortOrder === "asc" ? (
                        <ArrowUpwardIcon fontSize="small"/>
                      ) : (
                        <ArrowDownwardIcon fontSize="small"/>
                      )}
                    </Box>
                  )}
                </TableCell>
                <TableCell
                  onClick={() => handleSort("employee")}
                  style={{ cursor: "pointer" }}
                >
                  {strings.header.employee}
                  {sortBy === "employee" && (
                    <Box component="span" ml={1}>
                      {sortOrder === "asc" ? (
                        <ArrowUpwardIcon fontSize="small"/>
                      ) : (
                        <ArrowDownwardIcon fontSize="small"/>
                      )}
                    </Box>
                  )}
                </TableCell>
                <TableCell
                  onClick={() => handleSort("days")}
                  style={{ cursor: "pointer" }}
                >
                  {strings.header.days}
                  {sortBy === "days" && (
                    <Box component="span" ml={1}>
                      {sortOrder === "asc" ? (
                        <ArrowUpwardIcon fontSize="small"/>
                      ) : (
                        <ArrowDownwardIcon fontSize="small"/>
                      )}
                    </Box>
                  )}
                </TableCell>
                <TableCell
                  onClick={() => handleSort("startDate")}
                  style={{ cursor: "pointer" }}
                >
                  {strings.header.startDate}
                  {sortBy === "startDate" && (
                    <Box component="span" ml={1}>
                      {sortOrder === "asc" ? (
                        <ArrowUpwardIcon fontSize="small"/>
                      ) : (
                        <ArrowDownwardIcon fontSize="small"/>
                      )}
                    </Box>
                  )}
                </TableCell>
                <TableCell
                  onClick={() => handleSort("endDate")}
                  style={{ cursor: "pointer" }}
                >
                  {strings.header.endDate}
                  {sortBy === "endDate" && (
                    <Box component="span" ml={1}>
                      {sortOrder === "asc" ? (
                        <ArrowUpwardIcon fontSize="small"/>
                      ) : (
                        <ArrowDownwardIcon fontSize="small"/>
                      )}
                    </Box>
                  )}
                </TableCell>
                <TableCell
                  onClick={() => handleSort("remainingDays")}
                  style={{ cursor: "pointer" }}
                >
                  {strings.header.remainingDays}
                  {sortBy === "remainingDays" && (
                    <Box component="span" ml={1}>
                      {sortOrder === "asc" ? (
                        <ArrowUpwardIcon fontSize="small"/>
                      ) : (
                        <ArrowDownwardIcon fontSize="small"/>
                      )}
                    </Box>
                  )}
                </TableCell>
                <TableCell
                  onClick={() => handleSort("status")}
                  style={{ cursor: "pointer" }}
                >
                  {strings.header.status}
                  {sortBy === "status" && (
                    <Box component="span" ml={1}>
                      {sortOrder === "asc" ? (
                        <ArrowUpwardIcon fontSize="small"/>
                      ) : (
                        <ArrowDownwardIcon fontSize="small"/>
                      )}
                    </Box>
                  )}
                </TableCell>
                <TableCell/>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedVacationRequests.map((request: Request) => (
                <ExpandableRow key={request.id} request={request}/>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default renderEmployeeVacationRequests;