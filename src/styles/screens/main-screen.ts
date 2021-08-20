import { makeStyles } from "@material-ui/core";
import theme from "theme/theme";

const useMainScreenStyles = makeStyles({

  drawerContainer: {
    height: "100%",
    padding: `${theme.spacing(1)}px ${theme.spacing(4)}px`,
    [theme.breakpoints.down("xs")]: {
      padding: `${theme.spacing(1)}px ${theme.spacing(1)}px`
    }
  },

  editorContainer: {
    padding: `${theme.spacing(5)}px ${theme.spacing(6)}px`,
    width: "calc(100vw - 400px)",
    [theme.breakpoints.down("sm")]: {
      display: "none"
    },
  }

}, {
  name: "main-screen"
});

export default useMainScreenStyles;