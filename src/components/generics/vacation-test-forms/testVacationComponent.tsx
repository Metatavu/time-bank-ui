/* eslint-disable */ 
import React, { useState } from 'react';
import { LocalizationProvider, DatePicker, CalendarPickerView, StaticDatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { Box, TextField, MenuItem, Typography, Button, Accordion } from "@mui/material";
import strings from "localization/strings";
import useDateRangePickerStyles from "styles/generics/date-range-picker/date-range-picker";
import enLocale from "date-fns/locale/en-US";
import theme from 'theme/theme';
import moment from 'moment';
import { RowingSharp } from '@mui/icons-material';
import { id } from 'date-fns/locale';




interface Props {
  startDate?: Date | null;
  endDate?: Date | null;
  dateFormat?: string;
  selectedStartDate: any;
  selectedEndDate: any;
  datePickerView: CalendarPickerView;
  onStartDateChange: (value: any) => void;
  onEndDateChange: (value: any) => void;
}

const TestRangePicker: React.FC<Props> = ({
  dateFormat,
  selectedStartDate,
  selectedEndDate,
  datePickerView,
  onStartDateChange,
  onEndDateChange,
}) => {
  const classes = useDateRangePickerStyles();
  const [ pickerLocale, setPickerLocale ] = React.useState(enLocale);
  const [ testData, setTestData ] = React.useState<any[]>([
    {
      id: 1,
      text: "asd"
    }
  ])


  /**
   * Renders start date picker 
   */
    const renderStartDatePicker = () => {
      const { filterStartingDate } = strings.editorContent;
  
      return (
        <LocalizationProvider dateAdapter={ AdapterDateFns } adapterLocale={ pickerLocale } >
          <StaticDatePicker
            views={[ datePickerView ]}
            inputFormat={ dateFormat }
            label={ filterStartingDate }
            value={ selectedStartDate }
            onChange={ onStartDateChange }
            className={ classes.datePicker }
            renderInput={ params => <TextField {...params}/>}
          />
        </LocalizationProvider>
      );
    };

  /**
   * Renders end date picker
   */
  const renderEndDate = () => (
    <LocalizationProvider dateAdapter={ AdapterDateFns } adapterLocale={ pickerLocale } >
      <StaticDatePicker
        inputFormat={ dateFormat }
        views={ [ datePickerView ] }
        label={ strings.editorContent.filterEndingDate }
        value={ selectedEndDate }
        onChange={ onEndDateChange }
        className={ classes.datePicker }
        renderInput={ params => <TextField {...params}/>}
      />
    </LocalizationProvider>
  );
  /**
   * Renders days spend
   */
  //var subtractDays = Math.abs(selectedStartDate.getTime() - selectedEndDate.getTime());
  //var daysBetween = Math.ceil(subtractDays / (1000 * 3600 * 24));

  
  const renderDaysSpend = () => {
    var subtractDays = 0
    if (selectedEndDate != null){
      subtractDays += Math.abs(selectedStartDate.getTime() - selectedEndDate.getTime());
    }
    var daysBetween = Math.ceil(subtractDays / (1000 * 3600 * 24));
    return(
    <Typography variant="h4">
      {(`Amount of vacation days spend ${daysBetween}`)}
    </Typography>
    )
  };
  /**
   * Renders test button
   */
  const handleThings = () => {
    return testData.map((test, index) => {
      return(
        <Box>
          <Typography>{test.text}</Typography>
        </Box>
      )
    })

    
  }

  const handleTestButton = () => {

  }


  const renderTestButton = () => (
    <Button
      color="secondary"
      variant="contained"
      onClick={ handleTestButton }
    >
      <Typography style={{ fontWeight: 600, color: "white" }}>
        { (`TEST BUTTON`) }
      </Typography>
    </Button>
  );

  const renderTestTextBox = () => (
    <TextField id="outlined-multiline-flexible" multiline maxRows={5} label="TestTest" variant='outlined'/>
  )



  /**
   * Component render
   */
  return (
    <>
      <Box display="flex" alignItems="center" boxShadow="0px 3px 3px -2px rgb(0, 0, 0, 0.2), 0px 3px 4px 0px rgba(0,0,0,0.14), 0px 1px 8px 0px rgb(0,0,0,0.12)">
        { renderStartDatePicker() }
      </Box>
      <Box ml={ 4 } display="flex" alignItems="center" boxShadow="0px 3px 3px -2px rgb(0, 0, 0, 0.2), 0px 3px 4px 0px rgba(0,0,0,0.14), 0px 1px 8px 0px rgb(0,0,0,0.12)">
        { renderEndDate() }
      </Box>
        <Box width="100%" height="474.5px" marginLeft="30px" paddingTop="50px" display="flex" flexDirection="column" alignItems="center" gap="10px" boxShadow="0px 3px 3px -2px rgb(0, 0, 0, 0.2), 0px 3px 4px 0px rgba(0,0,0,0.14), 0px 1px 8px 0px rgb(0,0,0,0.12)">
          { renderDaysSpend() }
          { renderTestTextBox() }
          { renderTestButton() }
        </Box>
    </>
  );
}



export default TestRangePicker;
