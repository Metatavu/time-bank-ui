import { Box, Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField, Typography } from "@mui/material";
import { VacationType } from "generated/client";
import strings from "localization/strings";
import { ChangeEvent, useEffect } from "react";
import { FilterScopes, VacationData } from "types";
import useEditorContentStyles from "styles/editor-content/editor-content";
import Holidays from "date-holidays";
import DateRangePicker from "components/generics/date-range-picker/date-range-picker";

/**
* Component properties
*/
interface Props {
  onClick: () => void;
  buttonLabel: string;
  vacationData: VacationData;
  setVacationData: (vacationData: VacationData) => void;
}

/**
* Form component for vacation request
*
* @param component props  
*/
const VacationRequestForm = ({
  onClick,
  buttonLabel,
  vacationData,
  setVacationData
}: Props) => {
  const classes = useEditorContentStyles();
  const dateFormat = "yyyy.MM.dd";

  /**
 * handle DateRangePicker chances
 * 
 * @param date
 * @param isStart
 */
  const handleVacationDateChange = (date: Date | null, isStart: boolean) => {
    if (!date) return;
    if (isStart) {
      setVacationData({ ...vacationData, startDate: date });
    } else {
      setVacationData({ ...vacationData, endDate: date });
    }
  };

  /**
 * Handle message textfield chance
 * 
 * @param event
 */
  const handleVacationMessageChange = ({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
    setVacationData({ ...vacationData, message: value });
  };

  /**
   * Handle vacation type 
   *  
   * @param event
   */
  const handleVacationTypeChange = ({ target: { value } }: SelectChangeEvent) => {
    setVacationData({ ...vacationData, type: value as VacationType });
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
      onClick={onClick}
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
        <Box
          display="flex"
          alignItems="center"
          marginRight="6em"
        >
          <Box className={ classes.datePickers }>
            <DateRangePicker
              scope={ FilterScopes.DATE }
              dateFormat={ dateFormat }
              selectedStartDate={ vacationData.startDate }
              selectedEndDate={ vacationData.endDate }
              datePickerView="day"
              minStartDate={ new Date() }
              minEndDate={ vacationData.startDate }
              onStartDateChange={date => handleVacationDateChange(date, true)}
              onEndDateChange={date => handleVacationDateChange(date, false) }
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