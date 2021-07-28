import { makeStyles } from "@material-ui/core";
import theme from "theme/theme";

const drawerWidth = 400;

export const useDrawerContentStyles = makeStyles({

  root: {
    display: "flex",
    alignItems: "center",
    margin: `${theme.spacing(2)}px 0px`,
  },

  searchBoxContaienr: {
    height: 40,
    flexGrow: 200,
    position: "relative",
  },

  searchIcon: {
    top: "50%",
    color: "rgba(0, 0, 0, 0.8)",
    left: theme.spacing(1),
    position: "absolute",
    transform: "translateY(-50%)",
  },

  searchBox: {
    height: "100%",
    width: "100%",
    "& div div": {
      height: 40,
      border: 4,
      borderRadius: 20,
      boxShadow: "0 4px 4px 0 rgba(0,0,0,0.05)",
      fontSize: 14,
      "& input": {
        padding: `${theme.spacing(1)}px !important`,
        paddingLeft: `${theme.spacing(4)}px !important`
      }
    }
  },

  searchButton: {
    height: 40,
    width: 75,
    marginLeft: theme.spacing(1),
    display: "flex",
    justifyContent: "center",
    "& .MuiButton-label": {
      fontSize: 12,
    },
  }

}, {
  name: "drawer-content"
});