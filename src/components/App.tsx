import React from "react";
import { useAppDispatch, useAppSelector } from "app/hooks";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { selectLocale, setLocale } from "features/locale/locale-slice";
import MainScreen from "./screens/main-screen";
import ErrorHandler from "components/error-handler/error-handler";

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
    <ErrorHandler>
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
            component={ MainScreen }
          />
        </Switch>
      </Router>
    </ErrorHandler>
  );
};

export default App;