import { makeStyles } from "@material-ui/core";
import theme from "theme/theme";

const drawerWidth = 400;

export const useEditorContentStyles = makeStyles({

  filterContainer: {
    width: "100%",
    height: 72,
    display: "flex",
    alignItems: "center",
    padding: `0px ${theme.spacing(3)}px`
  },

  overviewContainer: {
    marginTop: theme.spacing(6),
    width: "100%",
    height: 1200
  }

}, {
  name: "editor-content"
});