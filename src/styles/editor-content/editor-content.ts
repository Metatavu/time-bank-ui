import { makeStyles } from "@material-ui/core";
import theme from "theme/theme";

export const useEditorContentStyles = makeStyles({

  filterContainer: {
    width: "100%",
    height: 72,
    display: "flex",
    alignItems: "center",
    padding: `0px ${theme.spacing(3)}px`,
  },
  selectScope: {
    width: "10rem",
    marginRight: "1rem",
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
  
}, {
  name: "editor-content"
});