import { makeStyles } from "@material-ui/core";
import theme from "theme/theme";

export default makeStyles({

  datePicker: {
    width: 200,
    marginRight: theme.spacing(2),
    "& .MuiInputLabel-root": {
      color: "rgba(0, 0, 0, 0.54)"
    },
  },

  yearPicker: {
    width: 120,
    marginRight: theme.spacing(2),
    "& .MuiInputLabel-root": {
      color: "rgba(0, 0, 0, 0.54)"
    },
  },

  weekPicker: {
    width: 110,
    marginRight: theme.spacing(2),
  },

}, {
  name: "date-range-picker"
});
