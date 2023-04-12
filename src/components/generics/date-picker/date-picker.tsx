import React from "react";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { Box, TextField } from "@mui/material";
import strings from "localization/strings";
import fiLocale from "date-fns/locale/fi";
import enLocale from "date-fns/locale/en-US";
import { useAppSelector } from "app/hooks";
import { selectLocale } from "features/locale/locale-slice";
import useDatePickerStyles from "styles/generics/date-picker/date-picker";

/**
 * Component properties
 */
interface Props {
  dateFormat?: string;
  selectedStartDate: unknown;
  onStartDateChange: (value: unknown) => void;
}

/**
 * Generic date picker component
 */
const GenericDatePicker: React.FC<Props> = ({
  dateFormat,
  selectedStartDate,
  onStartDateChange
}) => {
  const classes = useDatePickerStyles();

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
    const { syncStart } = strings.syncHandling;

    return (
      <LocalizationProvider dateAdapter={ AdapterDateFns } adapterLocale={ pickerLocale } >
        <DatePicker
          disableFuture
          minDate={new Date(2021, 7, 31)}
          inputFormat={ dateFormat }
          maxDate={ todayDate }
          label={ syncStart }
          value={ selectedStartDate }
          onChange={ onStartDateChange }
          className={ classes.datePicker }
          renderInput={ params => <TextField {...params}/>}
        />
      </LocalizationProvider>
    );
  };
  
  /**
   * Component render
   */
  return (
    <Box display="flex" alignItems="center">
      { renderStartDatePicker() }
    </Box>
  );
};

export default GenericDatePicker;