import React from "react";
import { Paper, Typography, Grid } from "@material-ui/core";
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
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

  const [selectedStartingDate, setSelectedStartingDate] = React.useState<Date | null>(
    new Date('2014-08-18T21:11:54'),
  );

  const [selectedEndingDate, setSelectedEndingDate] = React.useState<Date | null>(
    new Date('2014-08-18T21:11:54'),
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
        <Typography
          variant="h4"
          style={{
            fontWeight: 600,
            fontStyle: "italic",
          }}
        >
          { strings.editorContent.workTime }
        </Typography>
        { renderFilterSubtitleText(`${strings.logged}:`, personTotalTime.logged) }
        { renderFilterSubtitleText(`${strings.expected}:`, personTotalTime.expected) }
        { renderFilterSubtitleText(`${strings.total}:`, personTotalTime.total) }
        { renderStartDatePicker() }
        { renderEndDatePicker() }
      </Paper>
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
      <MuiPickersUtilsProvider utils={ DateFnsUtils }>
        <Grid container justifyContent="space-around">
          <KeyboardDatePicker
            disableToolbar
            variant="inline"
            format="dd/MM/yyyy"
            margin="normal"
            id="date-picker-inline"
            label={ strings.editorContent.filterStartingDate }
            value={ selectedStartingDate }
            onChange={ handleDateChange }
            KeyboardButtonProps={ {'aria-label': 'Kaikki alkaa'} }
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
        <Grid container justifyContent="space-around">
          <KeyboardDatePicker
            disableToolbar
            variant="inline"
            format="dd/MM/yyyy"
            margin="normal"
            id="date-picker-inline"
            label={ strings.editorContent.filterEndingDate }
            value={ selectedEndingDate } 
            onChange={ handleDateChange }
            KeyboardButtonProps={ {'aria-label': 'Kaikki päättyy'} }
          />
        </Grid>
      </MuiPickersUtilsProvider>
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
