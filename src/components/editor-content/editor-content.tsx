import React, { useState } from "react";
import { Paper, Typography, Grid, FormControl, MenuItem, Select, FormHelperText, TextField, Box } from "@material-ui/core";
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker, DatePickerView } from '@material-ui/pickers';
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
 * Application editor content component
 *
 * @param props component properties
 */
const EditorContent: React.FC<Props> = () => {
  const classes = useEditorContentStyles();
  const dispatch = useAppDispatch();

  const { person, personTotalTime } = useAppSelector(selectPerson);

  const [selectedStartingDate, setSelectedStartingDate] = useState<Date | null>(
    new Date()
  );

  const [selectedEndingDate, setSelectedEndingDate] = useState<Date | null>(
    new Date()
  );

  const [dateFormat, setDateFormat] = React.useState<string>("dd/M/yyyy")

  const [scope, setScope] = React.useState<DatePickerView>("date");

  const [startWeek, setStartWeek] = React.useState<Number>(1);

  const [endWeek, setEndWeek] = React.useState<Number>(53);

  const [endYear, setEndYear] = React.useState<Number>(53);

  /**
   * Generate week numbers for the select component
   * @returns week numbers as array
   */
  const generateWeekNumbers = () => {
    const numbers : number[] = [];
    for(let i = 1; i <= 53; i++){
      numbers.push(i)
    }
    return numbers
  }

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
  const renderSelectScope = () => {
    const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
      setScope(event.target.value as DatePickerView);
      switch(event.target.value as string) {
        case "date":
          setDateFormat("dd/MM/yyyy")
          break;
        case "month":
          setDateFormat("MM/yyyy")
          break;
        case "year":
          setDateFormat("yyyy")
          break;
      }
    };

    return (
      <>
      <FormControl variant="outlined" className={ classes.selectScope }>
        <TextField
          select
          id="scope-select-outlined"
          size="small"
          value={ scope }
          onChange={ handleChange }
        >
          <MenuItem value={ "week" }>{ strings.editorContent.scopeWeek.toUpperCase() }</MenuItem>
          <MenuItem value={ "date" }>{ strings.editorContent.scopeDate.toUpperCase() }</MenuItem>
          <MenuItem value={ "month" }>{ strings.editorContent.scopeMonth.toUpperCase() }</MenuItem>
          <MenuItem value={ "year" }>{ strings.editorContent.scopeYear.toUpperCase() }</MenuItem>
        </TextField>
      </FormControl>
      </>
    );
  }

  /**
   * Renders starting datepicker/week selector depending on scope
   */
  const renderStartDatePicker = () => {
    const handleDateChange = (date: Date | null) => {
      setSelectedStartingDate(date);
    };

    const handleStartWeekChange = (event: React.ChangeEvent<{ value: unknown }>) => {
      setStartWeek(event.target.value as Number);
    };

    if(scope.toString() !== "week"){
      return (
        <MuiPickersUtilsProvider utils={ DateFnsUtils } >
          <Grid className={ classes.timeFilter }>
            <KeyboardDatePicker
              variant="inline"
              views={ [scope] }
              format={ dateFormat }
              id="date-picker-start"
              label={ strings.editorContent.filterStartingDate }
              value={ selectedStartingDate }
              onChange={ handleDateChange }
              KeyboardButtonProps={ {'aria-label': `${ strings.editorContent.filterStartingDate }`} }
            />
          </Grid>
        </MuiPickersUtilsProvider>
      );
    } else {
      return (
        <>
          <FormControl variant="standard">
            <MuiPickersUtilsProvider utils={ DateFnsUtils } >
              <Grid className={ classes.timeFilterYearSelector }>
                <KeyboardDatePicker
                  variant="inline"
                  views={ ["year"] }
                  format="yyyy"
                  id="date-picker-year-start"
                  label={ strings.editorContent.selectYearStart }
                  value={ selectedStartingDate }
                  onChange={ handleDateChange }
                  KeyboardButtonProps={ {'aria-label': `${ strings.editorContent.filterStartingDate }`} }
                />
              </Grid>
            </MuiPickersUtilsProvider>
          </FormControl>
          <FormControl variant="standard" className={ classes.selectWeekNumbers }>
            <FormHelperText>{ strings.editorContent.selectWeekStart }</FormHelperText>
              <Select
                labelId="scope-select-outlined-label"
                id="scope-select-outlined"
                value={ startWeek }
                onChange={ handleStartWeekChange }
              >
                { generateWeekNumbers().map((weekNumber : number, index: number) => {
                  return  <MenuItem 
                            key={ index } 
                            value={ weekNumber }
                            >
                            { weekNumber }
                          </MenuItem>
                }) }
              </Select>
          </FormControl>
        </>
      )
    }
  }

  /**
   * Renders ending datepicker/week selector depenging on scope
   */
  const renderEndDatePicker = () => {
    const handleDateChange = (date: Date | null) => {
      setSelectedEndingDate(date);
    };
    const handleEndWeekChange = (event: React.ChangeEvent<{ value: unknown }>) => {
      setEndWeek(event.target.value as Number);
    };
    const handleYearChange = (date: Date | null) => {
      setSelectedEndingDate(date);
    };

    if(scope.toString() !== "week"){
      return (
        <MuiPickersUtilsProvider utils={ DateFnsUtils }>
          <Grid className={ classes.timeFilter } >
            <KeyboardDatePicker
              variant="inline"
              format={ dateFormat }
              views={ [scope] }
              id="date-picker-end"
              label={ strings.editorContent.filterEndingDate }
              value={ selectedEndingDate } 
              onChange={ handleDateChange }
              KeyboardButtonProps={ {'aria-label': `${ strings.editorContent.filterEndingDate }`} }
            />
          </Grid>
        </MuiPickersUtilsProvider>
      );
    } else {
      return (
        <>
          <FormControl variant="standard">
            <MuiPickersUtilsProvider utils={ DateFnsUtils } >
              <Grid className={ classes.timeFilterYearSelector }>
                <KeyboardDatePicker
                  variant="inline"
                  views={ ["year"] }
                  format="yyyy"
                  id="date-picker-year-start"
                  label={ strings.editorContent.selectYearEnd }
                  value={ selectedEndingDate }
                  onChange={ handleYearChange }
                  KeyboardButtonProps={ {'aria-label': `${ strings.editorContent.filterStartingDate }`} }
                />
              </Grid>
            </MuiPickersUtilsProvider>
          </FormControl>
          <FormControl variant="standard" className={ classes.selectWeekNumbers }>
            <FormHelperText>{ strings.editorContent.selectWeekEnd }</FormHelperText>
              <Select
                labelId="scope-select-outlined-label"
                id="scope-select-outlined"
                value={ endWeek }
                onChange={ handleEndWeekChange }
              >
                { generateWeekNumbers().map((weekNumber : number, index: number) => {
                  return <MenuItem key={ index } value={ weekNumber }>{ weekNumber }</MenuItem>
                }) }
              </Select>
          </FormControl>
        </>
      )
    } 
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
          <Typography style={ { fontStyle: "italic" } }>
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
        <Typography variant="h4">
          { strings.editorContent.workTime }
        </Typography>
        { renderFilterSubtitleText(`${ strings.logged }:`, personTotalTime.logged) }
        { renderFilterSubtitleText(`${ strings.expected }:`, personTotalTime.expected) }
        { renderFilterSubtitleText(`${ strings.difference }:`, personTotalTime.total) }
        <Box className={ classes.filtersContainer }>
          { renderSelectScope() }
          { renderStartDatePicker() }
          { renderEndDatePicker() }
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
