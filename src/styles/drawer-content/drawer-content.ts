import { makeStyles } from "@material-ui/core";
import theme from "theme/theme";

const drawerWidth = 400;

export const useDrawerContentStyles = makeStyles({

  root: {
    display: "flex",
    justifyContent: "space-between"
  },

  searchBoxContaienr: {
    position: "relative"
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
    borderRadius: 20,
    fontSize: 14,
    padding: theme.spacing(1),
    paddingLeft: theme.spacing(3)
  },

  saerchButton: {
    height: 40,
    width: 75,
    borderRadius: 20,
    color: theme.palette.primary.light,
    backgroundColor: theme.palette.primary.main,
  }

}, {
  name: "drawer-content"
});