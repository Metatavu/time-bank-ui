import React, { useState } from "react";
import { Collapse, FormControl, IconButton, InputLabel, MenuItem, Select, SelectChangeEvent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography, Button, Box } from "@mui/material";
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
 * Renders vacation request table
 */
const renderVacationRequests = () => {
  const classes = useEditorContentStyles();
  const [dateFormat] = useState<string>("yyyy.MM.dd");
  const [selectedVacationStartDate, setSelectedVacationStartDate] = useState<Date>(new Date());
  const [selectedVacationEndDate, setSelectedVacationEndDate] = useState<Date>(new Date());
  const [openRows, setOpenRows] = useState<boolean[]>([]);
  const [newTextContent, setNewTextContent] = useState("");
  const [newVacationType, setNewVacationType] = useState("");
  const [datePickerView] = useState<CalendarPickerView>("day");
  const [textContent] = useState("");
  const [vacationType] = useState("");

  /**
  * Handle vacation type 
  */
  const handleVacationTypeChange = (event: SelectChangeEvent) => {
    const contentValue = event.target.value;
    setNewVacationType(contentValue as string);
  };

  /**
  * Renders the vacation type selection
  */
  const renderVacationType = () => (
    <FormControl
      variant="standard"
      sx={{
        m: 1, minWidth: 165, marginBottom: 4
      }}
    >
      <InputLabel>{ strings.editorContent.vacationType }</InputLabel>
      <Select
        value={newVacationType}
        onChange={handleVacationTypeChange}
        label={ strings.editorContent.vacationType }
      >
        <MenuItem value="Paid leave">{ strings.editorContent.paidLeave }</MenuItem>
        <MenuItem value="Maternity leave">{ strings.editorContent.maternityLeave }</MenuItem>
        <MenuItem value="Parental leave">{ strings.editorContent.parentalLeave }</MenuItem>
        <MenuItem value="Unpaid leave">{ strings.editorContent.unpaidLeave }</MenuItem>
        <MenuItem value="Surplus balance">{ strings.editorContent.surplusBalance }</MenuItem>
      </Select>
    </FormControl>
  );

  /**
  * Handle vacation comment box content
  */
  const handleVacationCommentContent = (event: React.ChangeEvent<HTMLInputElement>) => {
    const contentValue = event.target.value;
    setNewTextContent(contentValue);
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
      value={newTextContent}
      onChange={handleVacationCommentContent}
    />
  );

  /**
* Handle vacation apply button
*/
  const handleVacationApplyButton = () => {
    return (
      // eslint-disable-next-line no-console
      console.log(`this is START DATE ${selectedVacationStartDate} and this is END DATE${selectedVacationEndDate} and this is TEXT CONTENT ${textContent}. Vacation type ${vacationType}`)
    );
  };

  /**
    * Renders vacation apply button
    */
  const renderVacationApplyButton = () => (
    <Button
      color="secondary"
      variant="contained"
      onClick={handleVacationApplyButton}
    >
      <Typography style={{
        fontWeight: 600, color: "white", fontSize: 10
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

  return (
    <Box className={classes.employeeVacationRequests}>
      <Typography variant="h2" padding={theme.spacing(2)}>
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
                <TableRow key={request.id}>
                  <TableCell style={{ paddingLeft: "3em" }}>{request.vacationType}</TableCell>
                  <TableCell>
                    {request.employee}
                    {" "}
                  </TableCell>
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
                      {openRows[index] ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}
                    </IconButton>
                  </TableCell>
                </TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
                  <Collapse in={openRows[index]} timeout="auto" unmountOnExit>
                    <>
                      <TableRow>
                        <TableCell>
                          <Box className={ classes.datePickers }>
                            <DateRangePicker
                              scope={FilterScopes.DATE}
                              dateFormat={dateFormat}
                              selectedStartDate={selectedVacationStartDate}
                              selectedEndDate={selectedVacationEndDate}
                              datePickerView={datePickerView}
                              minStartDate={ new Date() }
                              minEndDate={ selectedVacationStartDate }
                              onStartDateChange={handleVacationStartDateChange}
                              onEndDateChange={handleVacationEndDateChange}
                              // eslint-disable-next-line react/jsx-no-bind, func-names
                              onStartWeekChange={function (): void {
                                throw new Error("Function not implemented.");
                              }}
                              // eslint-disable-next-line react/jsx-no-bind, func-names
                              onEndWeekChange={function (): void {
                                throw new Error("Function not implemented.");
                              }}
                            />
                          </Box>
                        </TableCell>
                        <TableCell>
                          {renderVacationType()}
                        </TableCell>
                        <TableCell>
                          {renderVacationDaysSpent()}
                          {renderVacationCommentBox()}
                          <Box display="flex" justifyContent="center">
                            {renderVacationApplyButton()}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <IconButton
                            // onClick={ handleStartDateOnlyClick }
                            aria-label="delete"
                            className={classes.deleteButton}
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