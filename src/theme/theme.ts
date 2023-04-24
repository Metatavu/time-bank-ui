import { createTheme } from "@mui/material/styles";

const { breakpoints } = createTheme();

export default createTheme({

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
      fontFamily: "poppins, sans-serif"
    },
    h1: {
      fontWeight: 600,
      fontSize: 22,
      [breakpoints.down("sm")]: {
        fontSize: "1.75rem"
      }
    },
    h2: {
      fontWeight: 600,
      fontSize: 20
    },
    h3: {
      fontWeight: 100,
      fontSize: 20
    },
    h4: {
      fontWeight: 100,
      fontSize: 20,
      color: "rgba(0, 0, 0, 0.5)",
      fontStyle: "italic",
      paddingLeft: 16
    },
    body1: {
      fontSize: 14
    },
    h5: {
      fontSize: 16
    },
    h6: {
      fontSize: 12
    },
    body2: {
      fontSize: 14,
      fontWeight: 800
    }
  },

  components: {
    MuiAccordion: {
      styleOverrides: {
        root: {
          "&:before": {
            height: "0px !important"
          }
        }
      }
    },
    MuiAccordionSummary: {
      styleOverrides: {
        content: {
          margin: "0px !important"
        },
        root: {
          "&.Mui-expanded": {
            minHeight: "48px !important"
          }
        }
      }
    },
    MuiAppBar: {
      defaultProps: {
        elevation: 0,
        position: "fixed"
      },
      styleOverrides: {
        root: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between"
        },
        colorPrimary: {
          backgroundColor: "#000"
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 20
        }
      }
    },
    MuiCssBaseline: {
      styleOverrides: {
        "@global": {
          a: {
            textDecoration: "none"
          },
          "::-webkit-scrollbar": {
            width: "0.25rem"
          },
          "::-webkit-scrollbar-thumb": {
            backgroundColor: "#F9473B !important",
            borderRadius: 3
          }
        }
      }
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          width: "100%"
        }
      }
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          color: "rgba(0, 0, 0, 0.54)"
        }
      }
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          paddingTop: "0px !important",
          paddingBottom: "0px !important"
        }
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: "25px !important"
        }
      }
    },
    MuiTextField: {
      defaultProps: {
        variant: "outlined",
        size: "small"
      }
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          alignItems: "center",
          justifyContent: "center"
        }
      }
    }
  }
});