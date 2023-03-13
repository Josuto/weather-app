import {createTheme} from "@mui/material";

const theme = createTheme({
  palette: {
    primary: {
      light: "#757ce8",
      main: "#3f50b5",
      dark: "#002884",
      contrastText: "#fff",
    },
    secondary: {
      light: "#ff7961",
      main: "#f44336",
      dark: "#ba000d",
      contrastText: "#000",
    },
  },
  typography: {
    h1: {
      fontSize: "1.5rem",
      fontWeight: 550,
      lineHeight: 1.3,
      letterSpacing: 1,
      paddingBottom: 5,
    },
    h2: {
      fontSize: "1.25rem",
      fontWeight: 550,
      lineHeight: 1.2,
      letterSpacing: 0.15,
      paddingBottom: 3,
    },
    h3: {
      fontSize: "1.125rem",
      fontWeight: 550,
      lineHeight: 1.3,
      letterSpacing: 0.3,
      paddingBottom: 2,
    },
    h4: {
      fontSize: "1rem",
      fontWeight: 500,
      lineHeight: 1.3,
      letterSpacing: 0.25,
      paddingBottom: 2,
    },
    h5: {
      fontSize: "1rem",
      fontWeight: 500,
      lineHeight: 1.2,
      letterSpacing: 0.1,
      paddingBottom: 1,
    },
    h6: {
      fontSize: "0.875rem",
      fontWeight: 500,
      lineHeight: 1.4,
      letterSpacing: 0.15,
      paddingBottom: 1,
    },
    subtitle1: {
      fontSize: "1rem",
      fontWeight: 400,
      lineHeight: 1.6,
      letterSpacing: 0.15,
      paddingBottom: 1,
    },
    subtitle2: {
      fontSize: "0.875rem",
      fontWeight: 400,
      lineHeight: 1.5,
      letterSpacing: 0.15,
      paddingBottom: 1,
    },
    body1: {
      fontSize: "0.975rem",
      fontWeight: 400,
      lineHeight: 1.5,
      letterSpacing: 0.15,
    },
    body2: {
      fontSize: "0.65rem",
      fontWeight: 400,
      lineHeight: 1.4,
      letterSpacing: 0.15,
    },
    button: {
      textTransform: "none",
    },
    caption: {
      fontSize: "0.75rem",
      fontWeight: 400,
      lineHeight: 1.5,
      letterSpacing: 0.4,
    },
    overline: {
      fontSize: "0.875rem",
      fontWeight: 400,
      lineHeight: 1.4,
      letterSpacing: 0.15,
      textTransform: "uppercase",
    },
    fontFamily: ["IBM Plex Sans", "sans-serif"].join(","),
  },
});

export default theme;
