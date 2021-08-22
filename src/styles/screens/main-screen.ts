import { makeStyles } from "@material-ui/core";
import theme from "theme/theme";

const drawerWidth = 400;

const useMainScreenStyles = makeStyles({

  scrollableContainer: {
    overflow: "auto",
    overflowX: "hidden",
    height: "calc(100vh - 64px)",
    width: "100%",
    scrollbarWidth: "auto",
    scrollbarColor: "rgba(0,0,0,0.3) transparent",
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "rgba(0,0,0,0.5)",
      border: "none"
    },
    "&::-webkit-scrollbar-track": {
      backgroundColor: "transparent",
      color: "transparent",
      border: "none"
    }
  },

  drawerContainer: {
    width: drawerWidth,
    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px ${theme.spacing(1)}px ${theme.spacing(3)}px`,
    [theme.breakpoints.down("xs")]: {
      padding: `${theme.spacing(1)}px ${theme.spacing(2)}px ${theme.spacing(1)}px ${theme.spacing(1)}px`
    },
    [theme.breakpoints.down("sm")]: {
      width: "100%"
    }
  },

  editorContainer: {
    padding: `${theme.spacing(5)}px ${theme.spacing(6)}px`,
    width: "calc(100vw - 400px)",
    [theme.breakpoints.down("sm")]: {
      display: "none"
    }
  }

}, {
  name: "main-screen"
});

export default useMainScreenStyles;