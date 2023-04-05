import makeStyles from "@mui/styles/makeStyles";

const useTestDateRangePickerStyles = makeStyles(theme => ({

  datePicker: {
    width: 200,
    marginLeft: theme.spacing(2),
    "& .MuiInputLabel-root": {
      color: "rgba(0, 0, 0, 0.54)"
    }
  },

  yearPicker: {
    width: 120,
    marginRight: theme.spacing(2),
    marginLeft: theme.spacing(2),
    "& .MuiInputLabel-root": {
      color: "rgba(0, 0, 0, 0.54)"
    }
  },

  weekPicker: {
    width: 60
  }

}), {
  name: "test-date-range-picker"
});

export default useTestDateRangePickerStyles;