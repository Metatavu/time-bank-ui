import React from "react";
import { useAppDispatch, useAppSelector } from "app/hooks";
import { selectLocale, setLocale } from "features/locale/locale-slice";
import MainScreen from "./screens/main-screen";

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
    <MainScreen/>
  );
};

export default App;