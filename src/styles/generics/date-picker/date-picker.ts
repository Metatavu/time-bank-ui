import makeStyles from "@mui/styles/makeStyles";

const useDatePickerStyles = makeStyles(theme => ({

  datePicker: {
    width: 230,
    marginLeft: theme.spacing(0),
    "& .MuiInputLabel-root": {
      color: "rgba(0, 0, 0, 0.54)"
    }
  }

}), {
  name: "date-picker"
});

export default useDatePickerStyles;