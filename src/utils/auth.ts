import Config from "app/config";
import { AuthState } from "features/auth/auth-slice";
import Keycloak, { KeycloakInstance } from "keycloak-js";
import { AccessToken } from "types";

/**
 * Utility class for authentication
 */
export default class AuthUtils {

  /**
   * Initializes keycloak instance
   *
   * @param keycloak keycloak instance
   */
  public static keycloakInit = (keycloak: KeycloakInstance) => {
    return new Promise<boolean>((resolve, reject) =>
      keycloak.init({ onLoad: "login-required", checkLoginIframe: false })
        .then(resolve)
        .catch(reject));
  };

  /**
   * Loads user profile from Keycloak
   *
   * @param keycloak keycloak instance
   */
  public static loadUserProfile = (keycloak: KeycloakInstance) => {
    return new Promise((resolve, reject) =>
      keycloak.loadUserProfile()
        .then(resolve)
        .catch(reject));
  };

  /**
   * Initializes authentication flow
   *
   * @returns promise of initialized auth state
   */
  public static initAuth = async (): Promise<AuthState> => {
    try {
      const keycloak = Keycloak(Config.get().auth);

      await AuthUtils.keycloakInit(keycloak);

      const { token, tokenParsed } = keycloak;

      if (!tokenParsed?.sub || !token) {
        return { keycloak: keycloak };
      }

      await AuthUtils.loadUserProfile(keycloak);
      const accessToken = AuthUtils.buildToken(keycloak);
      return { keycloak: keycloak, accessToken: accessToken };
    } catch (error) {
      return Promise.reject(error);
    }
  };

  /**
   * Refreshes access token
   *
   * @param keycloak keycloak instance
   * @returns refreshed access token or undefined
   */
  public static refreshAccessToken = async (keycloak?: KeycloakInstance): Promise<AccessToken | undefined> => {
    try {
      if (!keycloak?.authenticated) {
        return;
      }

      const refreshed = await keycloak.updateToken(70);
      if (!refreshed) {
        return;
      }

      const { token, tokenParsed } = keycloak;
      if (!tokenParsed || !tokenParsed.sub || !token) {
        return;
      }

      const accessToken = AuthUtils.buildToken(keycloak);
      return accessToken;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  };

  /**
   * Builds access token using Keycloak instance
   *
   * @param keycloak Keycloak instance
   * @returns access token or undefined if building fails
   */
  public static buildToken = (keycloak: KeycloakInstance): AccessToken | undefined => {
    const {
      token,
      tokenParsed,
      refreshToken,
      refreshTokenParsed,
      profile,
      realmAccess
    } = keycloak;

    if (!tokenParsed || !tokenParsed.sub || !token) {
      return undefined;
    }

    return {
      created: new Date(),
      access_token: token,
      expires_in: tokenParsed.exp,
      refresh_token: refreshToken,
      email: profile?.email,
      refresh_expires_in: refreshTokenParsed?.exp,
      firstName: profile?.firstName,
      lastName: profile?.lastName,
      userId: tokenParsed.sub,
      roles: realmAccess?.roles
    };
  };

  /**
   * Check if a user is admin
   *
   * @param accessToken access token
   * @returns boolean indicates if a user is admin
   */
  public static isAdmin = (accessToken?: AccessToken): boolean => {
    return !!accessToken?.roles && accessToken.roles.includes("admin");
  };

}