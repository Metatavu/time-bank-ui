import makeStyles from "@mui/styles/makeStyles";

const useEditorContentStyles = makeStyles(theme => ({

  emptyFilterContainer: {
    borderRadius: 10,
    width: "100%",
    height: 72,
    display: "flex",
    alignItems: "center",
    padding: `0px ${theme.spacing(3)}`,
    [theme.breakpoints.down(1921)]: {
      "& .MuiTypography-root": {
        fontSize: "0.9rem"
      }
    }
  },

  filterAccordion: {
    borderRadius: "10px !important",
    boxShadow: "0px 3px 3px -2px rgb(0, 0, 0, 0.2), 0px 3px 4px 0px rgba(0,0,0,0.14), 0px 1px 8px 0px rgb(0,0,0,0.12)"
  },

  filterSummary: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(4),
    "&.Mui-expanded": {
      borderBottom: "1px solid rgba(0, 0, 0, 0.2)"
    }
  },

  filterContent: {
    height: 100,
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(4),
    justifyContent: "space-between"
  },

  scopeSelector: {
    width: 200,
    borderRadius: "10px !important"
  },

  notchedOutline: {
    borderColor: "rgba(0, 0, 0)"
  },

  chartsContainer: {
    marginTop: theme.spacing(2),
    width: "100%",
    borderRadius: "10px !important",
    padding: theme.spacing(4)
  },
  
  startDateOnly: {
    marginLeft: theme.spacing(5),
    display: "flex",
    alignItems: "center"
  },
  
  filterSubtitle: {
    display: "flex",
    height: "100%",
    alignItems: "center",
    marginLeft: "auto"
  },

  vacationDaysSubtitle: {
    display: "flex",
    height: "100%",
    alignItems: "center",
    marginLeft: "auto"
  },

  vacationDaysAccordion: {
    marginTop: theme.spacing(2),
    borderRadius: "10px !important",
    boxShadow: "0px 3px 3px -2px rgb(0, 0, 0, 0.2), 0px 3px 4px 0px rgba(0,0,0,0.14), 0px 1px 8px 0px rgb(0,0,0,0.12)"
  },

  vacationDaysSummary: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(4),
    "&.Mui-expanded": {
      borderBottom: "1px solid rgba(0, 0, 0, 0.2)"
    }
  },

  vacationContent: {
    height: "100%",
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(2),
    borderBottom: "1px solid rgba(0, 0, 0, 0.2)"
  },

  vacationInfoContent: {
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing(2)
  },

  vacationList: {
    columnCount: 1,
    columnFill: "auto",
    border: "1px solid #000",
    height: 250,
    marginLeft: theme.spacing(2),
    padding: theme.spacing(1),
    display: "inline-block"
  },

  vacationDetailsContent: {
    display: "flex",
    height: "100%",
    flexDirection: "column",
    alignItems: "center",
    gap: "10px",
    padding: theme.spacing(2),
    marginTop: "10px"
  },

  overViewChartContainer: {
    width: "100%",
    paddingBottom: theme.spacing(2),
    justifyContent: "center",
    alignItems: "center"
  },

  totalChartContainer: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },

  datePickers: {
    marginLeft: "auto",
    display: "flex",
    alignItems: "center"
  },

  testDatePickers: {
    marginLeft: "auto",
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(2)
  },

  navBarContainer: {
    color: "white",
    backgroundColor: "gray",
    margin: "-32px",
    marginBottom: "0px",
    paddingTop: "0px"
  },

  deleteButton: {
    padding: "0px !important",
    alignSelf: "center",
    color: "#F9473B",
    marginLeft: theme.spacing(1)
  },

  closeButton: {
    padding: "0px !important",
    alignSelf: "flex-end",
    marginLeft: theme.spacing(1)
  },

  employeeVacationRequests: {
    marginTop: theme.spacing(2),
    padding: theme.spacing(2),
    borderRadius: "10px !important",
    backgroundColor: "white",
    boxShadow: "0px 3px 3px -2px rgb(0, 0, 0, 0.2), 0px 3px 4px 0px rgba(0,0,0,0.14), 0px 1px 8px 0px rgb(0,0,0,0.12)"
  }

}), {
  name: "editor-content"
});

export default useEditorContentStyles;