import { makeStyles } from "@material-ui/core";
import theme from "theme/theme";

export const useMainScreenStyles = makeStyles({

  drawerContainer: {
    height: "100%",
    width: "100%",
    padding: `${theme.spacing(1)}px ${theme.spacing(4)}px`
  },

  editorContainer: {
    height: "100%",
    width: "100%",
    padding: `${theme.spacing(1)}px ${theme.spacing(4)}px`
  }

}, {
  name: "main-screen"
});