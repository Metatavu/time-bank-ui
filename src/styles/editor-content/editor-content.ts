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
  },

  datePickers: {
    marginLeft: "auto",
    display: "flex", 
    alignItems: "center",
  },

  scopeSelector: {
    width: 120
  },

  datePicker: {
    width: 200,
    float: "right",
    marginRight: theme.spacing(2),
    "& .MuiInputLabel-root": {
      color: "rgba(0, 0, 0, 0.54)"
    },
  },

  overviewContainer: {
    marginTop: theme.spacing(6),
    width: "100%",
    height: 1200
  },
  
  weekPicker: {
    width: 120,
    marginRight: theme.spacing(2),
    "& .MuiFormLabel-root": {
      color: "rgba(0, 0, 0, 0.54)"
    }
  },
  
  filterSubtitle: {
    display: "flex", 
    height: "100%",
    alignItems: "center",
    marginLeft: "auto"
  }
}, {
  name: "editor-content"
});