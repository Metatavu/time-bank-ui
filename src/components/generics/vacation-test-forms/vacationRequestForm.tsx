import { CalendarPickerView } from "@mui/x-date-pickers";
import { Box, Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField, Typography } from "@mui/material";
import { VacationRequestStatus, VacationType } from "generated/client";
import strings from "localization/strings";
import { ChangeEvent, useState } from "react";
import { FilterScopes, RequestType } from "types";
import useEditorContentStyles from "styles/editor-content/editor-content";
import Holidays from "date-holidays";
import DateRangePicker from "components/generics/date-range-picker/date-range-picker";
import { useAppSelector } from "app/hooks";
import { selectPerson } from "features/person/person-slice";
// import { createRequest } from "features/vacation/vacation-slice";

interface VacationRequestFormProps {
  onClick: (id?:string) => void;
  buttonLabel: string;
  requestType: RequestType;
  createRequest: any;
}

/**
* Form component for vacation requests
* @param param0 
*/
const VacationRequestForm = ({ onClick, buttonLabel, requestType, createRequest }: VacationRequestFormProps) => {
  const classes = useEditorContentStyles();
  const { person } = useAppSelector(selectPerson);
  const dateFormat = "yyyy.MM.dd";
  const [ datePickerView ] = useState<CalendarPickerView>("day");
  const [ selectedVacationStartDate, setSelectedVacationStartDate ] = useState(new Date());
  const [ selectedVacationEndDate, setSelectedVacationEndDate ] = useState(new Date());
  const [ vacationType, setVacationType ] = useState<VacationType>(VacationType.VACATION);
  const [ textContent, setTextContent ] = useState("");

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
    let day = 0;

    // Iterate over each date in the date range and check if it is a holiday
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      if (!holidaysFi.isHoliday(d) && d.getDay() !== 0) {
        // eslint-disable-next-line no-plusplus
        day++;
      }
      // setDays(day);
    }
    return day;
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
   * Creates a request object
   */
  const addRequest = () => {
    console.log("loman lisäys");
    
    createRequest({
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
    });
    console.log(selectedVacationStartDate);
  };
  
  /**
   * Renders vacation apply button
   */
  const renderVacationApplyButton = (id: string | undefined) => (
    <Button
      color="secondary"
      variant="contained"
      // If being updated need to pass in id
      // eslint-disable-next-line no-sequences
      onClick={() => (addRequest(), requestType === RequestType.UPDATE ? onClick(id) : onClick()) }
    >
      <Typography style={{
        fontWeight: 600,
        color: "white",
        fontSize: 10
      }}
      >
        { buttonLabel }
      </Typography>
    </Button>
  );

  return (
    <>
      <FormControl>
        <Box display="flex" alignItems="center" marginRight="6em">
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
          <Box marginLeft="3em">
            { renderVacationType() }
          </Box>
          <Box marginLeft="3em">
            { renderVacationCommentBox() }
            <Box display="flex" justifyContent="center" marginTop="1em">
              { renderVacationApplyButton(undefined) }
            </Box>
          </Box>
        </Box>
      </FormControl>
    </>
  );
};

export default VacationRequestForm;