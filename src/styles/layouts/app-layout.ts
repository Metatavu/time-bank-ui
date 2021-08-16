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
    top: 64,
    width: drawerWidth,
    height: "100%",
  },

  drawerPaper: {
    width: drawerWidth,
    backgroundColor: theme.palette.background.paper,
    boxShadow: `
      0 10px 16px 0 rgba(0,0,0,0.2),
      0 6px 20px 0 rgba(0,0,0,0.19)
    `
  },

  content: {
    backgroundColor: theme.palette.background.default,
    flexGrow: 1,
    overflowX: "hidden",
    width: "calc(100vw - 400px)"
  },

  titleContainer: {
    display: "flex",
    alignItems: "center"
  },

  title: {
    marginLeft: theme.spacing(2),
    fontSize: 18,
    fontWeight: 600, 
  },

  logo: {
    maxHeight: 76,
    marginLeft: 15,
    padding: 5
  }

}, {
  name: "app-layout"
});