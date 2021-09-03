import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "app/store";
import { KeycloakInstance } from "keycloak-js";
import { AccessToken } from "types";

/**
 * Interface describing auth state in Redux
 */
export interface AuthState {
  keycloak?: KeycloakInstance;
  accessToken?: AccessToken;
}

/**
 * Initial auth state
 */
const initialState: AuthState = {
  keycloak: undefined,
  accessToken: undefined
};

/**
 * Auth slice of Redux store
 */
export const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    login: (state, { payload }: PayloadAction<AuthState>) => {
      const { keycloak, accessToken } = payload;
      state.keycloak = keycloak;
      state.accessToken = accessToken;
    },
    logout: state => {
      state.keycloak?.logout().then(() => {
        state.accessToken = undefined;
        state.keycloak = undefined;
      });
    }
  }
});

/**
 * Auth actions from created auth slice
 */
export const { login, logout } = authSlice.actions;

/**
 * Select Keycloak selector, used with useAppSelector custom hook defined for Redux store
 *
 * @param state Redux store root state
 * @returns keycloak instance from Redux store
 */
export const selectAuth = (state: RootState) => state.auth;

/**
 * Reducer for auth slice
 */
export default authSlice.reducer;