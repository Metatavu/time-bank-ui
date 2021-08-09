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
  console.log(person)
  const [selectedStartingDate, setSelectedStartingDate] = useState<Date | null>(
    new Date('2014-08-18T21:11:54'),
  );

  const [selectedEndingDate, setSelectedEndingDate] = useState<Date | null>(
    new Date('2014-08-18T21:11:54'),
  );

  const [scope, setScope] = React.useState<DatePickerView>("month");

  const [startWeek, setStartWeek] = React.useState<Number>(1);

  const [endWeek, setEndWeek] = React.useState<Number>(53);

  const [endYear, setEndYear] = React.useState<Number>(53);

  /*const [startYear, setStartYear = React.useState<Date | null>(
    new Date('2014-08-18T21:11:54')
  );*/

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
   * Renders datepicker for ending date
   */
  const renderSelectScope = () => {
    const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
      setScope(event.target.value as DatePickerView);
    };

    return (
      <>
      <FormControl variant="outlined" className={ classes.selectScope }>
        <TextField
          select
          //labelId="scope-select-outlined-label"
          id="scope-select-outlined"
          size="small"
          value={ scope }
          onChange={ handleChange }
        >
          <MenuItem value={ "week" }>{ strings.editorContent.scopeWeek }</MenuItem>
          <MenuItem value={ "date" }>{ strings.editorContent.scopeDate }</MenuItem>
          <MenuItem value={ "month" }>{ strings.editorContent.scopeMonth }</MenuItem>
          <MenuItem value={ "year" }>{ strings.editorContent.scopeYear }</MenuItem>
        </TextField>
      </FormControl>
      </>
    );
  }

  /**
   * Renders datepicker for starting date
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
              format="dd/MM/yyyy"
              id="date-picker-start"
              label={ strings.editorContent.filterStartingDate }
              value={ selectedStartingDate }
              onChange={ handleDateChange }
              KeyboardButtonProps={ {'aria-label': `${ strings.editorContent.filterStartingDate }`} }
              className={ classes.timeFilter }
            />
          </Grid>
        </MuiPickersUtilsProvider>
      );
    } else {
      return (
        <>
          <FormControl variant="standard" className={ classes.selectWeekNumbers }>
            <FormHelperText>{ strings.editorContent.selectYearStart }</FormHelperText>
              <Select
                labelId="scope-select-outlined-label"
                id="scope-select-outlined"
                value={ startWeek }
                onChange={ handleStartWeekChange }
              >
                { generateWeekNumbers().map((weekNumber : number, index: number) => {
                  return <MenuItem key={ index } value={ weekNumber }>{ weekNumber }</MenuItem>
                }) }
              </Select>
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
                  return <MenuItem key={ index } value={ weekNumber }>{ weekNumber }</MenuItem>
                }) }
              </Select>
          </FormControl>
        </>

      )
    }
  }
  /**
   * Renders datepicker for ending date
   */
  const renderEndDatePicker = () => {
    const handleDateChange = (date: Date | null) => {
      setSelectedEndingDate(date);
    };
    const handleEndWeekChange = (event: React.ChangeEvent<{ value: unknown }>) => {
      setEndWeek(event.target.value as Number);
    };
    /*const handleYearChange = (date: Date | null) => {
      setStartYear(date);
    };*/

    if(scope.toString() !== "week"){
      return (
        <MuiPickersUtilsProvider utils={ DateFnsUtils }>
          <Grid className={ classes.timeFilter } >
            <KeyboardDatePicker
              variant="inline"
              format="dd/MM/yyyy"
              id="date-picker-end"
              label={ strings.editorContent.filterEndingDate }
              value={ selectedEndingDate } 
              onChange={ handleDateChange }
              KeyboardButtonProps={ {'aria-label': `${ strings.editorContent.filterEndingDate }`} }
              className={ classes.timeFilter }
            />
          </Grid>
        </MuiPickersUtilsProvider>
      );
    } else {
      return (
        <>
          <FormControl variant="standard" className={ classes.selectWeekNumbers }>
            <MuiPickersUtilsProvider utils={ DateFnsUtils } >
              <Grid className={ classes.timeFilter }>
                <KeyboardDatePicker
                  variant="inline"
                  views={ ["year"] }
                  format="yy"
                  id="date-picker-start"
                  label={ strings.editorContent.filterStartingDate }
                  value={ selectedStartingDate }
                  onChange={ handleDateChange }
                  KeyboardButtonProps={ {'aria-label': `${ strings.editorContent.filterStartingDate }`} }
                  className={ classes.timeFilter }
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
