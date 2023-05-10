import React, { useState } from "react";
import { Collapse, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Box } from "@mui/material";
import useEditorContentStyles from "styles/editor-content/editor-content";
import theme from "theme/theme";
import myVacationRequests from "./myVacationMockData.json";
import DeleteIcon from "@mui/icons-material/Delete";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { CalendarPickerView } from "@mui/x-date-pickers";
import strings from "localization/strings";
import { FilterScopes } from "types";
import DateRangePicker from "../date-range-picker/date-range-picker";
import RenderVacationTypeSelector from "../vacation-apply-components/vacationTypeSelector";

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

interface Props {
  renderVacationDaysSpent: () => JSX.Element;
  renderVacationApplyButton: () => JSX.Element;
  renderVacationCommentBox: () => JSX.Element;
}

/**
 * Renders vacation request table
 */
const renderVacationRequests = ({
  renderVacationDaysSpent,
  renderVacationApplyButton,
  renderVacationCommentBox
}: Props) => {
  const classes = useEditorContentStyles();
  const [dateFormat] = useState<string>("yyyy.MM.dd");
  const [selectedVacationStartDate, setSelectedVacationStartDate] = useState<Date>(new Date());
  const [selectedVacationEndDate, setSelectedVacationEndDate] = useState<Date>(new Date());
  const [openRows, setOpenRows] = useState<boolean[]>([]);
  const [datePickerView] = useState<CalendarPickerView>("day");

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
        {strings.header.requests}
      </Typography>
      <TableContainer style={{ height: 300, width: "100%" }}>
        <Table aria-label="collapsible table" style={{ marginBottom: "1em" }}>
          <TableHead>
            <TableRow>
              <TableCell style={{ paddingLeft: "3em" }}>{strings.header.vacationType}</TableCell>
              <TableCell>{strings.header.employee}</TableCell>
              <TableCell>{strings.header.days}</TableCell>
              <TableCell>{strings.header.startDate}</TableCell>
              <TableCell>{strings.header.endDate}</TableCell>
              <TableCell>{strings.header.status}</TableCell>
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
                          <Box className={classes.datePickers}>
                            <DateRangePicker
                              scope={FilterScopes.DATE}
                              dateFormat={dateFormat}
                              selectedStartDate={selectedVacationStartDate}
                              selectedEndDate={selectedVacationEndDate}
                              datePickerView={datePickerView}
                              minStartDate={new Date()}
                              minEndDate={selectedVacationStartDate}
                              onStartDateChange={handleVacationStartDateChange}
                              onEndDateChange={handleVacationEndDateChange}
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
                          <RenderVacationTypeSelector/>
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