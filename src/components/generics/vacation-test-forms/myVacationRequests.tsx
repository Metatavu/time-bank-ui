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
import EditIcon from "@mui/icons-material/Edit";
import VacationRequestForm from "./vacationRequestForm";
import DeleteDialog from "../dialogs/delete-dialog";

/**
 * Renders vacation request table
 */
const RenderVacationRequests = () => {
  const classes = useEditorContentStyles();
  const { person } = useAppSelector(selectPerson);
  const { accessToken } = useAppSelector(selectAuth);
  const [ openEdit, setOpenEdit ] = useState<boolean[]>([]);
  const [ openDetails, setOpenDetails ] = useState<boolean[]>([]);
  const [ openDeleteDialog, setOpenDeleteDialog ] = useState<boolean>(false);
  const context = useContext(ErrorContext);
  const [ requests, setRequests ] = useState<VacationRequest[]>([]);
  let updatedObject: VacationRequest = {} as VacationRequest;

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
   * Sets the requestObject from vacation Request Form
   * @param requestObject
   */
  const getDefaultRequestObject = (requestObject: VacationRequest) => {
    if (!person) return;
    updatedObject = requestObject;

    return updatedObject;
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
  const updateRequest = async (id: string, index: number) => {
    const requestToBeUpdated = requests.find(request => request.id === id);
    const requestObject = updatedObject;
    
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
    } catch (error) {
      context.setError(strings.errorHandling.fetchVacationDataFailed, error);
    }
    const newOpenRows = [...openEdit];
    newOpenRows[index] = !newOpenRows[index];
    setOpenEdit(newOpenRows);
  };
  
  /**
   * Method to delete vacation request
   */
  const deleteRequest = async (id: string, index: number) => {
    try {
      await Api.getVacationRequestsApi(accessToken?.access_token).deleteVacationRequest({
        id: id
      });
    } catch (error) {
      context.setError(strings.errorHandling.fetchVacationDataFailed, error);
    }
    setRequests(requests.filter(request => request.id !== id));

    const newOpenRows = [...openEdit];
    newOpenRows[index] = !newOpenRows[index];
    setOpenEdit(newOpenRows);
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
        // Handle any other status if necessary
        break;
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

  /**
   * Handles delete dialog open
   */
  const handleClickOpen = () => {
    setOpenDeleteDialog(true);
  };

  /**
   * Handles delete dialog close
   */
  const handleClose = (value: string) => {
    console.log(value);
    
    setOpenDeleteDialog(false);
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
          { strings.vacationRequests.applyForVacation }
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
        <TableContainer style={{ marginBottom: "10px", width: "100%" }}>
          <Table aria-label="collapsible table" style={{ marginBottom: "1em" }}>
            <TableHead>
              <TableRow>
                <TableCell style={{ paddingLeft: "3em", width: "20%" }}>{ strings.header.vacationType }</TableCell>
                <TableCell style={{ width: "20%" }}>{ strings.header.startDate }</TableCell>
                <TableCell style={{ width: "20%" }}>{ strings.header.endDate }</TableCell>
                <TableCell style={{ width: "10%" }}>{ strings.header.days }</TableCell>
                <TableCell style={{ width: "10%" }}>{ strings.header.status }</TableCell>
                <TableCell style={{ width: "10%" }}/>
              </TableRow>
            </TableHead>
            <TableBody>
              {requests.map((request: VacationRequest, index: number) => (
                <>
                  <TableRow key={ request.id }>
                    <TableCell style={{ paddingLeft: "3em" }}>{ handleRequestType(request.type) }</TableCell>
                    <TableCell>{ request.startDate.toDateString() }</TableCell>
                    <TableCell>{ request.endDate.toDateString() }</TableCell>
                    <TableCell>{ request.days }</TableCell>
                    <StyledTableCell
                      sx={{ "&.pending": { color: "#FF493C" }, "&.approved": { color: "#45cf36" } }}
                      className={request.hrManagerStatus === "APPROVED" ? "approved" : "pending"}
                    >
                      { handleRequestStatus(request.hrManagerStatus) }
                    </StyledTableCell>
                    <TableCell>
                      <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => {
                          const newOpenRows = [...openDetails];
                          newOpenRows[index] = !newOpenRows[index];
                          setOpenDetails(newOpenRows);
                        }}
                      >
                        { openDetails[index] ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/> }
                      </IconButton>
                      <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => {
                          const newOpenRows = [...openEdit];
                          newOpenRows[index] = !newOpenRows[index];
                          setOpenEdit(newOpenRows);
                        }}
                      >
                        { openEdit[index] ? <EditIcon color="success"/> : <EditIcon/> }
                      </IconButton>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell style={{ padding: 0 }} colSpan={6} >
                      <Collapse in={ openDetails[index] } timeout="auto" unmountOnExit>
                        <Box sx={{ width: "100%" }}>
                          <Table size="small" aria-label="purchases">
                            <TableHead>
                              <TableRow>
                                <TableCell style={{ paddingLeft: "3em", width: "20%" }}>{ strings.vacationRequests.message }</TableCell>
                                <TableCell style={{ width: "20%" }}>{ strings.vacationRequests.created }</TableCell>
                                <TableCell style={{ width: "20%" }}>{ strings.vacationRequests.updated }</TableCell>
                                <TableCell style={{ width: "10%" }}>Päivittänyt:</TableCell>
                                <TableCell style={{ width: "10%" }}>{ strings.vacationRequests.projectManager }</TableCell>
                                <TableCell style={{ width: "10%" }}>{ strings.vacationRequests.humanResourcesManager }</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              <TableRow>
                                <TableCell style={{ paddingLeft: "3em", border: 0 }}>{ request.message }</TableCell>
                                <TableCell style={{ border: 0 }}>{ request.createdAt.toDateString() }</TableCell>
                                <TableCell style={{ border: 0 }}>{ request.updatedAt.toDateString() }</TableCell>
                                <TableCell style={{ border: 0 }}>Henkilö</TableCell>
                                <TableCell style={{ border: 0 }}>{ request.projectManagerStatus }</TableCell>
                                <TableCell style={{ border: 0 }}>{ request.hrManagerStatus }</TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                      <Collapse in={ openEdit[index] } timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 0, width: "100%" }}>
                          <Table size="small" aria-label="purchases">
                            <TableHead/>
                            <TableBody>
                              <TableRow>
                                <TableCell style={{ border: 0 }}>
                                  <VacationRequestForm
                                    buttonLabel={ strings.generic.saveChanges }
                                    onClick={() => updateRequest(request.id as string, index)}
                                    requestType={RequestType.UPDATE}
                                    createRequest={ getDefaultRequestObject }
                                  />
                                </TableCell>
                                <TableCell style={{ border: 0 }}>
                                  <IconButton
                                    onClick={ handleClickOpen }
                                    aria-label="delete"
                                    className={ classes.deleteButton }
                                    size="large"
                                    style={{ marginRight: "20px" }}
                                  >
                                    <DeleteIcon fontSize="medium"/>
                                  </IconButton>
                                </TableCell>
                                <DeleteDialog
                                  open={ openDeleteDialog }
                                  // eslint-disable-next-line no-sequences
                                  onClose={(value: string) => (handleClose(value), value === "2" ? deleteRequest(request.id as string, index) : handleClose("1"))}
                                />
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

export default RenderVacationRequests;