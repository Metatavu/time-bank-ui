import React from "react";
import { useAppDispatch } from "app/hooks";
import { setLocale } from "features/locale/locale-slice";
import strings from "localization/strings";
import MainScreen from "./screens/main-screen";

/**
 * App component
 */
const App: React.FC = () => {
  const dispatch = useAppDispatch();

  React.useLayoutEffect(() => {
    dispatch(setLocale(strings.getLanguage()));
    // eslint-disable-next-line
  }, []);

  return (
    // Add when Keycloak has been setup
    // <AccessTokenRefresh>
      <MainScreen/>
    // </AccessTokenRefresh>
  );
}

export default App;
