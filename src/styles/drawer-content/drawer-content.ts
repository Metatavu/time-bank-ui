import { makeStyles } from "@material-ui/core";
import theme from "theme/theme";

const useDrawerContentStyles = makeStyles({

  drawerSearchBoxContainer: {
    display: "flex",
    alignItems: "center",
    margin: `${theme.spacing(2)}px 0px`
  },

  drawerUserInfoContainer: {
    display: "flex",
    alignItems: "center",
    margin: theme.spacing(2)
  },

  searchBoxContainer: {
    height: 40,
    flexGrow: 200,
    position: "relative"
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
      fontSize: 18
    }
  },

  accordinRowValues: {
    fontSize: 14,
    fontStyle: "italic",
    [theme.breakpoints.down("sm")]: {
      fontSize: 18
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
  },

  searchButton: {
    height: 40,
    width: 75,
    marginLeft: theme.spacing(1),
    display: "flex",
    justifyContent: "center",
    "& .MuiButton-label": {
      fontSize: 12
    }
  }

}, {
  name: "drawer-content"
});
export default useDrawerContentStyles;