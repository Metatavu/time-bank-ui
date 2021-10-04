import { makeStyles } from "@material-ui/core";

const drawerWidth = 400;

const useAppLayoutStyles = makeStyles(theme => ({

  root: {
    backgroundColor: theme.palette.background.default,
    height: "100vh",
    width: "100vw",
    display: "flex"
  },
  
  loadingDialog: {
    height: "100%",
    width: "100%"
  },

  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },

  loadingText: {
    marginTop: theme.spacing(1),
    color: "#FFF"
  },

  drawer: {
    top: 64,
    width: drawerWidth,
    height: "100%",
    [theme.breakpoints.down("sm")]: {
      width: "100%"
    }
  },

  drawerPaper: {
    height: "100vh",
    width: drawerWidth,
    backgroundColor: theme.palette.background.paper,
    boxShadow: `
      0 10px 16px 0 rgba(0,0,0,0.2),
      0 6px 20px 0 rgba(0,0,0,0.19)
    `,
    [theme.breakpoints.down("sm")]: {
      width: "100%",
      padding: `0px ${theme.spacing(2)}px`
    }
  },

  content: {
    backgroundColor: theme.palette.background.default,
    flexGrow: 1,
    overflowX: "hidden",
    [theme.breakpoints.down("sm")]: {
      display: "none"
    }
  },

  titleContainer: {
    display: "flex",
    alignItems: "center"
  },

  title: {
    marginLeft: theme.spacing(2),
    color: theme.palette.text.secondary
  },

  logo: {
    maxHeight: 76,
    marginLeft: 15,
    padding: 5
  },

  settings: {
    marginLeft: "auto",
    display: "flex",
    alignItems: "center"
  },

  syncButton: {
    marginLeft: theme.spacing(5),
    color: "#fff",
    [theme.breakpoints.down("sm")]: {
      marginLeft: theme.spacing(3)
    },
    [theme.breakpoints.down("xs")]: {
      marginLeft: theme.spacing(2)
    }
  },

  languageSelect: {
    marginLeft: theme.spacing(5),
    color: "#fff",
    [theme.breakpoints.down("sm")]: {
      marginLeft: theme.spacing(3)
    },
    [theme.breakpoints.down("xs")]: {
      marginLeft: theme.spacing(2)
    }
  },

  syncDataText: {
    color: "white",
    textDecoration: "none",
    fontWeight: 600
  },

  managementLinkContainer: {
    marginLeft: theme.spacing(30),
    height: 64,
    paddingTop: theme.spacing(2)
  },

  managementLink: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    height: "100%",
    padding: `0px ${theme.spacing(4)}px`,
    alignItems: "center",
    display: "flex",
    borderRadius: "20px 20px 0px 0px"
  },

  activeManagementLink: {
    backgroundColor: "rgba(255, 255, 255) !important"
  },

  managementLinkText: {
    color: theme.palette.text.secondary,
    fontSize: 16,
    fontWeight: 600
  },

  activeManagementLinkText: {
    color: "rgba(0, 0, 0) !important"
  }

}), {
  name: "app-layout"
});

export default useAppLayoutStyles;