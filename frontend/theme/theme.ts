"use client";

import { createTheme } from "@mui/material/styles";

export const appTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#6a1b9a",
      light: "#9c4dcc",
      dark: "#38006b",
      contrastText: "#ffffff"
    },
    secondary: {
      main: "#e1bee7",
      dark: "#ce93d8",
      contrastText: "#4a148c"
    },
    background: {
      default: "#f3e5f5",
      paper: "#ffffff"
    },
    text: {
      primary: "#4a148c",
      secondary: "#7b1fa2"
    },
    success: { main: "#7b1fa2" }
  },
  typography: {
    fontFamily: "\"Poppins\", \"Trebuchet MS\", \"Segoe UI\", sans-serif",
    h1: {
      fontSize: "2.55rem",
      fontWeight: 800,
      lineHeight: 1.18,
      letterSpacing: "-0.03em"
    },
    h2: {
      fontWeight: 800,
      letterSpacing: "-0.02em"
    },
    h3: {
      fontWeight: 800,
      letterSpacing: "-0.02em"
    },
    h4: {
      fontWeight: 700
    },
    h6: {
      fontWeight: 700
    },
    button: {
      fontWeight: 700,
      letterSpacing: "-0.01em",
      textTransform: "none"
    }
  },
  shape: {
    borderRadius: 14
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          backgroundColor: "rgba(106, 27, 154, 0.95)",
          color: "#ffffff",
          backdropFilter: "blur(18px)",
          borderBottom: "1px solid rgba(255,255,255,0.08)"
        }
      }
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true
      },
      styleOverrides: {
        root: {
          borderRadius: 10,
          minHeight: 48,
          paddingInline: 22
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          border: "1px solid rgba(106, 27, 154, 0.08)",
          boxShadow: "0 22px 60px rgba(74, 20, 140, 0.08)"
        }
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: "#ffffff",
          borderRadius: 10
        },
        notchedOutline: {
          borderColor: "rgba(74, 20, 140, 0.12)"
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 10
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none"
        }
      }
    }
  }
});
