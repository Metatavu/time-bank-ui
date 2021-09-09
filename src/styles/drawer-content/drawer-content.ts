import { makeStyles } from "@material-ui/core";

const useDrawerContentStyles = makeStyles(theme => ({

  userInfoContainer: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(1),
    padding: `0px ${theme.spacing(2)}px`
  },

  searchBoxContainer: {
    width: "100%",
    height: 40,
    marginTop: theme.spacing(2)
  },

  noUserContainer: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },

  endAdornment: {
    top: "9px !important",
    paddingRight: `${theme.spacing(1)}px !important`
  },

  searchBox: {
    height: "100%",
    width: "100%"
  },

  drawerAccordion: {
    boxShadow: "none",
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.25)",
    borderTopLeftRadius: "30px !important",
    borderBottomRightRadius: "30px !important",
    borderStyle: "solid",
    marginTop: `${theme.spacing(2)}px !important`,
    padding: theme.spacing(2)
  },

  accordionDetails: {
    display: "flex",
    flexDirection: "column"
  },

  accordionRow: {
    display: "flex",
    justifyContent: "space-between"
  },

  accordionRowNames: {
    fontSize: 14,
    fontWeight: 600,
    [theme.breakpoints.down("sm")]: {
      fontSize: 16
    }
  },

  accordionRowValues: {
    fontSize: 14,
    fontStyle: "italic",
    [theme.breakpoints.down("sm")]: {
      fontSize: 16
    }
  },

  inputRoot: {
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgb(255, 255, 255)",
    boxShadow: "0 2px 8px 0 rgba(0,0,0,0.1)",
    fontSize: 14,
    "&.Mui-focused": {
      border: "0px solid rgba(0, 0, 0)"
    }
  },

  input: {
    paddingLeft: `${theme.spacing(2)}px !important`
  },

  pieChartContainer: {
    height: "150px !important",
    "& .recharts-wrapper .recharts-surface": {
      overflow: "visible"
    }
  },

  userDetailEntry: {
    display: "flex",
    width: "100%"
  },

  infoValue: {
    flex: 1
  }

}), {
  name: "drawer-content"
});

export default useDrawerContentStyles;