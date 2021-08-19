import { makeStyles } from "@material-ui/core";
import theme from "theme/theme";

export default makeStyles({

  drawerContainer: {
    height: "100%",
    width: "100%",
    padding: `${theme.spacing(1)}px ${theme.spacing(4)}px`
  },

  editorContainer: {
    padding: `${theme.spacing(5)}px ${theme.spacing(6)}px`,
    width: "calc(100vw - 400px)"
  }

}, {
  name: "main-screen"
});