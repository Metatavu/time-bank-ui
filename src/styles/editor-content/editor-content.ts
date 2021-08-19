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

  scopeSelector: {
    width: 120
  },

  notchedOutline: {
    borderColor: "rgba(0, 0, 0)"
  },


  chartsContainer: {
    marginTop: theme.spacing(6),
    width: "100%",
  },
  
  startDateOnly: {
    marginLeft: theme.spacing(5),
    display: "flex",
    alignItems: "center"  
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

  overViewChartContainer: {
    width: "100%",
    height: 450,
    paddingTop: theme.spacing(5),
    paddingBottom: theme.spacing(5),
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },

  totalContainer: {
    padding: `${theme.spacing(3)}px ${theme.spacing(4)}px`
  },

  totalChartContainer: {
    width: "100%",
    height: 250,
    paddingTop: theme.spacing(5),
    paddingBottom: theme.spacing(2),
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },

  datePickers: {
    marginLeft: "auto",
    display: "flex", 
    alignItems: "center",
  },

}, {
  name: "editor-content"
});