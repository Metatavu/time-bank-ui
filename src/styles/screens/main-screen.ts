import { makeStyles } from "@material-ui/core";
import theme from "theme/theme";

const useMainScreenStyles = makeStyles({

  drawerContainer: {
    height: "100%",
    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px ${theme.spacing(1)}px ${theme.spacing(3)}px`,
    [theme.breakpoints.down("xs")]: {
      padding: `${theme.spacing(1)}px ${theme.spacing(2)}px ${theme.spacing(1)}px ${theme.spacing(1)}px`
    }
  },

  editorContainer: {
    [theme.breakpoints.down("sm")]: {
      display: "none"
    },
    width: "100%",
    padding: `${theme.spacing(5)}px ${theme.spacing(6)}px`
  }

}, {
  name: "main-screen"
});

export default useMainScreenStyles;