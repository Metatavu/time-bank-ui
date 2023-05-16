import { Box, Button, Collapse, FormControl, IconButton, InputLabel, MenuItem, Select, SelectChangeEvent, styled, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import useEditorContentStyles from "styles/editor-content/editor-content";
import theme from "theme/theme";
import { useState, useEffect, useContext } from "react";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { CalendarPickerView } from "@mui/x-date-pickers";
import strings from "localization/strings";
import DateRangePicker from "../date-range-picker/date-range-picker";
import { FilterScopes } from "types";
import { Person, VacationRequest, VacationRequestStatus, VacationType } from "generated/client";
import Api from "api/api";
import { useAppSelector } from "app/hooks";
import { ErrorContext } from "components/error-handler/error-handler";
import { selectPerson } from "features/person/person-slice";
import { selectAuth } from "features/auth/auth-slice";

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
const renderEmployeeVacationRequests = () => {
  const classes = useEditorContentStyles();
  const [ status, setStatus ] = useState<VacationRequestStatus>(VacationRequestStatus.PENDING);
  const [ employee, setEmployee ] = useState("Everyone");
  const [ vacationType, setVacationType ] = useState<VacationType>(VacationType.VACATION);
  const [ dateFormat ] = useState("yyyy.MM.dd");
  const [ datePickerView ] = useState<CalendarPickerView>("day");
  const [ selectedVacationStartDate, setSelectedVacationStartDate ] = useState(new Date());
  const [ selectedVacationEndDate, setSelectedVacationEndDate ] = useState(new Date());
  const { person } = useAppSelector(selectPerson);
  const { accessToken } = useAppSelector(selectAuth);
  const context = useContext(ErrorContext);
  const [ requests, setRequests ] = useState<VacationRequest[]>([]);
  const [ openRows, setOpenRows ] = useState<boolean[]>([]);
  const [ persons, setPersons ] = useState<Person[]>([]);

  /**
   * Initializes all vacation requests
   */
  const fetchPersonData = async () => {
    try {
      const fetchedPersons = await Api.getPersonsApi(accessToken?.access_token).listPersons({
        active: true
      });
      setPersons(fetchedPersons);
    } catch (error) {
      context.setError(strings.errorHandling.fetchUserDataFailed, error);
    }
  };

  /**
   * Initializes all vacation requests
   */
  const initializeRequests = async () => {
    console.log("Person not here");
    if (!person) return;
    console.log("Person here");

    try {
      const vacationsApi = Api.getVacationRequestsApi(accessToken?.access_token);
      const vacations = await vacationsApi.listVacationRequests({});
      setRequests(vacations);
      console.log(vacations);
    } catch (error) {
      context.setError(strings.errorHandling.fetchVacationDataFailed, error);
    }
    // eslint-disable-next-line no-console
    console.log(requests);
  };

  useEffect(() => {
    console.log("before access token in UE");
    if (!accessToken) {
      return;
    }
    console.log("use effect here");
    initializeRequests();
    fetchPersonData();
    // eslint-disable-next-line no-console
    console.log(requests);
  }, [person]);

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
        <MenuItem value="Everyone">
          Everyone
        </MenuItem>
        {persons.map(p => (
          <MenuItem value={ p.id }>
            { `${p.firstName} ${p.lastName}`}
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

  /**
   * Handle person names
   */
  const handlePersonNames = (id: Number) => {
    const foundPerson = persons.find(p => p.id === id);
    if (foundPerson) { return `${foundPerson.firstName} ${foundPerson.lastName}`; }
    return null;
  };

  /**
   * Handle remaining vacation days
   */
  const handleRemainingVacationDays = (request: VacationRequest) => {
    const foundPerson = persons.find(p => p.id === request.person);
    if (foundPerson) { return foundPerson.unspentVacations - request.days; }
    return null;
  };

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
        <TableContainer style={{ height: 700, width: "100%" }}>
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
              {requests.map((request: VacationRequest, index: number) => (
                <>
                  <StyledTableRow key={ request.id }>
                    <StyledTableCell component="th" scope="row">{ request.type }</StyledTableCell>
                    <StyledTableCell>{ handlePersonNames(request.person!!) }</StyledTableCell>
                    <StyledTableCell>{ request.days }</StyledTableCell>
                    <StyledTableCell>{ request.startDate.toDateString() }</StyledTableCell>
                    <StyledTableCell>{ request.endDate.toDateString() }</StyledTableCell>
                    <StyledTableCell>{ handleRemainingVacationDays(request)}</StyledTableCell>
                    <StyledTableCell sx={{ "&.pending": { color: "#FF493C" }, "&.approved": { color: "#45cf36" } }} className={ request.hrManagerStatus === "APPROVED" ? "approved" : "pending"}>{ request.hrManagerStatus }</StyledTableCell>
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
                              <TableRow key={ request.id }>
                                <TableCell>{ request.message }</TableCell>
                                <TableCell>{ request.createdAt.toDateString() }</TableCell>
                                <TableCell>{ request.updatedAt.toDateString() }</TableCell>
                                <TableCell>{ request.projectManagerStatus }</TableCell>
                                <TableCell>{ request.hrManagerStatus }</TableCell>
                                <TableCell/>
                                <TableCell align="right"><Button variant="outlined" color="error" sx={{ color: "#F9473B" }}>{ strings.editorContent.declined }</Button></TableCell>
                                <TableCell align="right"><Button variant="outlined" color="success" sx={{ color: "green" }}>{ strings.editorContent.approved }</Button></TableCell>
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

export default renderEmployeeVacationRequests;