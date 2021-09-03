import { makeStyles } from "@material-ui/core";
import { fade } from "@material-ui/core/styles/colorManipulator";
import theme from "theme/theme";

const useManagementScreenStyles = makeStyles({

  root: {
    height: "calc(100vh - 64px)",
    width: "100%",
    position: "relative"
  },

  mainContent: {
    height: "100%",
    width: "100%",
    overflow: "auto",
    overflowX: "hidden",
    display: "flex",
    justifyContent: "center",
    padding: theme.spacing(6)
  },

  searchContainer: {
    width: `calc((45vw - 2 * ${theme.spacing(8)}px) / 2)`,
    position: "absolute",
    top: theme.spacing(8),
    left: theme.spacing(8),
    padding: `0px ${theme.spacing(1)}px`
  },

  searchIcon: {
    position: "absolute",
    left: theme.spacing(2),
    transform: "translateY(50%)",
    bottom: "50%"
  },

  searchTextField: {
    width: "100%",
    backgroundColor: "#FFF",
    borderRadius: "20px"
  },

  loadingContainer: {
    height: "100%",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },

  pieChartContainer: {
    height: "150px !important",
    "& .recharts-wrapper .recharts-surface": {
      overflow: "visible"
    }
  },

  redirectPersonDetailPaper: {
    width: `calc((45vw - 2 * ${theme.spacing(8)}px) / 2)`,
    position: "absolute",
    top: theme.spacing(8),
    right: theme.spacing(8),
    padding: `${theme.spacing(4)}px ${theme.spacing(6)}px ${theme.spacing(8)}px`,
    borderRadius: "10px !important",
    boxShadow: "0px 3px 3px -2px rgb(0, 0, 0, 0.2), 0px 3px 4px 0px rgba(0,0,0,0.14), 0px 1px 8px 0px rgb(0,0,0,0.12)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },

  expectedWorkRow: {
    display: "flex",
    justifyContent: "space-between"
  },

  expectedWorkNames: {
    fontSize: 14,
    fontWeight: 600,
    [theme.breakpoints.down("sm")]: {
      fontSize: 16
    }
  },

  expectedWorkValues: {
    fontSize: 14,
    fontStyle: "italic",
    [theme.breakpoints.down("sm")]: {
      fontSize: 16
    }
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
    width: "55%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },

  personEntrySubtitle: {
    display: "flex",
    marginLeft: "auto",
    marginRight: theme.spacing(2)
  },

  personRedirect: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    display: "flex",
    flexDirection: "column"
  },

  personRedirectButton: {
    height: "100%",
    width: "100%",
    padding: theme.spacing(2),
    display: "flex",
    justifyContent: "flex-end",
    borderRadius: "0px 0px 10px 10px"
  },

  personListEntry: {
    width: "100%",
    backgroundColor: "transparent !important",
    "&.Mui-selected .MuiPaper-root": {
      border: `3px solid ${fade(theme.palette.secondary.main, 0.8)}`
    }
  },

  personEntry: {
    width: "100%",
    borderRadius: "10px !important",
    boxShadow: "0px 3px 3px -2px rgb(0, 0, 0, 0.2), 0px 3px 4px 0px rgba(0,0,0,0.14), 0px 1px 8px 0px rgb(0,0,0,0.12)",
    marginBottom: theme.spacing(1),
    height: 72,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: theme.spacing(3)
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