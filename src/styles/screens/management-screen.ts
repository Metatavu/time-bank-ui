import { makeStyles } from "@material-ui/core";
import theme from "theme/theme";

const useManagementScreenStyles = makeStyles({

  root: {
    display: "flex",
    justifyContent: "center",
    overflow: "auto",
    overflowX: "hidden",
    height: "calc(100vh - 64px)",
    width: "100%",
    padding: theme.spacing(7),
    position: "relative"
  },

  loadingContainer: {
    height: "100%",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },

  redirectLinkPaper: {
    position: "absolute",
    bottom: theme.spacing(8),
    left: theme.spacing(8),
    padding: `${theme.spacing(1)}px ${theme.spacing(1.3)}px`,
    borderRadius: "10px !important",
    boxShadow: "0px 3px 3px -2px rgb(0, 0, 0, 0.2), 0px 3px 4px 0px rgba(0,0,0,0.14), 0px 1px 8px 0px rgb(0,0,0,0.12)"
  },

  timeListContainer: {
    width: "55%"
  },

  personEntrySubtitle: {
    display: "flex",
    marginLeft: "auto",
    marginRight: theme.spacing(2)
  },

  personRedirect: {
    borderRadius: 0,
    height: "100%",
    width: 60
  },

  personEntry: {
    width: "100%",
    borderRadius: "10px !important",
    boxShadow: "0px 3px 3px -2px rgb(0, 0, 0, 0.2), 0px 3px 4px 0px rgba(0,0,0,0.14), 0px 1px 8px 0px rgb(0,0,0,0.12)",
    marginBottom: theme.spacing(2),
    height: 72,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: theme.spacing(4)
  },

  userInfoContainer: {
    display: "flex"
  },

  editorContainer: {
    height: "100%",
    width: "calc(100vw - 400px)",
    padding: theme.spacing(4),
    scrollbarWidth: "auto"
  }

}, {
  name: "main-screen"
});

export default useManagementScreenStyles;