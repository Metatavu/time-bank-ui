import { makeStyles } from "@material-ui/core";
import theme from "theme/theme";

const useDrawerContentStyles = makeStyles({

  drawerSearchBoxContainer: {
    display: "flex",
    alignItems: "center",
    position: "fixed",
    zIndex: 100,
    marginTop: theme.spacing(2),
    [theme.breakpoints.down("sm")]: {
      width: "90%"
    }
  },

  searchBoxContainer: {
    height: 40,
    width: 350,
    backgroundColor: "rgb(255, 255, 255)"
  },

  noUserContainer: {
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },

  drawerUserInfoContainer: {
    display: "flex",
    alignItems: "center",
    margin: theme.spacing(2),
    marginTop: theme.spacing(9)
  },

  searchIcon: {
    top: "50%",
    color: "rgba(0, 0, 0, 0.8)",
    left: theme.spacing(1),
    position: "absolute",
    transform: "translateY(-50%)"
  },

  searchBox: {
    height: "100%",
    width: "100%"
  },

  drawerAccordion: {
    boxShadow: "none"
  },

  accordionDetails: {
    display: "flex",
    flexDirection: "column"
  },

  accordionRow: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: theme.spacing(1)
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
    boxShadow: "0 4px 4px 0 rgba(0,0,0,0.05)",
    fontSize: 14,
    border: "1px solid rgba(0, 0, 0)",
    "&.Mui-focused": {
      border: "0px solid rgba(0, 0, 0)"
    }
  },

  input: {
    paddingLeft: `${theme.spacing(4)}px !important`
  },

  pieChartContainer: {
    height: "150px !important",
    "& .recharts-wrapper .recharts-surface": {
      overflow: "visible"
    }
  }

}, {
  name: "drawer-content"
});

export default useDrawerContentStyles;