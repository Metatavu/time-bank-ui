import { makeStyles } from "@material-ui/core";

const drawerWidth = 400;

const useMainScreenStyles = makeStyles(theme => ({

  scrollableContainer: {
    overflow: "auto",
    overflowX: "hidden",
    height: "calc(100vh - 64px)",
    width: "100%"
  },

  drawerContainer: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    width: drawerWidth,
    padding: theme.spacing(2),
    [theme.breakpoints.down("xs")]: {
      padding: theme.spacing(1)
    },
    [theme.breakpoints.down("sm")]: {
      width: "100%"
    }
  },

  scrollableEditorContainer: {
    overflow: "auto",
    overflowX: "hidden",
    height: "calc(100vh - 64px)",
    width: "calc(100vw - 400px)",
    [theme.breakpoints.down("sm")]: {
      display: "none"
    }
  },

  editorContainer: {
    height: "100%",
    width: "calc(100vw - 400px)",
    padding: theme.spacing(4),
    scrollbarWidth: "auto"
  }

}), {
  name: "main-screen"
});

export default useMainScreenStyles;