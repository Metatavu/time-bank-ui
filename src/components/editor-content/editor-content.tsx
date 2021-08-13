import React, { useState } from "react";
import { Paper, Typography, Grid, FormControl, MenuItem, Select, FormHelperText, TextField, Box } from "@material-ui/core";
import "date-fns";
import DateFnsUtils from "@date-io/date-fns";
import { MuiPickersUtilsProvider, KeyboardDatePicker, DatePickerView } from "@material-ui/pickers";
import { useEditorContentStyles } from "styles/editor-content/editor-content";
import { useAppDispatch, useAppSelector } from "app/hooks";
import { selectPerson } from "features/person/person-slice";
import strings from "localization/strings";
import theme from "theme/theme";
import TimeUtils from "utils/time-utils";

/**
 * Component properties
 */
interface Props {
}

/**
 * Values for filtering scopes
 */
enum FilterScopes {
  WEEK = "week",
  DATE = "date",
  MONTH = "month",
  YEAR = "year"
};

/**
 * Application editor content component
 *
 * @param props component properties
 */
const EditorContent: React.FC<Props> = () => {

  const classes = useEditorContentStyles();

  const dispatch = useAppDispatch();

  const { person, personTotalTime } = useAppSelector(selectPerson);

  const [ selectedStartingDate, setSelectedStartingDate ] = useState<Date>(new Date());
  const [ selectedEndingDate, setSelectedEndingDate ] = useState<Date>(new Date());
  const [ dateFormat, setDateFormat ] = React.useState<string>("dd/MM/yyyy");
  const [ scope, setScope ] = React.useState<DatePickerView>("date");
  // TODO: Dynamically check week number and how many weeks each year has
  const [ startWeek, setStartWeek ] = React.useState<Number>(1);
  const [ endWeek, setEndWeek ] = React.useState<Number>(53);

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
   * @returns week numbers as array
   */
  const generateWeekNumbers = () => {
    const numbers : number[] = [];
    for(let i = 1; i <= 53; i++){
      numbers.push(i)
    }

    return numbers;
  };

  const renderWeekNumbers = () => (
    generateWeekNumbers().map((weekNumber, index) => (
      <MenuItem 
        key={ index } 
        value={ weekNumber }
      >
        { weekNumber }
      </MenuItem>
    ))
  );

  /**
   * Changes the presented date format according to selected scope
   *
   * @param event React change event
   */
  const handleDateFormatChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setScope(value as DatePickerView);
    switch(value.toString()) {
      case "date":
        setDateFormat("dd/MM/yyyy");
        break;
      case "month":
        setDateFormat("MM/yyyy");
        break;
      case "year":
        setDateFormat("yyyy");
        break;
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
          style={{ marginLeft: theme.spacing(2) }}
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
    <FormControl variant="outlined" className={ classes.selectScope }>
      <TextField
        select
        id="scope-select-outlined"
        size="small"
        value={ scope }
        onChange={ handleDateFormatChange }
      >
        { renderSelectOptions }
      </TextField>
    </FormControl>
  );

  /**
   * Renders start date picker 
   */
  const renderStartDatePicker = () => {
    const { filterStartingDate } = strings.editorContent;

    return (
      <MuiPickersUtilsProvider utils={ DateFnsUtils } >
        <Grid className={ classes.timeFilter }>
          <KeyboardDatePicker
            variant="inline"
            views={ [ scope ] }
            format={ dateFormat }
            id="date-picker-start"
            label={ filterStartingDate }
            value={ selectedStartingDate }
            onChange={ handleStartDateChange }
            KeyboardButtonProps={{ "aria-label": `${ filterStartingDate }` }}
          />
        </Grid>
      </MuiPickersUtilsProvider>
    );
  }
  
  /**
   * Renders start year picker and week selector 
   */
  const renderStartYearPickerAndWeekSelector = () => {
    return (
      <>
        <FormControl variant="standard">
          <MuiPickersUtilsProvider utils={ DateFnsUtils } >
            <Grid className={ classes.timeFilterYearSelector }>
              <KeyboardDatePicker
                variant="inline"
                views={[ "year" ]}
                format="yyyy"
                id="date-picker-year-start"
                label={ strings.editorContent.selectYearStart }
                value={ selectedStartingDate }
                onChange={ handleStartDateChange }
                KeyboardButtonProps={{ "aria-label": `${ strings.editorContent.filterStartingDate }` }}
              />
            </Grid>
          </MuiPickersUtilsProvider>
        </FormControl>
        <FormControl variant="standard" className={ classes.selectWeekNumbers }>
          <FormHelperText>{ strings.editorContent.selectWeekStart }</FormHelperText>
            <TextField
              select
              id="scope-select-outlined"
              value={ startWeek }
              onChange={ handleStartWeekChange }
            >
              { renderWeekNumbers() }
            </TextField>
        </FormControl>
      </>
    )
  }

  /**
   * Renders end date picker
   */
  const renderEndDate = () => (
    <MuiPickersUtilsProvider utils={ DateFnsUtils }>
      <Grid className={ classes.timeFilter } >
        <KeyboardDatePicker
          variant="inline"
          format={ dateFormat }
          views={[ scope ]}
          id="date-picker-end"
          label={ strings.editorContent.filterEndingDate }
          value={ selectedEndingDate } 
          onChange={ handleEndDateChange }
          KeyboardButtonProps={{ "aria-label": `${ strings.editorContent.filterEndingDate }`}}
        />
      </Grid>
    </MuiPickersUtilsProvider>
  );

  /**
   * Renders end year picker and week selector 
   */
  const renderEndYearPickerAndWeekSelector = () => {
    return (
      <>
        <FormControl variant="standard">
          <MuiPickersUtilsProvider utils={ DateFnsUtils } >
            <Grid className={ classes.timeFilterYearSelector }>
              <KeyboardDatePicker
                variant="inline"
                views={[ "year" ]}
                format="yyyy"
                id="date-picker-year-end"
                label={ strings.editorContent.selectYearEnd }
                value={ selectedEndingDate }
                onChange={ handleEndDateChange }
                KeyboardButtonProps={{ "aria-label": `${ strings.editorContent.filterStartingDate }` }}
              />
            </Grid>
          </MuiPickersUtilsProvider>
        </FormControl>
        <FormControl variant="standard" className={ classes.selectWeekNumbers }>
          <FormHelperText>{ strings.editorContent.selectWeekEnd }</FormHelperText>
            <TextField
              id="scope-select-outlined"
              value={ endWeek }
              onChange={ handleEndWeekChange }
            >
              { renderWeekNumbers() }
            </TextField>
        </FormControl>
      </>
    );
  }

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
          className={ classes.filterContainer }
        >
          <Typography style={{ fontStyle: "italic" }}>
            { strings.editorContent.userNotSelected }
          </Typography>
        </Paper>
      );
    }

    return (
      <Paper 
        elevation={ 3 }
        className={ classes.filterContainer }
      >
        <Typography variant="h4" style={{ fontWeight: 600, fontStyle: "italic" }}>
          { strings.editorContent.workTime }
        </Typography>
        { renderFilterSubtitleText(`${strings.logged}:`, personTotalTime.logged) }
        { renderFilterSubtitleText(`${strings.expected}:`, personTotalTime.expected) }
        { renderFilterSubtitleText(`${strings.total}:`, personTotalTime.total) }
        <Box className={ classes.filtersContainer }>
          { renderSelectScope() }
          { renderStartDatePickersAndWeekSelector() }
          { renderEndDatePickersAndWeekSelector() }
        </Box>
      </Paper>
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
      {/* TODO */}
      {/* { renderOverview() } */}
    </>
  );

}

export default EditorContent;
