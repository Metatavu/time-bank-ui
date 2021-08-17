import { makeStyles } from "@material-ui/core";
import theme from "theme/theme";

export const useEditorContentStyles = makeStyles({

  emptyFilterContainer: {
    width: "100%",
    height: 72,
    display: "flex",
    alignItems: "center",
    padding: `0px ${theme.spacing(3)}px`,
  },

  filterSummary: {
    height: 72,
    display: "flex",
    alignItems: "center",
    padding: `0px ${theme.spacing(3)}px`,
    "&.Mui-expanded": {
      borderBottom: "1px solid rgba(0, 0, 0, 0.2)"
    }
  },

  filterContent: {
    height: 100,
    display: "flex", 
    alignItems: "center",
    padding: theme.spacing(3),
    paddingLeft: theme.spacing(5)
  },

  datePickers: {
    marginLeft: "auto",
    display: "flex", 
    alignItems: "center",
  },

  scopeSelector: {
    width: 120
  },

  notchedOutline: {
    borderColor: "rgba(0, 0, 0)"
  },

  datePicker: {
    width: 200,
    marginRight: theme.spacing(2),
    //todo move to theme
    "& .MuiInputLabel-root": {
      color: "rgba(0, 0, 0, 0.54)"
    },
  },

  yearPicker: {
    width: 120,
    marginRight: theme.spacing(2),
    //todo move to theme
    "& .MuiInputLabel-root": {
      color: "rgba(0, 0, 0, 0.54)"
    },
  },

  chartContainer: {
    marginTop: theme.spacing(6),
    width: "100%",
    height: 1200
  },
  
  startDateOnly: {
    marginLeft: theme.spacing(5),
    display: "flex",
    alignItems: "center"  
  },

  weekPicker: {
    width: 110,
    marginRight: theme.spacing(2),
    //todo move to theme
    "& .MuiFormLabel-root": {
      color: "rgba(0, 0, 0, 0.54)"
    }
  },
  
  filterSubtitle: {
    display: "flex", 
    height: "100%",
    alignItems: "center",
    marginLeft: "auto"
  },

  overViewContainer: {
    padding: `${theme.spacing(3)}px ${theme.spacing(4)}px`
  },

  totalContainer: {
    padding: `${theme.spacing(3)}px ${theme.spacing(4)}px`
  }
  
}, {
  name: "editor-content"
});