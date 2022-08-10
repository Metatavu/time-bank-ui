import { CssBaseline, responsiveFontSizes, ThemeProvider, Theme, StyledEngineProvider } from "@mui/material";
import { store } from "app/store";
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import App from "./components/App";
import reportWebVitals from "./reportWebVitals";
import theme from "theme/theme";
import ErrorHandler from "components/error-handler/error-handler";
import SyncOrUpdateHandler from "components/sync-or-update-handler/sync-or-update-handler";

declare module "@mui/styles/defaultTheme" {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme {}
}

ReactDOM.render(
  <React.StrictMode>
    <Provider store={ store }>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={ responsiveFontSizes(theme) }>
          <CssBaseline/>
          <SyncOrUpdateHandler>
            <ErrorHandler>

              <App/>
            </ErrorHandler>
          </SyncOrUpdateHandler>
        </ThemeProvider>
      </StyledEngineProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();