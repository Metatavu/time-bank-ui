import { useContext, useEffect, useState } from "react";
import { Collapse, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Box, styled } from "@mui/material";
import useEditorContentStyles from "styles/editor-content/editor-content";
import theme from "theme/theme";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import strings from "localization/strings";
import { RequestType } from "types";
import { VacationRequest, VacationRequestStatus, VacationType } from "generated/client";
import { useAppSelector } from "app/hooks";
import { selectPerson } from "features/person/person-slice";
import Api from "api/api";
import { selectAuth } from "features/auth/auth-slice";
import { ErrorContext } from "components/error-handler/error-handler";
import DeleteIcon from "@mui/icons-material/Delete";
import VacationRequestForm from "./vacationRequestForm";
import Holidays from "date-holidays";

/**
 * Renders vacation request table
 */
const RenderVacationRequests = () => {
  const classes = useEditorContentStyles();
  const { person } = useAppSelector(selectPerson);
  const { accessToken } = useAppSelector(selectAuth);
  const [ selectedVacationStartDate ] = useState(new Date());
  const [ selectedVacationEndDate ] = useState(new Date());
  const [ openRows, setOpenRows ] = useState<boolean[]>([]);
  const [ textContent ] = useState("");
  const [ vacationType ] = useState<VacationType>(VacationType.VACATION);
  const context = useContext(ErrorContext);
  const [ requests, setRequests ] = useState<VacationRequest[]>([]);

  console.log("IN VACATION REQUESTS");
  
  /**
   * Initializes all vacation requests
   */
  const initializeRequests = async () => {
    console.log("Person not here");
    if (!person) return;
    console.log("Person here");

    try {
      const vacationsApi = Api.getVacationRequestsApi(accessToken?.access_token);
      const vacations = await vacationsApi.listVacationRequests({ personId: person.id });
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
    // eslint-disable-next-line no-console
    console.log(requests);
  }, [person]);
  
  /**
   * Renders spent vacation days
   */
  const renderVacationDaysSpent = () => {
    // Define the date range to compare with holidays
    const holidaysFi = new Holidays("FI");
    const startDate = new Date(selectedVacationStartDate);
    const endDate = new Date(selectedVacationEndDate);
    let day = 0;

    // Iterate over each date in the date range and check if it is a holiday
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      if (!holidaysFi.isHoliday(d) && d.getDay() !== 0) {
        // eslint-disable-next-line no-plusplus
        day++;
      }
    }
    return day;
  };
  
  /**
  * Handle vacation apply button
  * Sends vacation request to database
  */
  const applyForVacation = async () => {
    const newRequest: VacationRequest = {
      person: person?.id as number,
      startDate: selectedVacationStartDate,
      endDate: selectedVacationEndDate,
      type: vacationType,
      message: textContent,
      createdAt: new Date(),
      updatedAt: new Date(),
      days: renderVacationDaysSpent(),
      projectManagerStatus: VacationRequestStatus.PENDING,
      hrManagerStatus: VacationRequestStatus.PENDING
    };
    if (!person) return;

    try {
      const vacationsApi = Api.getVacationRequestsApi(accessToken?.access_token);

      const createdRequest = await vacationsApi.createVacationRequest({
        vacationRequest: newRequest
      });
      setRequests(requests.concat(createdRequest));
    } catch (error) {
      context.setError(strings.errorHandling.fetchVacationDataFailed, error);
    }
  };
  console.log(requests);

  /**
   * Updates the vacation request
   * 
   * @param request 
   */
  const updateRequest = async (id: string) => {
    const requestToBeUpdated = requests.find(request => request.id === id);

    const changedRequest: any = {
      ...requestToBeUpdated,
      startDate: selectedVacationStartDate,
      endDate: selectedVacationEndDate,
      type: vacationType,
      message: textContent,
      updatedAt: new Date(),
      days: renderVacationDaysSpent()
    };
    if (!person) return;

    try {
      const vacationsApi = Api.getVacationRequestsApi(accessToken?.access_token);
      const updatedRequest = await vacationsApi.updateVacationRequest({
        id: id,
        vacationRequest: changedRequest
      });
      const update = requests.map((request: VacationRequest) => {
        if (request.id === id) {
          return updatedRequest;
        }
        return request;
      });
      setRequests(update);
    } catch (error) {
      context.setError(strings.errorHandling.fetchVacationDataFailed, error);
    }
  };

  /**
   * Method to delete vacation request
   */
  const deleteRequest = async (id: string) => {
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
    <Box>
      <Box className={ classes.employeeVacationRequests }>
        <Typography variant="h2" padding={ theme.spacing(2) }>
          { strings.editorContent.applyForVacation }
        </Typography>
        <VacationRequestForm
          buttonLabel={ strings.generic.apply }
          onClick={() => applyForVacation()}
          requestType={RequestType.APPLY}
        />
      </Box>
      <Box className={ classes.employeeVacationRequests }>
        <Typography variant="h2" padding={ theme.spacing(2) }>
          { strings.header.requests }
        </Typography>
        <TableContainer style={{ height: 700, width: "100%" }}>
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
              {requests.map((request: VacationRequest, index: number) => (
                <>
                  <TableRow key={ request.id }>
                    <TableCell style={{ paddingLeft: "3em" }}>{ request.type }</TableCell>
                    <TableCell>{ request.days }</TableCell>
                    <TableCell>{ request.startDate.toDateString() }</TableCell>
                    <TableCell>{ request.endDate.toDateString() }</TableCell>
                    <StyledTableCell
                      sx={{ "&.pending": { color: "#FF493C" }, "&.approved": { color: "#45cf36" } }}
                      className={request.hrManagerStatus === "APPROVED" ? "approved" : "pending"}
                    >
                      { request.hrManagerStatus }
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
                          <VacationRequestForm
                            buttonLabel={ strings.generic.saveChanges }
                            onClick={() => updateRequest(request.id as string)}
                            requestType={RequestType.UPDATE}
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton
                            onClick={() => deleteRequest(request.id as string)}
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
    </Box>
  );
};

export default RenderVacationRequests;