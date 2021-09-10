import React from "react";
import { useAppDispatch, useAppSelector } from "app/hooks";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { selectLocale, setLocale } from "features/locale/locale-slice";
import AccessTokenRefresh from "../containers/access-token-refresh";
import MainScreen from "./screens/main-screen";
import ManagementScreen from "./screens/management-screen";

/**
 * App component
 */
const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const { locale } = useAppSelector(selectLocale);

  React.useLayoutEffect(() => {
    dispatch(setLocale(locale));
    // eslint-disable-next-line
  }, []);

  return (
    <AccessTokenRefresh>
      <Router>
        <Switch>
          <Route
            path="/"
            exact
            component={ MainScreen }
          />
        </Switch>
        <Switch>
          <Route
            path="/management"
            exact
            component={ ManagementScreen }
          />
        </Switch>
      </Router>
    </AccessTokenRefresh>
  );
};

export default App;