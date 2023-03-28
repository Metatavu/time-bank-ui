/* eslint-disable */ 
import React, { useState } from 'react';
import { LocalizationProvider, DatePicker, CalendarPickerView, StaticDatePicker, DesktopDatePicker, CalendarPicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { Box, TextField, MenuItem, Typography, Button, Accordion } from "@mui/material";
import enLocale from "date-fns/locale/en-US";
import fiLocale from "date-fns/locale/fi";
import { selectLocale } from "features/locale/locale-slice";
import { useAppSelector } from "app/hooks";

interface Props {
  startDate?: Date | null;
  endDate?: Date | null;
  dateFormat?: string;
  selectedVacationStartDate: any;
  selectedVacationEndDate: any;
  datePickerView: CalendarPickerView;
  onStartDateChange: (value: any) => void;
  onEndDateChange: (value: any) => void;
}

const TestRangePicker: React.FC<Props> = ({
  dateFormat,
  selectedVacationStartDate,
  selectedVacationEndDate,
  datePickerView,
  onStartDateChange,
  onEndDateChange,
}) => {
  const { locale } = useAppSelector(selectLocale);
  const [ pickerLocale, setPickerLocale ] = React.useState(enLocale);

    /**
   * Initialize the date data
   */
    React.useEffect(() => {
      locale === "fi" ? setPickerLocale(fiLocale) : setPickerLocale(enLocale);
    }, [locale]);
    

  /**
   * Renders start date picker 
   */
    const renderStartDatePicker = () => {
      return (
        <LocalizationProvider dateAdapter={ AdapterDateFns } adapterLocale={ pickerLocale }>
          <DatePicker
            views={[ datePickerView ]}
            inputFormat={ dateFormat }
            label={`alku`}
            value={ selectedVacationStartDate }
            onChange={ onStartDateChange }
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
        minDate={selectedVacationStartDate}
        inputFormat={ dateFormat }
        views={ [ datePickerView ] }
        label={ `loppu` }
        value={ selectedVacationEndDate }
        onChange={ onEndDateChange }
        renderInput={ params => <TextField {...params}/>}
      />
    </LocalizationProvider>
  );

  /**
   * Component render
   */
  return (
    <>
      <Box>
        <Box display="flex" gap="10px">
        { renderStartDatePicker() }
        { renderEndDate() }
        </Box>
      </Box>
    </>
  );
}



export default TestRangePicker;
