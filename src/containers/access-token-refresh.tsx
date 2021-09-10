import * as React from "react";
import { login, selectAuth } from "features/auth/auth-slice";
import AuthUtils from "utils/auth";
import { useAppDispatch, useAppSelector, useInterval } from "app/hooks";

/**
 * Component for keeping authentication token fresh
 *
 * @param props component properties
 */
const AccessTokenRefresh: React.FC = ({ children }) => {
  const dispatch = useAppDispatch();
  const { keycloak } = useAppSelector(selectAuth);
  const [ sessionChecked, setSessionChecked ] = React.useState(false);

  React.useEffect(() => {
    AuthUtils.initAuth()
      // eslint-disable-next-line @typescript-eslint/no-shadow
      .then(({ keycloak, accessToken }) => {
        dispatch(login({ keycloak: keycloak, accessToken: accessToken }));
      })
      .then(() => setSessionChecked(true))
      // eslint-disable-next-line no-console
      .catch(e => console.error(e));
    // eslint-disable-next-line
  }, []);

  useInterval(() => {
    AuthUtils.refreshAccessToken(keycloak)
      .then(accessToken => accessToken && dispatch(login({ keycloak: keycloak, accessToken: accessToken })));
  }, 1000 * 60);

  /**
   * Component render
   */
  return sessionChecked ? <>{ children }</> : null;
};

export default AccessTokenRefresh;