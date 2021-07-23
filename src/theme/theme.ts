import { createMuiTheme } from "@material-ui/core";

const breakpoints = createMuiTheme().breakpoints;

export default createMuiTheme({

  palette: {
    primary: {
      main: "#002D66",
      light: "#3E55BD"
    },
    secondary: {
      main: "#F17446",
      light: "#39a849"
    },
    text: {
      primary: "#333333",
      secondary: "#ffffff"
    },
    background: {
      default: "#ffffff",
      paper: "rgba(218,219,205,1)"
    }
  },

  typography: {
    allVariants: {
      fontFamily: "acumin-pro, sans-serif",
      fontWeight: 400
    },
    h1: {
      fontFamily: "ambroise-std, serif",
      fontWeight: 800,
      fontSize: 42,
      letterSpacing: "0.05em",
      [breakpoints.down("sm")]: {
        fontSize: "1.75rem"
      }
    },
    h2: {
      fontFamily: "ambroise-std, serif",
      fontWeight: 800,
      fontSize: 30,
    },
    h3: {
      fontSize: 26
    },
    h4: {
      fontSize: 20
    },
    body1: {
      fontSize: 18
    },
    h5: {
      fontSize: 16
    },
    h6: {
      fontSize: 12
    },
    body2: {
      fontSize: 16,
      lineHeight: 1.63
    },
  },

  props: {
    MuiAppBar: {
      elevation: 0,
      position: "fixed"
    },
    MuiTextField: {
      variant: "outlined",
      size: "small"
    }
  },

  overrides: {
    MuiCssBaseline: {
      "@global": {
        a: {
          textDecoration: "none"
        }
      }
    },
    MuiAppBar: {
      root: {
        backgroundColor: "#fff",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
      }
    },
    MuiToolbar: {
      root: {
        alignItems: "center",
        justifyContent: "space-between"
      }
    },
    MuiButton: {
      root: {
        borderRadius: 0,
        fontWeight: 500,
        [breakpoints.down(460)]: {
          height: 46,
          width: "100%"
        }
      },
      text: {
        textTransform: "initial"
      },
      outlined: {
        textTransform: "initial"
      },
      containedPrimary: {
        backgroundColor: "#3E55BD",
        textTransform: "initial"
      },
      outlinedPrimary: {
        borderColor: "#3E55BD",
        textTransform: "initial"
      },
      textPrimary: {
        color: "#3E55BD",
        textTransform: "initial"
      },
      containedSecondary: {
        backgroundColor: "#F17446",
        color: "#fff",
        textTransform: "initial"
      },
    }
  }
});