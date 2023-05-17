import makeStyles from "@mui/styles/makeStyles";
import { alpha } from "@mui/material/styles";

const useManagementScreenStyles = makeStyles(theme => ({

  root: {
    height: "calc(100vh - 64px)",
    width: "calc(100vw - 400px)",
    margin: "auto",
    paddingTop: theme.spacing(3),
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
    width: "100%"
  },

  searchIcon: {
    position: "absolute",
    left: theme.spacing(-5),
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
    marginTop: theme.spacing(3),
    height: "150px !important",
    "& .recharts-wrapper .recharts-surface": {
      overflow: "visible"
    }
  },

  redirectPersonDetailPaper: {
    width: `calc((55vw - 2 * ${theme.spacing(8)}) / 2)`,
    position: "absolute",
    top: theme.spacing(14),
    right: theme.spacing(6),
    padding: `${theme.spacing(4)} ${theme.spacing(6)} ${theme.spacing(8)}`,
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
    [theme.breakpoints.down("md")]: {
      fontSize: 16
    }
  },

  expectedWorkValues: {
    fontSize: 14,
    fontStyle: "italic",
    [theme.breakpoints.down("md")]: {
      fontSize: 16
    }
  },

  billableHours: {
    fontSize: 14,
    fontStyle: "italic",
    [theme.breakpoints.down("md")]: {
      fontSize: 16
    }
  },

  updateBillableHoursContent: {
    margin: theme.spacing(1),
    alignItems: "center",
    textAlign: "center"
  },

  redirectLinkPaper: {
    position: "absolute",
    bottom: theme.spacing(8),
    left: theme.spacing(-8),
    padding: `${theme.spacing(1)} ${theme.spacing(1.3)}`,
    borderRadius: "10px !important",
    boxShadow: "0px 3px 3px -2px rgb(0, 0, 0, 0.2), 0px 3px 4px 0px rgba(0,0,0,0.14), 0px 1px 8px 0px rgb(0,0,0,0.12)"
  },

  timeListContainer: {
    width: "100%",
    minHeight: "100%"
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

  personRedirectBox: {
    display: "flex",
    flexDirection: "row"
  },

  personRedirectButton: {
    height: "100%",
    width: "75%",
    justifyContent: "flex-end",
    padding: theme.spacing(2),
    borderRadius: "0px 0px 10px 10px"
  },

  personCloseButton: {
    height: "100%",
    width: "25%",
    justifyContent: "flex-start",
    padding: theme.spacing(2),
    borderRadius: "0px 0px 10px 10px"
  },

  personListEntry: {
    width: "30%",
    backgroundColor: "transparent !important",
    "&.Mui-selected .MuiPaper-root": {
      border: `3px solid ${alpha(theme.palette.secondary.main, 0.8)}`
    }
  },

  personEntry: {
    width: "100%",
    borderRadius: "10px !important",
    boxShadow: "0px 3px 3px -2px rgb(0, 0, 0, 0.2), 0px 3px 4px 0px rgba(0,0,0,0.14), 0px 1px 8px 0px rgb(0,0,0,0.12)",
    marginBottom: theme.spacing(1),
    height: 326,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
    paddingTop: theme.spacing(6)
  },

  personEntryDate: {
    fontSize: 18,
    fontStyle: "normal",
    padding: "0 !important"
  },

  personEntryTime: {
    fontSize: 24,
    marginLeft: theme.spacing(1),
    fontWeight: 600,
    justifyContent: "flex-end"
  },

  userInfoContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },

  editorContainer: {
    height: "100%",
    width: "calc(100vw)",
    padding: theme.spacing(4),
    overflow: "hidden"
  },

  navBarContainer: {
    color: "white",
    backgroundColor: "gray",
    marginBottom: "0px",
    paddingTop: "0px"
  }

}), {
  name: "management-screen"
});

export default useManagementScreenStyles;