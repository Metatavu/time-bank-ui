import { useContext, useEffect, useState } from "react";
import { Collapse, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Box, styled } from "@mui/material";
import useEditorContentStyles from "styles/editor-content/editor-content";
import theme from "theme/theme";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import strings from "localization/strings";
import { RequestType } from "types";
import { VacationRequest } from "generated/client";
import { useAppSelector } from "app/hooks";
import { selectPerson } from "features/person/person-slice";
import Api from "api/api";
import { selectAuth } from "features/auth/auth-slice";
import { ErrorContext } from "components/error-handler/error-handler";
import DeleteIcon from "@mui/icons-material/Delete";
import VacationRequestForm from "./vacationRequestForm";

/**
 * Renders vacation request table
 */
const RenderVacationRequests = () => {
  const classes = useEditorContentStyles();
  const { person } = useAppSelector(selectPerson);
  const { accessToken } = useAppSelector(selectAuth);
  const [ openRows, setOpenRows ] = useState<boolean[]>([]);
  const context = useContext(ErrorContext);
  const [ requests, setRequests ] = useState<VacationRequest[]>([]);
  const [ requestObjects, setRequestObject ] = useState<VacationRequest[]>([]);

  /**
   * Initializes all vacation requests
   */
  const initializeRequests = async () => {
    if (!person) return;

    try {
      const vacationsApi = Api.getVacationRequestsApi(accessToken?.access_token);
      const vacations = await vacationsApi.listVacationRequests({ personId: person.id });
      setRequests(vacations);
    } catch (error) {
      context.setError(strings.errorHandling.fetchVacationDataFailed, error);
    }
  };

  useEffect(() => {
    if (!accessToken) {
      return;
    }
    initializeRequests();
  }, [person]);
  
  /**
   * Returns the requestObject from vacation Request Form
   * @param requestObject
   */
  const getDefaultRequestObject = (requestObject: VacationRequest) => {
    setRequestObject([]);
    console.log(requestObject);
    setRequestObject(requestObjects.concat(requestObject));
  };

  /**
  * Handle vacation apply button
  * Sends vacation request to database
  */
  const applyForVacation = async (requestObject: VacationRequest) => {
    if (!person) return;

    try {
      const applyApi = Api.getVacationRequestsApi(accessToken?.access_token);

      const createdRequest = await applyApi.createVacationRequest({
        vacationRequest: requestObject
      });
      
      setRequests(requests.concat(createdRequest));
    } catch (error) {
      context.setError(strings.errorHandling.fetchVacationDataFailed, error);
    }
  };

  /**
   * Updates the vacation request
   * 
   * @param request 
   */
  const updateRequest = async (id: string) => {
    const requestToBeUpdated = requests.find(request => request.id === id);
    console.log(id);
    
    const requestObject = requestObjects[0];
    console.log(requestObjects);
    
    if (!person) return;

    try {
      const updateApi = Api.getVacationRequestsApi(accessToken?.access_token);
      const updatedRequest = await updateApi.updateVacationRequest({
        id: id,
        vacationRequest: {
          ...requestToBeUpdated as VacationRequest,
          startDate: requestObject.startDate,
          endDate: requestObject.endDate,
          type: requestObject.type,
          message: requestObject.message,
          updatedAt: requestObject.updatedAt,
          days: requestObject.days
        }
      });
      const update = requests.map((request: VacationRequest) => (request.id !== id ? request : updatedRequest));
      
      setRequests(update);
      setRequestObject([]);
      console.log(update);
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
          onClick={() => applyForVacation}
          requestType={RequestType.APPLY}
          createRequest={applyForVacation}
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
                            createRequest={getDefaultRequestObject}
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