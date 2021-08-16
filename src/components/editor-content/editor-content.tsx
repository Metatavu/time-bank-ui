import React, { useState } from "react";
import { Paper, Typography, Grid, Divider, MenuItem, TextField, Box, Accordion, AccordionSummary, AccordionDetails } from "@material-ui/core";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import "date-fns";
import DateFnsUtils from "@date-io/date-fns";
import { MuiPickersUtilsProvider, KeyboardDatePicker, DatePickerView } from "@material-ui/pickers";
import { useEditorContentStyles } from "styles/editor-content/editor-content";
import { useAppSelector } from "app/hooks";
import { selectPerson } from "features/person/person-slice";
import strings from "localization/strings";
import theme from "theme/theme";
import TimeUtils from "utils/time-utils";
import { FilterScopes, DateFormats } from "types/index";

/**
 * Component properties
 */
interface Props {
}

/**
 * Application editor content component
 *
 * @param props component properties
 */
const EditorContent: React.FC<Props> = () => {

  const classes = useEditorContentStyles();

  const [ todayDate, /*setTodayDate*/ ] = useState(new Date());
  const [ currentWeekNumber, setCurrentWeekNumber ] = useState(0);
  const { person, personTotalTime } = useAppSelector(selectPerson);
  const [ selectedStartingDate, setSelectedStartingDate ] = useState<Date>(new Date());
  const [ selectedEndingDate, setSelectedEndingDate ] = useState<Date>(new Date());
  const [ scope, setScope ] = React.useState<FilterScopes>(FilterScopes.WEEK);
  const [ dateFormat, setDateFormat ] = React.useState<string | undefined>("dd/MM/yyyy");
  const [ datePickerView, setDatePickerView ] = React.useState<DatePickerView>("date");
  const [ startWeek, setStartWeek ] = React.useState<number | undefined>(undefined);
  const [ endWeek, setEndWeek ] = React.useState<number | undefined>(undefined);

  /**
   * Initialize the component data
   */
  const initializeData = async () => {
    const currentWeek = getCurrentWeek();
    setCurrentWeekNumber(currentWeek);

    // set scope to the current sprint
    if ((currentWeek % 2) === 0) {
      setStartWeek(currentWeek - 1);
      setEndWeek(currentWeek);
    } else {
      setStartWeek(currentWeek);
    }
  }

  React.useEffect(() => {
    initializeData();
  }, [])

  /**
   * Method to handle starting date change
   *
   * @param date selected date
   */
  const handleStartDateChange = (date: Date | null) => {
    date && setSelectedStartingDate(date);
  };

  /**
   * Method to handle ending date change
   *
   * @param date selected date
   */
  const handleEndDateChange = (date: Date | null) => {
    date && setSelectedEndingDate(date);
  };
  
  /**
   * Method to handle starting week change
   *
   * @param event React change event 
   */
  const handleStartWeekChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setStartWeek(Number(value));
  };

  /**
   * Method to handle ending week change
   * 
   * @param event React change event
   */
  const handleEndWeekChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setEndWeek(Number(value));
  };

  /**
   * Generate week numbers for the select component
   * 
   * @returns current week number
   */
  const getCurrentWeek = () => {
    const today = new Date();  
    const oneJan = new Date(today.getFullYear(), 0, 1);   
    const numberOfDays = Math.floor((today.getTime() - oneJan.getTime()) / (24 * 60 * 60 * 1000));   

    return Math.ceil(( today.getDay() + 1 + numberOfDays) / 7);   
  };

  /**
   * Renders week numbers to select component
   */
  const renderStartWeekNumbers = () => {
    const weekOpts = []

    for (let week = 1; week <= currentWeekNumber; week++) {
      weekOpts.push((
        <MenuItem value={ week }>
          { week }
        </MenuItem>
      ))
    } 
    return weekOpts;
  };

  /**
   * Renders week numbers to select component
   */
  const renderEndWeekNumbers = () => {
    const weekOpts = []

    for (let week = startWeek || 1; week <= currentWeekNumber; week++) {
      weekOpts.push((
        <MenuItem value={ week }>
          { week }
        </MenuItem>
      ))
    } 
    return weekOpts;
  };

  /**
   * Changes the presented date format according to selected scope
   *
   * @param event React change event
   */
  const handleDateFormatChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFilterScope  = event.target.value as FilterScopes;

    setScope(selectedFilterScope);
    if (selectedFilterScope ! === FilterScopes.WEEK ) {
      setDatePickerView(selectedFilterScope as DatePickerView);
      setDateFormat({
        [FilterScopes.DATE]: DateFormats.DATE,
        [FilterScopes.WEEK]: DateFormats.DATE,
        [FilterScopes.MONTH]: DateFormats.MONTH,
        [FilterScopes.YEAR]: DateFormats.YEAR,
      }[selectedFilterScope]);
    }
  };

  /**
   * Renders scope options for select component
   */
  const renderSelectOptions = Object.values(FilterScopes).map(scope =>
    <MenuItem
      value={ scope }
      key={ scope }
    >
      { strings.editorContent[scope as keyof object] }
    </MenuItem>
  );

  /**
   * Renders the filter subtitle text
   * 
   * @param name name of the subtitle text
   * @param value value of the subtitle text
   */
  const renderFilterSubtitleText = (name: string, value: number) => {
    return (
      <>
        <Typography
          variant="h5"
          style={{ 
            marginLeft: theme.spacing(2) 
          }}
        >
          { name }
        </Typography>
        <Typography
          variant="h5"
          style={{
            marginLeft: theme.spacing(1),
            fontStyle: "italic"
          }}
        >
          { TimeUtils.minuteToHourString(value) }
        </Typography>
      </>
    );
  }

  /**
   * Renders selector of filter scope
   */
  const renderSelectScope = () => (
    <TextField
      select
      size="small"
      value={ scope }
      onChange={ handleDateFormatChange }
      className={ classes.scopeSelector }
    >
      { renderSelectOptions }
    </TextField>
  );

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
          value={ selectedStartingDate }
          onChange={ handleStartDateChange }
          className={ classes.datePicker }
          KeyboardButtonProps={{ "aria-label": `${ filterStartingDate }` }}
        />
      </MuiPickersUtilsProvider>
    );
  }
  
  /**
   * Renders start year picker and week selector 
   */
  const renderStartYearPickerAndWeekSelector = () =>  (
    <>
      <MuiPickersUtilsProvider utils={ DateFnsUtils } >
        <KeyboardDatePicker
          views={[ FilterScopes.YEAR ]}
          variant="inline"
          inputVariant="standard"
          format="yyyy"
          maxDate={ todayDate }
          label={ strings.editorContent.selectYearStart }
          value={ selectedStartingDate }
          onChange={ handleStartDateChange }
          className={ classes.datePicker }
          KeyboardButtonProps={{ "aria-label": `${ strings.editorContent.filterStartingDate }` }}
        />
      </MuiPickersUtilsProvider>
      <TextField
        select
        variant="standard"
        value={ startWeek }
        onChange={ handleStartWeekChange }
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
        views={[ datePickerView ]}
        maxDate={ todayDate }
        label={ strings.editorContent.filterEndingDate }
        value={ selectedEndingDate } 
        onChange={ handleEndDateChange }
        className={ classes.datePicker }
        KeyboardButtonProps={{ "aria-label": `${ strings.editorContent.filterEndingDate }`}}
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
          maxDate={ todayDate }
          label={ strings.editorContent.selectYearEnd }
          value={ selectedEndingDate }
          onChange={ handleEndDateChange }
          className={ classes.datePicker }
          KeyboardButtonProps={{ "aria-label": `${ strings.editorContent.filterStartingDate }` }}
        />
      </MuiPickersUtilsProvider>
      <TextField
        select
        variant="standard"
        id="scope-select-outlined"
        value={ endWeek }
        onChange={ handleEndWeekChange }
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
  }

  /**
   * Renders ending datepicker/week selector depending on scope
   */
  const renderEndDatePickersAndWeekSelector = () => {
    return scope.toString() !== FilterScopes.WEEK ?
      renderEndDate() :
      renderEndYearPickerAndWeekSelector();
  }

  /**
   * Renders the filter component
   */
  const renderFilter = () => {
    if (!personTotalTime) {
      return (
        <Paper 
          elevation={ 3 }
          className={ classes.emptyFilterContainer }
        >
          <Typography style={{ fontStyle: "italic" }}>
            { strings.editorContent.userNotSelected }
          </Typography>
        </Paper>
      );
    }

    return (
      <Accordion>
        <AccordionSummary
          expandIcon={ <ExpandMoreIcon /> }
          aria-controls="panel1a-content"
          className={ classes.filterSummary }
        >
          { renderFilterSummary() }
        </AccordionSummary>
        <AccordionDetails className={ classes.filterContent }>
          { renderFilterDetails() }
        </AccordionDetails>
      </Accordion>
    );
  }

  /**
   * Renders the filter summary
   */
  const renderFilterSummary = () => {
    return (
      <>
        <Typography variant="h4" style={{ fontWeight: 600, fontStyle: "italic" }}>
          { strings.editorContent.workTime }
        </Typography>
        <Box className={ classes.filterSubtitle } >
          { renderFilterSubtitleText(`${strings.logged}:`, personTotalTime!.logged) }
          { renderFilterSubtitleText(`${strings.expected}:`, personTotalTime!.expected) }
          { renderFilterSubtitleText(`${strings.total}:`, personTotalTime!.total) }
        </Box>
      </>
    );
  }

  /**
   * Renders the filter details
   */
  const renderFilterDetails = () => {
    return (
      <>
        { renderSelectScope() }
        <Box className={ classes.datePickers }>
          <Box display="flex" alignItems="center">
            {/* TODO stylesheet localization */}
            <Typography variant="h5" style={{ marginRight: theme.spacing(3) }}>
              { "from: " }
            </Typography>
            { renderStartDatePickersAndWeekSelector() }
          </Box>
          <Box marginLeft={ 4 } display="flex" alignItems="center">
            <Typography variant="h5" style={{ marginRight: theme.spacing(3) }}>
              { "to: " }
            </Typography>
            { renderEndDatePickersAndWeekSelector() }
          </Box>
        </Box>
      </>
    );
  }

  /**
   * Renders the filter component
   */
  const renderOverview = () => {
    if (!personTotalTime) {
      return null;
    }

    return (
      <Paper 
        elevation={ 3 }
        className={ classes.overviewContainer }
      >
      </Paper>
    );
  }

  /**
   * Component render
   */
  return (
    <>
      { renderFilter() }
      { renderOverview() }
    </>
  );

}

export default EditorContent;
