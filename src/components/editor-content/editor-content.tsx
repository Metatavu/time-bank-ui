import React, { useState } from "react";
import { Paper, Typography, Grid, FormControl, MenuItem, Select } from "@material-ui/core";
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
        <Select
          labelId="scope-select-outlined-label"
          id="scope-select-outlined"
          value={ scope }
          onChange={ handleChange }
        >
          <MenuItem value={ "week" }>{ strings.editorContent.scopeWeek }</MenuItem>
          <MenuItem value={ "date" }>{ strings.editorContent.scopeDate }</MenuItem>
          <MenuItem value={ "month" }>{ strings.editorContent.scopeMonth }</MenuItem>
          <MenuItem value={ "year" }>{ strings.editorContent.scopeYear }</MenuItem>
        </Select>
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
            KeyboardButtonProps={ {'aria-label': 'Kaikki alkaa'} }
            className={ classes.timeFilter }
          />
        </Grid>
      </MuiPickersUtilsProvider>
    );
  }

  /**
   * Renders datepicker for ending date
   */
   const renderEndDatePicker = () => {
    const handleDateChange = (date: Date | null) => {
      setSelectedEndingDate(date);
    };

    return (
      <MuiPickersUtilsProvider utils={ DateFnsUtils }>
        <Grid className={ classes.timeFilter } >
          <KeyboardDatePicker
            variant="inline"
            format="dd/MM/yyyy"
            id="date-picker-end"
            //label={ strings.editorContent.filterEndingDate }
            label="Kaikki kuolee"
            value={ selectedEndingDate } 
            onChange={ handleDateChange }
            KeyboardButtonProps={ {'aria-label': 'Kaikki päättyy'} }
            className={ classes.timeFilter }
          />
        </Grid>
      </MuiPickersUtilsProvider>
    );
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
        { renderFilterSubtitleText(`${ strings.total }:`, personTotalTime.total) }
        { renderSelectScope() }
        { renderStartDatePicker() }
        { renderEndDatePicker() }
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
