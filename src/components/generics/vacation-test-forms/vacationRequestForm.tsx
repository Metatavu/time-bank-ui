import { CalendarPickerView } from "@mui/x-date-pickers";
import { Box, Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField, Typography } from "@mui/material";
import { VacationType } from "generated/client";
import strings from "localization/strings";
import { ChangeEvent, useEffect, useState } from "react";
import { FilterScopes, VacationData } from "types";
import useEditorContentStyles from "styles/editor-content/editor-content";
import Holidays from "date-holidays";
import DateRangePicker from "components/generics/date-range-picker/date-range-picker";

interface VacationRequestFormProps {
  onClick: () => void;
  buttonLabel: string;
  vacationData: VacationData;
  setVacationData: (vacationData: VacationData) => void;
}

/**
* Form component for vacation requests
* @param param0 
*/
const VacationRequestForm = ({
  onClick,
  buttonLabel,
  vacationData,
  setVacationData
}: VacationRequestFormProps) => {
  const classes = useEditorContentStyles();
  const dateFormat = "yyyy.MM.dd";
  const [ datePickerView ] = useState<CalendarPickerView>("day");

  /**
 * handle DateRangePicker chances
 * 
 * @param date
 * @param isStart
 */
  const handleVacationDateChange = (date: Date | null, isStart: boolean) => {
    if (!date) return;
    if (isStart) {
      const newRequest: VacationData = { ...vacationData, startDate: date };
      setVacationData(newRequest);
    } else {
      const newRequest: VacationData = { ...vacationData, endDate: date };
      setVacationData(newRequest);
    }
  };

  /**
 * Handle message textfield chance
 * 
 * @param event
 */
  const handleVacationMessageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newRequest: VacationData = { ...vacationData, message: event.target.value };
    setVacationData(newRequest);
  };

  /**
   * Handle vacation type 
   *  
   * @param event
   */
  const handleVacationTypeChange = (event: SelectChangeEvent) => {
    const newRequest: VacationData = { ...vacationData, type: event.target.value as VacationType };
    setVacationData(newRequest);
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
      <InputLabel>{ strings.vacationRequests.vacationType }</InputLabel>
      <Select
        name="type"
        value={ vacationData.type }
        onChange={ handleVacationTypeChange }
        label={ strings.vacationRequests.vacationType }
      >
        <MenuItem value={ VacationType.VACATION }>
          { strings.vacationRequests.vacation }
        </MenuItem>
        <MenuItem value={ VacationType.UNPAID_TIME_OFF}>
          { strings.vacationRequests.unpaidTimeOff }
        </MenuItem>
        <MenuItem value={ VacationType.SICKNESS}>
          { strings.vacationRequests.sickness }
        </MenuItem>
        <MenuItem value={ VacationType.PERSONAL_DAYS }>
          { strings.vacationRequests.personalDays }
        </MenuItem>
        <MenuItem value={ VacationType.MATERNITY_PATERNITY }>
          { strings.vacationRequests.maternityPaternityLeave }
        </MenuItem>
        <MenuItem value={ VacationType.CHILD_SICKNESS }>
          { strings.vacationRequests.childSickness }
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
    const startDate = new Date(vacationData.startDate);
    const endDate = new Date(vacationData.endDate);
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
   * Renders vacation comment box
   */
  const renderVacationCommentBox = () => {
    return (
      <>
        <Typography variant="h4" style={{ fontSize: 13, marginBottom: "1em" }}>
          { strings.vacationRequests.amountOfChosenVacationDays }
          { renderVacationDaysSpent() }
        </Typography>
        <TextField
          id="outlined-multiline-flexible"
          multiline
          maxRows={5}
          label={ strings.vacationRequests.leaveAComment }
          variant="outlined"
          value={ vacationData.message }
          onChange={ handleVacationMessageChange }
          name="message"
        />
      </>
    );
  };

  useEffect(() => {
    const newRequest: VacationData = { ...vacationData, days: renderVacationDaysSpent() };
    setVacationData(newRequest);
  }, [vacationData.startDate, vacationData.endDate]);
  
  /**
   * Renders vacation apply button
   */
  const renderVacationApplyButton = () => (
    <Button
      color="secondary"
      variant="contained"
      onClick={() => (onClick())}
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
              selectedStartDate={ vacationData.startDate }
              selectedEndDate={ vacationData.endDate }
              datePickerView={ datePickerView }
              minStartDate={ new Date() }
              minEndDate={ vacationData.startDate }
              onStartDateChange={date => handleVacationDateChange(date, true)}
              onEndDateChange={date => handleVacationDateChange(date, false) }
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
              { renderVacationApplyButton() }
            </Box>
          </Box>
        </Box>
      </FormControl>
    </>
  );
};

export default VacationRequestForm;