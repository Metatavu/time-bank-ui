import { ChangeEvent, useContext, useState } from "react";
import { Collapse, FormControl, IconButton, InputLabel, MenuItem, Select, SelectChangeEvent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography, Button, Box, styled, tableCellClasses } from "@mui/material";
import useEditorContentStyles from "styles/editor-content/editor-content";
import theme from "theme/theme";
import myVacationRequests from "./myVacationMockData.json";
import DeleteIcon from "@mui/icons-material/Delete";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { CalendarPickerView } from "@mui/x-date-pickers";
import Holidays from "date-holidays";
import strings from "localization/strings";
import { FilterScopes } from "types";
import DateRangePicker from "../date-range-picker/date-range-picker";
import { Request } from "types/index";
import { VacationRequest, VacationType } from "generated/client";
import { useAppSelector } from "app/hooks";
import { selectPerson } from "features/person/person-slice";
import Api from "api/api";
import { selectAuth } from "features/auth/auth-slice";
import { ErrorContext } from "components/error-handler/error-handler";

/**
 * Renders vacation request table
 */
const renderVacationRequests = () => {
  const classes = useEditorContentStyles();
  const { person } = useAppSelector(selectPerson);
  const { accessToken } = useAppSelector(selectAuth);
  const [ dateFormat ] = useState("yyyy.MM.dd");
  const [ selectedVacationStartDate, setSelectedVacationStartDate ] = useState(new Date());
  const [ selectedVacationEndDate, setSelectedVacationEndDate ] = useState(new Date());
  const [ openRows, setOpenRows ] = useState<boolean[]>([]);
  const [ textContent, setTextContent ] = useState("");
  const [ vacationType, setVacationType ] = useState<VacationType | string>();
  const [ datePickerView ] = useState<CalendarPickerView>("day");
  const context = useContext(ErrorContext);
  const [ requests ] = useState<VacationRequest[]>([]);
  
  /**
  * Handle vacation type 
  * @param event
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
  * Handle vacation comment box content
  * @param event
  */
  const handleVacationCommentContent = (event: ChangeEvent<HTMLInputElement>) => {
    const contentValue = event.target.value;
    setTextContent(contentValue);
  };

  /**
  * Renders vacation comment box
  */
  const renderVacationCommentBox = () => (
    <TextField
      id="outlined-multiline-flexible"
      multiline
      maxRows={5}
      label={ strings.editorContent.leaveAComment }
      variant="outlined"
      value={ textContent }
      onChange={ handleVacationCommentContent }
    />
  );

  /**
   * Renders and calculates updated days spent for vacation
   */
  const renderUpdatedVacationDaysSpent = () => {
    // Define the date range to compare with holidays
    const holidaysFi = new Holidays("FI");
    const startDate = new Date(selectedVacationStartDate);
    const endDate = new Date(selectedVacationEndDate);
    let days = 0;

    // Iterate over each date in the date range and check if it is a holiday
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      if (!holidaysFi.isHoliday(d) && d.getDay() !== 0) {
        // eslint-disable-next-line no-plusplus
        days++;
      }
    }
    
    return (
      days
    );
  };

  /**
   * @param request 
  * Handle vacation apply button
  * Updates the vacation request
  */
  const updateRequest = async (request: any) => {
    const changedRequest: VacationRequest = {
      ...request,
      startDate: selectedVacationStartDate,
      endDate: selectedVacationEndDate,
      type: vacationType as VacationType,
      message: textContent,
      updatedAt: new Date(),
      days: renderUpdatedVacationDaysSpent()
    };
    if (!person) {
      return;
    }
    try {
      const vacationsApi = Api.getVacationRequestsApi(accessToken?.access_token);
      const updatedRequest = await vacationsApi.updateVacationRequest({
        vacationRequest: changedRequest,
        id: "0eaa5181-0d38-45a4-8e2d-9843aeb40935"
      });
      requests.push(updatedRequest);
    } catch (error) {
      context.setError(strings.errorHandling.fetchVacationDataFailed, error);
    }
  };

  /**
    * Renders vacation apply button
    */
  const renderVacationApplyButton = () => (
    <Button
      color="secondary"
      variant="contained"
      onClick={ updateRequest }
    >
      <Typography style={{
        fontWeight: 600,
        color: "white",
        fontSize: 10
      }}
      >
        { strings.generic.saveChanges }
      </Typography>
    </Button>
  );

  /**
   * Renders spent vacation days
   */
  const renderVacationDaysSpent = () => {
    // Define the date range to compare with holidays
    const holidaysFi = new Holidays("FI");
    const startDate = new Date(selectedVacationStartDate);
    const endDate = new Date(selectedVacationEndDate);
    let days = 0;

    // Iterate over each date in the date range and check if it is a holiday
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      if (!holidaysFi.isHoliday(d) && d.getDay() !== 0) {
        // eslint-disable-next-line no-plusplus
        days++;
      }
    }
    return (
      <Typography variant="h4" style={{ fontSize: 13 }}>
        { strings.editorContent.amountOfChosenVacationDays }
        {days}
      </Typography>
    );
  };

  /**
   * Method to handle vacation starting date change
   *
   * @param date selected date
   */
  const handleVacationStartDateChange = (date: Date | null) => {
    date && setSelectedVacationStartDate(date);
  };

  /**
   * Method to handle vacation ending date change
   *
   * @param date selected date
   */
  const handleVacationEndDateChange = (date: Date | null) => {
    date && setSelectedVacationEndDate(date);
  };

  /**
   * Method to delete vacation request
   */
  const deleteRequest = async () => {
    const id = "3ee2b492-e4c8-11ed-8b90-325096b39f47";
    if (!person) {
      return;
    }
    try {
      await Api.getVacationRequestsApi(accessToken?.access_token).deleteVacationRequest({
        id: id
      });
    } catch (error) {
      context.setError(strings.errorHandling.fetchVacationDataFailed, error);
    }
  };

  /**
   * Styles for table cells
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
    "& .approved": {
      color: "#45cf36"
    },
    
    // eslint-disable-next-line no-restricted-globals
    ...(status === "APPROVED" ? { "&.approved": {} } : { "&.pending": {} })
  }));

  return (
    <Box className={ classes.employeeVacationRequests }>
      <Typography variant="h2" padding={ theme.spacing(2) }>
        { strings.header.requests}
      </Typography>
      <TableContainer style={{ height: 300, width: "100%" }}>
        <Table aria-label="collapsible table" style={{ marginBottom: "1em" }}>
          <TableHead>
            <TableRow>
              <TableCell style={{ paddingLeft: "3em" }}>{ strings.header.vacationType }</TableCell>
              <TableCell>{ strings.header.employee }</TableCell>
              <TableCell>{ strings.header.days }</TableCell>
              <TableCell>{ strings.header.startDate }</TableCell>
              <TableCell>{ strings.header.endDate }</TableCell>
              <TableCell>{ strings.header.status }</TableCell>
              <TableCell/>
              <TableCell/>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.values(myVacationRequests).map((request: Request, index: number) => (
              <>
                <TableRow key={ request.id }>
                  <TableCell style={{ paddingLeft: "3em" }}>{ request.vacationType }</TableCell>
                  <TableCell>
                    { request.employee }
                  </TableCell>
                  <TableCell>{ request.days }</TableCell>
                  <TableCell>{ request.startDate }</TableCell>
                  <TableCell>{ request.endDate }</TableCell>
                  <StyledTableCell sx={{ "&.pending": { color: "#FF493C" }, "&.approved": { color: "#45cf36" } }} className={request.status === "APPROVED" ? "approved" : "pending"}>{ request.status }</StyledTableCell>
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
                      { openRows[index] ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/> }
                    </IconButton>
                  </TableCell>
                </TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
                  <Collapse in={ openRows[index] } timeout="auto" unmountOnExit>
                    <>
                      <TableRow>
                        <TableCell>
                          <Box className={ classes.datePickers }>
                            <DateRangePicker
                              scope={ FilterScopes.DATE }
                              dateFormat={ dateFormat }
                              selectedStartDate={ selectedVacationStartDate }
                              selectedEndDate={ selectedVacationEndDate }
                              datePickerView={ datePickerView }
                              minStartDate={ new Date() }
                              minEndDate={ selectedVacationStartDate }
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
                        </TableCell>
                        <TableCell>
                          { renderVacationType() }
                        </TableCell>
                        <TableCell>
                          { renderVacationDaysSpent() }
                          { renderVacationCommentBox() }
                          <Box display="flex" justifyContent="center">
                            { renderVacationApplyButton() }
                          </Box>
                        </TableCell>
                        <TableCell>
                          <IconButton
                            onClick={ deleteRequest }
                            aria-label="delete"
                            className={ classes.deleteButton }
                            size="large"
                          >
                            <DeleteIcon fontSize="medium"/>
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    </>
                  </Collapse>
                </TableCell>
              </>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default renderVacationRequests;