/* eslint-disable */
import React, { useState } from 'react';
import { Collapse, FormControl, IconButton, InputLabel, MenuItem, Select, SelectChangeEvent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography, Button, Box } from "@mui/material";
import useEditorContentStyles from "styles/editor-content/editor-content";
import theme from "theme/theme";
import myVacationRequests from './myVacationMockData.json';
import DeleteIcon from '@mui/icons-material/Delete';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { CalendarPickerView } from '@mui/x-date-pickers';
import { FilterScopes } from 'types';
import Holidays from "date-holidays";
import DateFilterPicker from '../date-range-picker/test-date-range-picker';

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
  const [dateFormat] = React.useState<string | undefined>("yyyy.MM.dd");
  const [selectedVacationStartDate, setSelectedVacationStartDate] = useState<any>(new Date());
  const [selectedVacationEndDate, setSelectedVacationEndDate] = useState<any>(new Date())
  const [openRows, setOpenRows] = React.useState<boolean[]>([]);
  const [newTextContent, setNewTextContent] = React.useState("");
  const [newVacationType, setNewVacationType] = React.useState("");
  const [datePickerView] = React.useState<CalendarPickerView>("day");
  const [textContent] = React.useState("");
  const [vacationType] = React.useState("");

  /**
  * Handle vacation type 
  */
  const handleVacationTypeChange = (event: SelectChangeEvent) => {
    const contentValue = event.target.value;
    setNewVacationType(contentValue as string)
  }

  /**
  * Renders the vacation type selection
  */
  const renderVacationType = () => (
    <FormControl variant="standard" sx={{ m: 1, minWidth: 165, marginBottom: 4 }}>
      <InputLabel>Vacation type</InputLabel>
      <Select
        value={newVacationType}
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
  * Handle vacation comment box content
  */
  const handleVacationCommentContent = (event: React.ChangeEvent<HTMLInputElement>) => {
    const contentValue = event.target.value;
    setNewTextContent(contentValue)
  }

  /**
  * Renders vacation comment box
  */
  const renderVacationCommentBox = () => (
    <TextField
      id="outlined-multiline-flexible"
      multiline maxRows={5}
      label="Leave a comment"
      variant='outlined'
      value={newTextContent}
      onChange={handleVacationCommentContent}
    />
  );

  /**
* Handle vacation apply button
*/
  const handleVacationApplyButton = () => {
    return (
      console.log(`this is START DATE ${selectedVacationStartDate} and this is END DATE${selectedVacationEndDate} and this is TEXT CONTENT ${textContent}. Vacation type ${vacationType}`)
    )
  }

  /**
    * Renders vacation apply button
    */
  const renderVacationApplyButton = () => (
    <Button
      color="secondary"
      variant="contained"
      onClick={handleVacationApplyButton}
    >
      <Typography style={{ fontWeight: 600, color: "white", fontSize: 10 }}>
        {(`Save Changes`)}
      </Typography>
    </Button>
  );

  const renderVacationDaysSpend = () => {
    // Define the date range to compare with holidays
    const holidaysFi = new Holidays('FI')
    const startDate = new Date(selectedVacationStartDate)
    const endDate = new Date(selectedVacationEndDate)
    let days = 0

    // Iterate over each date in the date range and check if it is a holiday
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      if (!holidaysFi.isHoliday(d) && d.getDay() != 0) {
        days++
      }
    }
    return (
      <Typography variant="h4" style={{ fontSize: 13 }}>
        {(`Amount of vacation days spend ${days}`)}
      </Typography>
    )
  };

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

  return (
    <Box className={classes.employeeVacationRequests}>
      <Typography variant="h2" padding={theme.spacing(2)}>
        {`Requests`}
      </Typography>
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
                      {openRows[index] ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                  </TableCell>
                </TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
                <Collapse in={openRows[index]} timeout="auto" unmountOnExit>
                    <React.Fragment>
                      <TableRow>
                        <TableCell>
                        <DateFilterPicker 
                          dateFormat={dateFormat}
                          selectedFilteredStartDate={selectedVacationStartDate}
                          selectedFilteredEndDate={selectedVacationEndDate}
                          datePickerView={datePickerView}
                          onStartDateChange={handleVacationStartDateChange}
                          onEndDateChange={handleVacationEndDateChange} 
                          onStartWeekChange={function (weekNumber: number): void {
                            throw new Error("Function not implemented.");
                          }} 
                          onEndWeekChange={function (weekNumber: number): void {
                            throw new Error("Function not implemented.");
                          }}        
                      />
                        </TableCell>
                        <TableCell>
                          {renderVacationType()}
                        </TableCell>
                        <TableCell>
                          {renderVacationDaysSpend()}
                          {renderVacationCommentBox()}
                          <Box display="flex" justifyContent="center">
                            {renderVacationApplyButton()}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <IconButton
                            //onClick={ handleStartDateOnlyClick }
                            aria-label="delete"
                            className={classes.deleteButton}
                            size="large"
                          >
                            <DeleteIcon fontSize="medium" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                      </React.Fragment>
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
