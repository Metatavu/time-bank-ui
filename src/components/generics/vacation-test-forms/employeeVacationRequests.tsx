import { Box, Button, Collapse, FormControl, IconButton, InputLabel, MenuItem, Select, SelectChangeEvent, styled, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import useEditorContentStyles from "styles/editor-content/editor-content";
import theme from "theme/theme";
import { useState, useEffect, useContext } from "react";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { CalendarPickerView } from "@mui/x-date-pickers";
import strings from "localization/strings";
import DateRangePicker from "../date-range-picker/date-range-picker";
import { END_OF_YEAR, FilterScopes, START_OF_YEAR } from "types";
import { Person, VacationRequest, VacationRequestStatus, VacationType } from "generated/client";
import Api from "api/api";
import { useAppSelector } from "app/hooks";
import { ErrorContext } from "components/error-handler/error-handler";
import { selectPerson } from "features/person/person-slice";
import { selectAuth } from "features/auth/auth-slice";
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
  },
  // eslint-disable-next-line no-restricted-globals
  ...(status === "APPROVED" ? { "&.approved": {} } : { "&.pending": {} })

}));

/**
 * renders employee vacation request view
 */
const RenderEmployeeVacationRequests = ({ persons }: { persons: Person[] }) => {
  const classes = useEditorContentStyles();
  const [ status, setStatus ] = useState<VacationRequestStatus>(VacationRequestStatus.PENDING);
  const [ dateFormat ] = useState("yyyy.MM.dd");
  const [ datePickerView ] = useState<CalendarPickerView>("day");
  const { person } = useAppSelector(selectPerson);
  const { accessToken } = useAppSelector(selectAuth);
  const context = useContext(ErrorContext);
  const [, setRequests ] = useState<VacationRequest[]>([]);
  const [ openRows, setOpenRows ] = useState<boolean[]>([]);
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [filteredRequests, setFilteredRequests] = useState<VacationRequest[]>([]);
  const [filterOptions, setFilterOptions] = useState<{
    employee: string;
    vacationType: VacationType | string;
    status: VacationRequestStatus;
    startDate: Date | null;
    endDate: Date | null;
  }>({
    employee: "Everyone",
    vacationType: "All",
    status: VacationRequestStatus.PENDING,
    startDate: START_OF_YEAR,
    endDate: END_OF_YEAR
  });

  /**
   * Filters for filtering application
   */
  const applyFilters = (vacations: VacationRequest[]) => {
    const filteredVacations = vacations.filter(request => {
    // Filter by employee
      if (filterOptions.employee !== "Everyone" && request.person.toString() !== filterOptions.employee) {
        return false;
      }

      // Filter by vacation type
      if (filterOptions.vacationType !== "All" && request.type !== filterOptions.vacationType) {
        return false;
      }
      // Filter by application status
      if (request.hrManagerStatus !== filterOptions.status) {
        return false;
      }
      // Filter by start and end dates
      if (
        filterOptions.startDate &&
      new Date(request.startDate) <= filterOptions.startDate
      ) {
        return false;
      }
      if (
        filterOptions.endDate &&
      new Date(request.endDate) >= filterOptions.endDate
      ) {
        return false;
      }
      return true;
    });

    setFilteredRequests(filteredVacations);
  };

  /**
 * Initializes all vacation requests
 */
  const initializeRequests = async () => {
    try {
      const vacationsApi = Api.getVacationRequestsApi(accessToken?.access_token);
      const vacations = await vacationsApi.listVacationRequests({});

      setRequests(vacations);
      applyFilters(vacations); // Apply filters after setting the vacations
    } catch (error) {
      context.setError(strings.errorHandling.fetchVacationDataFailed, error);
    }
  };

  useEffect(() => {
    if (!accessToken) {
      return;
    }
    initializeRequests();
  }, [person, filterOptions]);

  /**
   * Handle employee change
   * @param event select employee
   */
  const handleEmployeeChange = (event: SelectChangeEvent) => {
    const contentValue = event.target.value;
    setFilterOptions(prevOptions => ({
      ...prevOptions,
      employee: contentValue.toString()
    }));
  };

  /**
   * Function to resetting the filtering
   */
  const resetFilters = () => {
    setFilterOptions({
      employee: "Everyone",
      vacationType: "All",
      status: VacationRequestStatus.PENDING,
      startDate: new Date(),
      endDate: null
    });
  };

  /**
   * Handle the reset filters
   */
  const handleResetFilters = () => {
    resetFilters();
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
      <InputLabel>{ strings.vacationRequests.employee }</InputLabel>
      <Select
        value={ filterOptions.employee }
        onChange={ handleEmployeeChange }
        label={ strings.vacationRequests.employee }
      >
        <MenuItem value="Everyone">
          {strings.vacationRequests.everyone}
        </MenuItem>
        {persons.map(p => (
          <MenuItem key={p.id} value={p.id}>
            {`${p.firstName} ${p.lastName}`}
          </MenuItem>

        ))}
      </Select>
    </FormControl>
  );

  /**
   * Method to handle vacation starting date change
   * @param date selected date
   */
  const handleVacationStartDateChange = (date: Date | null) => {
    if (!date) return;

    setFilterOptions(prevOptions => ({
      ...prevOptions,
      startDate: date
    }));
  };

  /**
   * Method to handle vacation ending date change
   * @param date selected date
   */
  const handleVacationEndDateChange = (date: Date | null) => {
    if (!date) return;

    setFilterOptions(prevOptions => ({
      ...prevOptions,
      endDate: date
    }));
  };

  /**
   * Handle vacation type 
   */
  const handleVacationTypeChange = (event: SelectChangeEvent) => {
    const contentValue = event.target.value as VacationType;
    setFilterOptions(prevOptions => ({
      ...prevOptions,
      vacationType: contentValue

    }));
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
      <InputLabel>{ strings.vacationRequests.vacationType }</InputLabel>
      <Select
        value={ filterOptions.vacationType }
        onChange={ handleVacationTypeChange }
        label={ strings.vacationRequests.vacationType }
      >
        <MenuItem value="All">
          { strings.vacationRequests.all }
        </MenuItem>
        <MenuItem value={ VacationType.VACATION }>
          { strings.vacationRequests.vacation }
        </MenuItem>
        <MenuItem value={ VacationType.UNPAID_TIME_OFF}>
          { strings.vacationRequests.unpaidTimeOff }
        </MenuItem>
        <MenuItem value={ VacationType.SICKNESS}>
          { strings.vacationRequests.sickness }
        </MenuItem>
        <MenuItem value={ VacationType.PERSONAL_DAYS }>
          { strings.vacationRequests.personalDays }
        </MenuItem>
        <MenuItem value={ VacationType.MATERNITY_PATERNITY }>
          { strings.vacationRequests.maternityPaternityLeave }
        </MenuItem>
        <MenuItem value={ VacationType.CHILD_SICKNESS }>
          {strings.vacationRequests.childSickness }
        </MenuItem>
      </Select>
    </FormControl>
  );

  /**
   * Handle status change
   */
  const handleStatusChange = (event: SelectChangeEvent) => {
    const contentValue = event.target.value as VacationRequestStatus;
    setFilterOptions(prevOptions => ({
      ...prevOptions,
      status: contentValue
    }));
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
      <InputLabel>{ strings.vacationRequests.status }</InputLabel>
      <Select
        value={ status }
        onChange={handleStatusChange}
        label={ strings.vacationRequests.status }
      >
        <MenuItem value={ VacationRequestStatus.PENDING }>
          { strings.vacationRequests.pending }
        </MenuItem>
        <MenuItem value={ VacationRequestStatus.APPROVED }>
          { strings.vacationRequests.approved }
        </MenuItem>
        <MenuItem value={ VacationRequestStatus.DECLINED }>
          { strings.vacationRequests.declined }
        </MenuItem>
      </Select>
    </FormControl>
  );
  
  /**
   * 
   * @param id 
   * @returns 
   */
  const handlePersonNames = (id: number) => {
    const foundPerson = persons.find(p => p.id === id);
    if (foundPerson) {
      return `${foundPerson.firstName} ${foundPerson.lastName}`;
    }
    return "";
  };

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

  const sortedVacationRequests = filteredRequests.sort((a, b) => {
    if (sortBy === "days") {
      const daysA = Number(a.days);
      const daysB = Number(b.days);
      return sortOrder === "asc" ? daysA - daysB : daysB - daysA;
    }
    
    if (sortBy === "employee") {
      return sortOrder === "asc"
        ? handlePersonNames(a.person).localeCompare(handlePersonNames(b.person))
        : handlePersonNames(b.person).localeCompare(handlePersonNames(a.person));
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
        ? a.type.localeCompare(b.type)
        : b.type.localeCompare(a.type);
    }
    if (sortBy === "status") {
      return sortOrder === "asc"
        ? a.hrManagerStatus.localeCompare(b.hrManagerStatus)
        : b.hrManagerStatus.localeCompare(a.hrManagerStatus);
    }
    return 0; // No sorting applied
  });
  
  /**
   * Handle remaining vacation days
   */
  const handleRemainingVacationDays = (request: VacationRequest) => {
    const foundPerson = persons.find(p => p.id === request.person);
    if (foundPerson) { return foundPerson.unspentVacations - request.days; }
    return null;
  };

  /**
   * Handle request type
   */
  const handleRequestType = (type: VacationType) => {
    switch (type) {
      case VacationType.VACATION:
        return strings.vacationRequests.vacation;
      case VacationType.PERSONAL_DAYS:
        return strings.vacationRequests.personalDays;
      case VacationType.UNPAID_TIME_OFF:
        return strings.vacationRequests.unpaidTimeOff;
      case VacationType.MATERNITY_PATERNITY:
        return strings.vacationRequests.maternityPaternityLeave;
      case VacationType.SICKNESS:
        return strings.vacationRequests.sickness;
      case VacationType.CHILD_SICKNESS:
        return strings.vacationRequests.childSickness;
      default:
        return strings.vacationRequests.vacation;
    }
  };

  /**
   * Handle request status
   */
  const handleRequestStatus = (requestStatus: VacationRequestStatus) => {
    const statusMap = {
      [VacationRequestStatus.PENDING]: strings.vacationRequests.pending,
      [VacationRequestStatus.APPROVED]: strings.vacationRequests.approved,
      [VacationRequestStatus.DECLINED]: strings.vacationRequests.declined
    };
  
    return statusMap[requestStatus] || "";
  };

  return (
    <Box className={classes.employeeVacationRequests}>
      <Box>
        <Button
          type="button"
          onClick={handleResetFilters}
          style={{
            float: "right", color: "white", backgroundColor: "#FF493C"
          }}
        >
          Reset Filters
        </Button>
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
              selectedStartDate={ filterOptions.startDate ?? new Date(new Date().getFullYear(), 0, 1) }
              selectedEndDate={ filterOptions.endDate ?? new Date(new Date().getFullYear(), 11, 31)}
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
        <TableContainer style={{ marginBottom: "10px", width: "100%" }}>
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
              {sortedVacationRequests.map((request: VacationRequest, index: number) => (
                <>
                  <StyledTableRow key={ request.id }>
                    <StyledTableCell component="th" scope="row">{ handleRequestType(request.type)}</StyledTableCell>
                    <StyledTableCell>{ handlePersonNames(request.person!!) }</StyledTableCell>
                    <StyledTableCell>{ request.days }</StyledTableCell>
                    <StyledTableCell>{ request.startDate.toDateString() }</StyledTableCell>
                    <StyledTableCell>{ request.endDate.toDateString() }</StyledTableCell>
                    <StyledTableCell>{ handleRemainingVacationDays(request)}</StyledTableCell>
                    <StyledTableCell sx={{ "&.pending": { color: "#FF493C" }, "&.approved": { color: "#45cf36" } }} className={ request.hrManagerStatus === "APPROVED" ? "approved" : "pending"}>{handleRequestStatus(request.hrManagerStatus)}</StyledTableCell>
                    <StyledTableCell>
                      <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => {
                          const newOpenRows = [...openRows];
                          newOpenRows[index] = !newOpenRows[index];
                          setOpenRows(newOpenRows);
                        }}
                      >
                        { openRows[index] ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/> }
                      </IconButton>
                    </StyledTableCell>
                  </StyledTableRow>
                  <TableRow>
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
                      <Collapse in={ openRows[index] } timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1, width: "100%" }}>
                          <Table size="small" aria-label="purchases">
                            <TableHead>
                              <TableRow>
                                <TableCell>{ strings.vacationRequests.message }</TableCell>
                                <TableCell>{ strings.vacationRequests.created }</TableCell>
                                <TableCell>{ strings.vacationRequests.updated }</TableCell>
                                <TableCell>{ strings.vacationRequests.projectManager }</TableCell>
                                <TableCell>{ strings.vacationRequests.humanResourcesManager }</TableCell>
                                <TableCell/>
                                <TableCell/>
                                <TableCell/>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              <TableRow key={ request.id }>
                                <TableCell>{ request.message }</TableCell>
                                <TableCell>{ request.createdAt.toDateString() }</TableCell>
                                <TableCell>{ request.updatedAt.toDateString() }</TableCell>
                                <TableCell>{ handleRequestStatus(request.projectManagerStatus) }</TableCell>
                                <TableCell>{ handleRequestStatus(request.hrManagerStatus) }</TableCell>
                                <TableCell/>
                                <TableCell align="right"><Button variant="outlined" color="error" sx={{ color: "#F9473B" }}>{ strings.vacationRequests.declined }</Button></TableCell>
                                <TableCell align="right"><Button variant="outlined" color="success" sx={{ color: "green" }}>{ strings.vacationRequests.approved }</Button></TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default RenderEmployeeVacationRequests;