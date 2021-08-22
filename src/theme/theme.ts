import { createMuiTheme } from "@material-ui/core";

const { breakpoints } = createMuiTheme();

export default createMuiTheme({

  palette: {
    primary: {
      main: "#000000"
    },
    secondary: {
      main: "#F9473B",
      light: "#39a849"
    },
    text: {
      primary: "#333333",
      secondary: "#ffffff"
    },
    background: {
      default: "#E0E0E0",
      paper: "#ffffff"
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
      fontSize: 30
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
    }
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
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
      },
      colorPrimary: {
        backgroundColor: "#000"
      }
    },
    MuiToolbar: {
      root: {
        alignItems: "center",
        justifyContent: "space-between"
      }
    },
    MuiFormLabel: {
      root: {
        color: "rgba(0, 0, 0, 0.54)"
      }
    },
    MuiDivider: {
      root: {
        width: "100%"
      }
    }
  }
});