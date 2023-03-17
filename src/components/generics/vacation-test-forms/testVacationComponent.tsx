/* eslint-disable */ 
import React, { useState } from 'react';
import { LocalizationProvider, DatePicker, CalendarPickerView, StaticDatePicker, DesktopDatePicker, CalendarPicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { Box, TextField, MenuItem, Typography, Button, Accordion } from "@mui/material";
import strings from "localization/strings";
import useDateRangePickerStyles from "styles/generics/date-range-picker/date-range-picker";
import enLocale from "date-fns/locale/en-US";
import theme from 'theme/theme';
import { useMediaQuery } from '@material-ui/core';





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
  //const classes = useDateRangePickerStyles();
  const [ pickerLocale, setPickerLocale ] = React.useState(enLocale);
  const [ testData, setTestData ] = React.useState<any[]>([
    {
      id: 1,
      text: "asd"
    }
  ])
  const [ textContent, setTextContent ] = React.useState("");


  /**
   * Renders start date picker 
   */
    const renderStartDatePicker = () => {
      //const { filterStartingDate } = strings.editorContent;
      return (
        <LocalizationProvider dateAdapter={ AdapterDateFns } adapterLocale={ pickerLocale }>
          <DatePicker
            views={[ datePickerView ]}
            inputFormat={ dateFormat }
            label={`alku`}
            value={ selectedStartDate }
            onChange={ onStartDateChange }
            //className={ classes.datePicker }
            renderInput={ params => <TextField {...params}/>}
          />
        </LocalizationProvider>
      );
  } 

  /**
   * Renders end date picker
   */
  const renderEndDate = () => (
    <LocalizationProvider dateAdapter={ AdapterDateFns } adapterLocale={ pickerLocale } >
      <DatePicker
        minDate={selectedStartDate}
        inputFormat={ dateFormat }
        views={ [ datePickerView ] }
        label={ `loppu` }
        value={ selectedEndDate }
        onChange={ onEndDateChange }
        //className={ classes.datePicker }
        renderInput={ params => <TextField {...params}/>}
      />
    </LocalizationProvider>
  );
  /**
   * Renders days spend
   */
  
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
    return(
      console.log(`this is START DATE ${selectedStartDate} and this is END DATE${selectedEndDate} and this is TEXT CONTENT ${textContent}`)
    )
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

  const handleTextContent = (event: React.ChangeEvent<HTMLInputElement>) => {
    const contentValue = event.target.value;
    setTextContent(contentValue)
  }

  const renderTestTextBox = () => (
    <TextField 
      id="outlined-multiline-flexible"
      multiline maxRows={5}
      label="TestTest"
      variant='outlined'
      value={textContent}
      onChange={handleTextContent}
      />
  );



  /**
   * Component render
   */
  const matches = useMediaQuery(theme.breakpoints.down("md"))
  return (
    <>
      <Box display="flex" alignItems="center" justifyContent="center" width="100%" gap="10px" padding={theme.spacing(3)}>
        {!matches 
         ? <Box>{ renderStartDatePicker() }</Box>
         : <Box> { `Test` } </Box>
        }
        <Box>
        { renderEndDate() }
        </Box>
        <Box display="flex" flexDirection="column" alignItems="center" gap="10px" paddingTop="10px">
          { renderDaysSpend() }
          { renderTestTextBox() }
          { renderTestButton() }
        </Box>
      </Box>
    </>
  );
}



export default TestRangePicker;
