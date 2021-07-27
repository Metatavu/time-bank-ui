import { makeStyles } from "@material-ui/core";
import theme from "theme/theme";

const drawerWidth = 400;

export const useDrawerContentStyles = makeStyles({

  root: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },

  searchBoxContaienr: {
    position: "relative",
  },

  searchIcon: {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    left: theme.spacing(1)
  },

  searchBox: {
    height: 40,
    width: 230,
    "& div div": {
      height: 40,
      borderRadius: 20,
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
    display: "flex",
    justifyContent: "center",
    borderRadius: 20,
    color: theme.palette.primary.light,
    backgroundColor: theme.palette.primary.main,
  }

}, {
  name: "drawer-content"
});