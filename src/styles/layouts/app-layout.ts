import { makeStyles } from "@material-ui/core";
import theme from "theme/theme";

const drawerWidth = 400;

export const useAppLayoutStyles = makeStyles({

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
    backgroundColor: theme.palette.background.paper
  },

  content: {
    backgroundColor: theme.palette.background.default,
    flexGrow: 1
  }

}, {
  name: "app-layout"
});