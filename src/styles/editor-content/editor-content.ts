import { makeStyles } from "@material-ui/core";
import theme from "theme/theme";

export const useEditorContentStyles = makeStyles({

  filterContainer: {
    width: "100%",
    height: 72,
    display: "flex",
    alignItems: "center",
    padding: `0px ${theme.spacing(3)}px`,
    "& h4": {
      fontWeight: 600,
      fontStyle: "italic"
    },
    "& h5": {
      fontSize: "0.8rem"
    }
  },
  selectScope: {
    width: "7rem",
    marginRight: "2rem",
    marginLeft: "2rem",
  },
  timeFilter: {
    width: "15rem",
    float: "right",
    marginLeft: "1rem",
    marginRight: "1rem",
  },
  overviewContainer: {
    marginTop: theme.spacing(6),
    width: "100%",
    height: 1200
  },
  selectWeekNumbers: {
    width: "5rem",
    marginRight: "2rem",
    "& p": {
      color: "rgba(0, 0, 0, 0.54)"
    }
  },
  filtersContainer: {
    marginLeft: "auto", 
    display: "flex", 
    alignItems: "center",
    width: "45rem" 
  }
  
}, {
  name: "editor-content"
});