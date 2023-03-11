import {Theme, ThemeOptions} from "@mui/material/styles";

declare module "@mui/material/styles" {
  // Allow specification of custom theme properties
  interface CustomTheme extends Theme {
    // status: {
    //   danger: string;
    // };
  }

  // Allow configuration using `createTheme`
  interface CustomThemeOptions extends ThemeOptions {
    // status?: {
    //   danger?: string;
    // };
  }

  export function createTheme(options?: CustomThemeOptions): CustomTheme;
}
