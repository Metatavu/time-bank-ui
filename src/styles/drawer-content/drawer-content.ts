import { makeStyles } from "@material-ui/core";
import theme from "theme/theme";

const useDrawerContentStyles = makeStyles({

  drawerSearchBoxContainer: {
    display: "flex",
    alignItems: "center",
    margin: `${theme.spacing(2)}px 0px`,
    marginTop: 30
  },

  drawerUserInfoContainer: {
    display: "flex",
    alignItems: "center",
    margin: theme.spacing(2),
    marginTop: 30
  },

  searchBoxContainer: {
    height: 40,
    flexGrow: 200,
    position: "fixed",
    zIndex: 100,
    width: 350,
    backgroundColor: "rgb(255, 255, 255)",
    [theme.breakpoints.down("sm")]: {
      width: "90%"
    }
  },

  searchIcon: {
    top: "50%",
    color: "rgba(0, 0, 0, 0.8)",
    left: theme.spacing(1),
    position: "absolute",
    transform: "translateY(-50%)"
  },

  searchBox: {
    height: "100%",
    width: "100%"
  },

  drawerAccordin: {
    boxShadow: "none"
  },

  accordinRow: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: theme.spacing(1)
  },

  accordinRowNames: {
    fontSize: 14,
    fontWeight: 600,
    [theme.breakpoints.down("sm")]: {
      fontSize: 16
    }
  },

  accordinRowValues: {
    fontSize: 14,
    fontStyle: "italic",
    [theme.breakpoints.down("sm")]: {
      fontSize: 16
    }
  },

  inputRoot: {
    height: 40,
    borderRadius: 20,
    boxShadow: "0 4px 4px 0 rgba(0,0,0,0.05)",
    fontSize: 14
  },

  input: {
    paddingLeft: `${theme.spacing(4)}px !important`
  }

}, {
  name: "drawer-content"
});

export default useDrawerContentStyles;