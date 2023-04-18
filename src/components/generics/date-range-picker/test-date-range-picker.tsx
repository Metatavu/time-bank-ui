/* eslint-disable require-jsdoc */
import { Box, TextField } from "@mui/material";
import { CalendarPickerView, DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useAppSelector } from "app/hooks";
import { selectLocale } from "features/locale/locale-slice";
import strings from "localization/strings";
import React, { useState } from "react";
import fiLocale from "date-fns/locale/fi";
import enLocale from "date-fns/locale/en-US";
import useTestDateRangePickerStyles from "styles/generics/date-range-picker/test-date-range-picker";

/**
 * Component properties
 */
interface Props {
  dateFormat: string;
  selectedFilteredStartDate: Date;
  selectedFilteredEndDate: Date;
  startWeek?: number | null;
  endWeek?: number | null;
  datePickerView: CalendarPickerView;
  onStartDateChange: (value: Date | null) => void;
  onEndDateChange: (value: Date | null) => void;
  onStartWeekChange: (weekNumber: number) => void;
  onEndWeekChange: (weekNumber: number) => void;
}

const DateFilterPicker: React.FC<Props> = ({
  dateFormat,
  selectedFilteredStartDate,
  selectedFilteredEndDate,
  datePickerView,
  onStartDateChange,
  onEndDateChange
}) => {
  const classes = useTestDateRangePickerStyles();
  const { locale } = useAppSelector(selectLocale);
  const [pickerLocale, setPickerLocale] = useState(enLocale);

  /**
   * Initialize the language
   */
  React.useEffect(() => {
    locale === "fi" ? setPickerLocale(fiLocale) : setPickerLocale(enLocale);
  }, [locale]);

  /**
   * Renders start date picker 
   */
  const renderStartDatePicker = () => {
    const { filterStartingDate } = strings.editorContent;

    return (
      <>
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={pickerLocale} >
          <DatePicker
            disablePast
            views={[datePickerView]}
            inputFormat={dateFormat}
            label={filterStartingDate}
            value={selectedFilteredStartDate}
            onChange={onStartDateChange}
            className={classes.datePicker}
            renderInput={params => <TextField {...params}/>}
          />
        </LocalizationProvider>
      </>
    );
  };

  /**
   * Renders end date picker
   */
  const renderEndDatePicker = () => (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={pickerLocale} >
      <DatePicker
        disablePast
        minDate={selectedFilteredStartDate}
        inputFormat={dateFormat}
        views={[datePickerView]}
        label={strings.editorContent.filterEndingDate}
        value={selectedFilteredEndDate}
        onChange={onEndDateChange}
        className={classes.datePicker}
        renderInput={params => <TextField {...params}/>}
      />
    </LocalizationProvider>
  );

  return (
    <>
      <Box display="flex" gap="10px">
        {renderStartDatePicker()}
        {renderEndDatePicker()}
      </Box>
    </>
  );
};

export default DateFilterPicker;