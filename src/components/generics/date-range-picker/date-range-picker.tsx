import React from "react";
import DateFnsUtils from "@date-io/date-fns";
import { MuiPickersUtilsProvider, KeyboardDatePicker, DatePickerView } from "@material-ui/pickers";
import { FilterScopes } from "types";
import theme from "theme/theme";
import { Box, TextField, Typography, MenuItem } from "@material-ui/core";
import TimeUtils from "utils/time-utils";
import strings from "localization/strings";
import useDateRangePickerStyles from "styles/generics/date-range-picker/date-range-picker";

/**
 * Component properties
 */
interface Props {
  scope: FilterScopes;
  dateFormat?: string;
  selectedStartDate: Date;
  selectedEndDate: Date | null;
  startWeek?: number | null;
  endWeek?: number | null;
  datePickerView: DatePickerView;
  onStartDateChange: (date: Date | null) => void;
  onEndDateChange: (date: Date | null) => void;
  onStartWeekChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onEndWeekChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

/**
 * Overview chart component
 */
const DateRangePicker: React.FC<Props> = ({
  scope,
  dateFormat,
  selectedStartDate,
  selectedEndDate,
  startWeek,
  endWeek,
  datePickerView,
  onStartDateChange,
  onEndDateChange,
  onStartWeekChange,
  onEndWeekChange
}) => {
  const classes = useDateRangePickerStyles();

  const [ todayDate /* setTodayDate */ ] = React.useState(new Date());
  const [ currentWeekNumber, setCurrentWeekNumber ] = React.useState(0);

  /**
   * Initialize the date data
   */
  const initializeData = async () => {
    const currentWeek = TimeUtils.getCurrentWeek();
    setCurrentWeekNumber(currentWeek);
  };

  React.useEffect(() => {
    initializeData();
  }, []);

  /**
   * Renders start week numbers to select component
   */
  const renderStartWeekNumbers = () => {
    if (!selectedStartDate) {
      return;
    }

    const weekOpts = [];

    for (let week = 1; week <= currentWeekNumber; week++) {
      weekOpts.push((
        <MenuItem value={ week }>
          { week }
        </MenuItem>
      ));
    }

    return weekOpts;
  };

  /**
   * Renders end week numbers to select component
   */
  const renderEndWeekNumbers = () => {
    if (!selectedEndDate) {
      return;
    }

    const weekOpts = [];

    if (selectedStartDate?.getFullYear() === selectedEndDate.getFullYear() && !!startWeek) {
      for (let week = startWeek; week <= currentWeekNumber; week++) {
        weekOpts.push((
          <MenuItem value={ week }>
            { week }
          </MenuItem>
        ));
      }

      return weekOpts;
    }

    for (let week = 1; week <= currentWeekNumber; week++) {
      weekOpts.push((
        <MenuItem value={ week }>
          { week }
        </MenuItem>
      ));
    }

    return weekOpts;
  };

  /**
   * Renders start date picker 
   */
  const renderStartDatePicker = () => {
    const { filterStartingDate } = strings.editorContent;

    return (
      <MuiPickersUtilsProvider utils={ DateFnsUtils } >
        <KeyboardDatePicker
          inputVariant="standard"
          variant="inline"
          views={[ datePickerView ]}
          format={ dateFormat }
          maxDate={ todayDate }
          label={ filterStartingDate }
          value={ selectedStartDate }
          onChange={ onStartDateChange }
          className={ classes.datePicker }
          KeyboardButtonProps={{ "aria-label": `${filterStartingDate}` }}
        />
      </MuiPickersUtilsProvider>
    );
  };
  
  /**
   * Renders start year picker and week selector 
   */
  const renderStartYearPickerAndWeekSelector = () => (
    <>
      <MuiPickersUtilsProvider utils={ DateFnsUtils } >
        <KeyboardDatePicker
          views={[ FilterScopes.YEAR ]}
          variant="inline"
          inputVariant="standard"
          format="yyyy"
          maxDate={ todayDate }
          label={ strings.editorContent.selectYearStart }
          value={ selectedStartDate }
          onChange={ onStartDateChange }
          className={ classes.yearPicker }
          KeyboardButtonProps={{ "aria-label": `${strings.editorContent.filterStartingDate}` }}
        />
      </MuiPickersUtilsProvider>
      <TextField
        select
        variant="standard"
        value={ startWeek }
        onChange={ onStartWeekChange }
        label={ strings.editorContent.selectWeekStart }
        className={ classes.weekPicker }
      >
        { renderStartWeekNumbers() }
      </TextField>
    </>
  );

  /**
   * Renders end date picker
   */
  const renderEndDate = () => (
    <MuiPickersUtilsProvider utils={ DateFnsUtils }>
      <KeyboardDatePicker
        inputVariant="standard"
        variant="inline"
        format={ dateFormat }
        views={ [ datePickerView ] }
        minDate={ selectedStartDate }
        maxDate={ todayDate }
        label={ strings.editorContent.filterEndingDate }
        value={ selectedEndDate }
        onChange={ onEndDateChange }
        className={ classes.datePicker }
        KeyboardButtonProps={{ "aria-label": `${strings.editorContent.filterEndingDate}` }}
      />
    </MuiPickersUtilsProvider>
  );

  /**
   * Renders end year picker and week selector 
   */
  const renderEndYearPickerAndWeekSelector = () => (
    <>
      <MuiPickersUtilsProvider utils={ DateFnsUtils } >
        <KeyboardDatePicker
          inputVariant="standard"
          variant="inline"
          views={[ FilterScopes.YEAR ]}
          format="yyyy"
          minDate={ selectedStartDate }
          maxDate={ todayDate }
          label={ strings.editorContent.selectYearEnd }
          value={ selectedEndDate }
          onChange={ onEndDateChange }
          className={ classes.yearPicker }
          KeyboardButtonProps={{ "aria-label": `${strings.editorContent.filterStartingDate}` }}
        />
      </MuiPickersUtilsProvider>
      <TextField
        // TODO label when start only
        select
        variant="standard"
        id="scope-select-outlined"
        value={ endWeek }
        onChange={ onEndWeekChange }
        label={ strings.editorContent.selectWeekEnd }
        className={ classes.weekPicker }
      >
        { renderEndWeekNumbers() }
      </TextField>
    </>
  );

  /**
   * Renders starting datepicker or week/year selector depending on scope
   */
  const renderStartDatePickersAndWeekSelector = () => {
    return scope.toString() !== FilterScopes.WEEK ?
      renderStartDatePicker() :
      renderStartYearPickerAndWeekSelector();
  };
  
  /**
   * Renders ending datepicker/week selector depending on scope
   */
  const renderEndDatePickersAndWeekSelector = () => {
    return scope.toString() !== FilterScopes.WEEK ?
      renderEndDate() :
      renderEndYearPickerAndWeekSelector();
  };

  /**
   * Component render
   */
  return (
    <>
      <Box display="flex" alignItems="center">
        <Typography variant="h5" style={{ marginRight: theme.spacing(3) }}>
          { `${strings.editorContent.from}: ` }
        </Typography>
        { renderStartDatePickersAndWeekSelector() }
      </Box>
      <Box ml={ 4 } display="flex" alignItems="center">
        <Typography variant="h5" style={{ marginRight: theme.spacing(3) }}>
          { `${strings.editorContent.to}: ` }
        </Typography>
        { renderEndDatePickersAndWeekSelector() }
      </Box>
    </>
  );
};

export default DateRangePicker;