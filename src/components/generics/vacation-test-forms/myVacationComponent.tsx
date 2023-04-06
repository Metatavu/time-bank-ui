/* eslint-disable */ 
import React from 'react';
import { LocalizationProvider, DatePicker, CalendarPickerView } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { Box, TextField } from "@mui/material";
import enLocale from "date-fns/locale/en-US";

interface Props {
  startDate?: Date | null;
  endDate?: Date | null;
  dateFormat?: string;
  selectedVacationStartDate: Date;
  selectedVacationEndDate: Date;
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
  const [ pickerLocale, setPickerLocale ] = React.useState(enLocale);

  /**
   * Renders start date picker 
   */
    const renderStartDatePicker = () => {
      return (
        <LocalizationProvider dateAdapter={ AdapterDateFns } adapterLocale={ pickerLocale }>
          <DatePicker
            views={[ datePickerView ]}
            inputFormat={ dateFormat }
            label={`Start date`}
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
        label={ `End date` }
        value={ selectedVacationEndDate }
        onChange={ onEndDateChange }
        renderInput={ params => <TextField {...params}/>}
      />
    </LocalizationProvider>
  );
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