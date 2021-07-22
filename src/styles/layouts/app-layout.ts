import { makeStyles } from "@material-ui/core";
import theme from "theme/theme";

const drawerWidth = 400;

export const useEditorLayoutStyles = makeStyles({

  root: {
    backgroundColor: theme.palette.background.default,
    height: "100vh",
    width: "100vw",
    display: "flex"
  },

  drawer: {
    width: drawerWidth,
    height: "100%"
  },

  drawerPaper: {
    width: drawerWidth,
    backgroundColor: theme.palette.background.default
  },

  content: {
    flexGrow: 1
  }

}, {
  name: "editor-layout"
});