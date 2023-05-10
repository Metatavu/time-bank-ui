import { ChangeEvent, useContext, useState } from "react";
import { Collapse, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Box, styled, TextField, Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import useEditorContentStyles from "styles/editor-content/editor-content";
import theme from "theme/theme";
import myRequests from "./myVacationMockData";
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
import DeleteIcon from "@mui/icons-material/Delete";

/**
 * Renders vacation request table
 */
const RenderVacationRequests = () => {
  const classes = useEditorContentStyles();
  const { person } = useAppSelector(selectPerson);
  const { accessToken } = useAppSelector(selectAuth);
  const dateFormat = "yyyy.MM.dd";
  const [ datePickerView ] = useState<CalendarPickerView>("day");
  const [ selectedVacationStartDate, setSelectedVacationStartDate ] = useState(new Date());
  const [ selectedVacationEndDate, setSelectedVacationEndDate ] = useState(new Date());
  const [ openRows, setOpenRows ] = useState<boolean[]>([]);
  const [ textContent, setTextContent ] = useState("");
  const [ vacationType, setVacationType ] = useState<VacationType>(VacationType.VACATION);
  const context = useContext(ErrorContext);
  const [ requests, setRequests ] = useState<VacationRequest[]>([]);

  // TODO: initialize requests
  
  /**
  * Handle vacation type 
  * 
  * @param event
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
          { strings.editorContent.childSickness }
        </MenuItem>
      </Select>
    </FormControl>
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
    return days;
  };

  /**
   * Handle vacation comment box content
   * 
   * @param event
   */
  const handleVacationCommentContent = (event: ChangeEvent<HTMLInputElement>) => {
    const contentValue = event.target.value;
    setTextContent(contentValue);
  };

  /**
  * Renders vacation comment box
  */
  const renderVacationCommentBox = () => {
    return (
      <>
        <Typography variant="h4" style={{ fontSize: 13 }}>
          { strings.editorContent.amountOfChosenVacationDays }
          { renderVacationDaysSpent() }
        </Typography>
        <TextField
          id="outlined-multiline-flexible"
          multiline
          maxRows={5}
          label={ strings.editorContent.leaveAComment }
          variant="outlined"
          value={ textContent }
          onChange={ handleVacationCommentContent }
        />
      </>
    );
  };
  
  /**
   * Updates the vacation request
   * 
   * @param request 
   */
  const updateRequest = async (id: string) => {
    const requestToBeUpdated = myRequests.filter(request => request.id === id);

    // TODO: WIll be resolved when mock data is typed as vacation request
    // const changedRequest: VacationRequest = {
    const changedRequest: any = {
      ...requestToBeUpdated,
      startDate: selectedVacationStartDate,
      endDate: selectedVacationEndDate,
      type: vacationType,
      message: textContent,
      updatedAt: new Date(),
      days: 2
    };
    if (!person) return;

    try {
      const vacationsApi = Api.getVacationRequestsApi(accessToken?.access_token);
      const updatedRequest = await vacationsApi.updateVacationRequest({
        id: id,
        vacationRequest: changedRequest
      });
      setRequests(requests.concat(updatedRequest));
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
      onClick={() => updateRequest }
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
  const deleteRequest = async (id: string) => {
    // eslint-disable-next-line no-console
    console.log("This is to be deleted: ");
    // eslint-disable-next-line no-console
    console.log(id);
    if (!person) return;

    requests.find(request => request.id === id);
    try {
      await Api.getVacationRequestsApi(accessToken?.access_token).deleteVacationRequest({
        id: id
      });
    } catch (error) {
      context.setError(strings.errorHandling.fetchVacationDataFailed, error);
    }
    setRequests(requests.filter(request => request.id !== id));
  };

  /**
   * Styles for table cells
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
              <TableCell>{ strings.header.days }</TableCell>
              <TableCell>{ strings.header.startDate }</TableCell>
              <TableCell>{ strings.header.endDate }</TableCell>
              <TableCell>{ strings.header.status }</TableCell>
              <TableCell/>
              <TableCell/>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.values(myRequests).map((myRequest: Request, index: number) => (
              <>
                <TableRow key={ myRequest.id }>
                  <TableCell style={{ paddingLeft: "3em" }}>{ myRequest.vacationType }</TableCell>
                  <TableCell>{ myRequest.days }</TableCell>
                  <TableCell>{ myRequest.startDate }</TableCell>
                  <TableCell>{ myRequest.endDate }</TableCell>
                  <StyledTableCell
                    sx={{ "&.pending": { color: "#FF493C" }, "&.approved": { color: "#45cf36" } }}
                    className={myRequest.status === "APPROVED" ? "approved" : "pending"}
                  >
                    { myRequest.status }
                  </StyledTableCell>
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
                        { renderVacationCommentBox() }
                        <Box display="flex" justifyContent="center">
                          { renderVacationApplyButton() }
                        </Box>
                      </TableCell>
                      <TableCell>
                        <IconButton
                          onClick={() => deleteRequest(myRequest.id)}
                          aria-label="delete"
                          className={ classes.deleteButton }
                          size="large"
                        >
                          <DeleteIcon fontSize="medium"/>
                        </IconButton>
                      </TableCell>
                    </TableRow>
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

export default RenderVacationRequests;